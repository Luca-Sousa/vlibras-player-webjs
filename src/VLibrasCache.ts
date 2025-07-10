/**
 * Sistema de cache inteligente para VLibras Player
 * Implementa diferentes estratégias de cache e preload
 */

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number; // Time to live em segundos
  size: number; // Tamanho em bytes
  accessCount: number;
  lastAccess: number;
}

export interface CacheStrategy {
  type: 'memory' | 'localStorage' | 'indexedDB' | 'hybrid';
  maxSize: number; // MB
  ttl: number; // Time to live em segundos
  compression: boolean;
  encryption?: boolean;
  maxEntries?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: number;
  currentSize: number;
  maxSize: number;
  entries: number;
  oldestEntry: number;
  newestEntry: number;
}

export interface PredictiveCacheConfig {
  enabled: boolean;
  relatedWordsLimit: number;
  commonWordsLimit: number;
  contextWords: Record<string, string[]>;
}

/**
 * Cache principal do VLibras
 */
export class VLibrasCache {
  private static instance: VLibrasCache;
  private strategy: CacheStrategy;
  private memoryCache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    hitRate: 0,
    currentSize: 0,
    maxSize: 0,
    entries: 0,
    oldestEntry: 0,
    newestEntry: 0
  };

  private constructor(strategy: CacheStrategy) {
    this.strategy = strategy;
    this.stats.maxSize = strategy.maxSize * 1024 * 1024; // Convert MB to bytes
  }

  /**
   * Obtém instância singleton
   */
  static getInstance(strategy?: CacheStrategy): VLibrasCache {
    if (!this.instance) {
      this.instance = new VLibrasCache(strategy || {
        type: 'hybrid',
        maxSize: 50,
        ttl: 3600, // 1 hora
        compression: true,
        maxEntries: 1000
      });
    }
    return this.instance;
  }

  /**
   * Configura estratégia de cache
   */
  static configure(strategy: Partial<CacheStrategy>): void {
    const instance = this.getInstance();
    instance.strategy = { ...instance.strategy, ...strategy };
    instance.stats.maxSize = instance.strategy.maxSize * 1024 * 1024;
  }

  /**
   * Armazena item no cache
   */
  async set<T>(key: string, data: T, customTtl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttl: customTtl || this.strategy.ttl,
      size: this.calculateSize(data),
      accessCount: 0,
      lastAccess: Date.now()
    };

    // Verifica se precisa liberar espaço
    await this.ensureSpace(entry.size);

    // Armazena baseado na estratégia
    await this.storeEntry(entry);

    this.updateStats();
  }

  /**
   * Recupera item do cache
   */
  async get<T>(key: string): Promise<T | null> {
    this.stats.totalRequests++;

    const entry = await this.retrieveEntry<T>(key);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Verifica TTL
    if (this.isExpired(entry)) {
      await this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Atualiza estatísticas de acesso
    entry.accessCount++;
    entry.lastAccess = Date.now();
    await this.storeEntry(entry);

    this.stats.hits++;
    this.updateHitRate();

    return entry.data;
  }

  /**
   * Remove item do cache
   */
  async delete(key: string): Promise<boolean> {
    const deleted = await this.deleteEntry(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.strategy.type === 'localStorage' || this.strategy.type === 'hybrid') {
      this.clearLocalStorage();
    }
    
    if (this.strategy.type === 'indexedDB' || this.strategy.type === 'hybrid') {
      await this.clearIndexedDB();
    }

    this.resetStats();
  }

  /**
   * Verifica se uma chave existe no cache
   */
  async has(key: string): Promise<boolean> {
    const entry = await this.retrieveEntry(key);
    return entry !== null && !this.isExpired(entry);
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Preload de palavras comuns
   */
  async preloadCommonWords(words: string[]): Promise<void> {
    console.log(`📦 Preload de ${words.length} palavras comuns...`);
    
    for (const word of words) {
      if (!(await this.has(`gloss:${word}`))) {
        // Simula tradução e armazena
        // TODO: Integrar com serviço real de tradução
        const mockGloss = `gloss_data_for_${word}`;
        await this.set(`gloss:${word}`, mockGloss, this.strategy.ttl * 2); // TTL maior para palavras comuns
      }
    }
    
    console.log('✅ Preload concluído');
  }

  /**
   * Cache preditivo - precarrega palavras relacionadas
   */
  async enablePredictiveCache(config: PredictiveCacheConfig): Promise<void> {
    if (!config.enabled) return;

    // TODO: Implementar IA para sugerir palavras relacionadas
    console.log('🤖 Cache preditivo ativado');
  }

  /**
   * Cache por contexto
   */
  async preloadForContext(context: 'dictionary' | 'quiz' | 'tutorial'): Promise<void> {
    const contextWords: Record<string, string[]> = {
      dictionary: ['olá', 'obrigado', 'por favor', 'com licença', 'desculpa'],
      quiz: ['correto', 'errado', 'parabéns', 'tente novamente', 'próxima'],
      tutorial: ['início', 'continuar', 'próximo', 'anterior', 'fim']
    };

    const words = contextWords[context] || [];
    await this.preloadCommonWords(words);
  }

  /**
   * Calcula tamanho de um objeto
   */
  private calculateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Aproximação UTF-16
    } catch {
      return 1024; // Fallback
    }
  }

  /**
   * Verifica se entrada está expirada
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.timestamp + (entry.ttl * 1000);
  }

  /**
   * Garante espaço disponível no cache
   */
  private async ensureSpace(requiredSize: number): Promise<void> {
    if (this.stats.currentSize + requiredSize <= this.stats.maxSize) {
      return;
    }

    // Estratégia LRU - remove os menos usados
    const entries = Array.from(this.memoryCache.values())
      .sort((a, b) => a.lastAccess - b.lastAccess);

    let freedSize = 0;
    for (const entry of entries) {
      if (freedSize >= requiredSize) break;
      
      await this.delete(entry.key);
      freedSize += entry.size;
    }
  }

  /**
   * Armazena entrada baseado na estratégia
   */
  private async storeEntry<T>(entry: CacheEntry<T>): Promise<void> {
    switch (this.strategy.type) {
      case 'memory':
        this.memoryCache.set(entry.key, entry);
        break;
      
      case 'localStorage':
        await this.storeInLocalStorage(entry);
        break;
      
      case 'indexedDB':
        await this.storeInIndexedDB(entry);
        break;
      
      case 'hybrid':
        // Pequenos no memory, grandes no localStorage/IndexedDB
        if (entry.size < 10 * 1024) { // 10KB
          this.memoryCache.set(entry.key, entry);
        } else {
          await this.storeInIndexedDB(entry);
        }
        break;
    }
  }

  /**
   * Recupera entrada baseado na estratégia
   */
  private async retrieveEntry<T>(key: string): Promise<CacheEntry<T> | null> {
    // Tenta memory cache primeiro
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      return memoryEntry as CacheEntry<T>;
    }

    // Tenta localStorage
    if (this.strategy.type === 'localStorage' || this.strategy.type === 'hybrid') {
      const localEntry = await this.retrieveFromLocalStorage<T>(key);
      if (localEntry) return localEntry;
    }

    // Tenta IndexedDB
    if (this.strategy.type === 'indexedDB' || this.strategy.type === 'hybrid') {
      const idbEntry = await this.retrieveFromIndexedDB<T>(key);
      if (idbEntry) return idbEntry;
    }

    return null;
  }

  /**
   * Remove entrada baseado na estratégia
   */
  private async deleteEntry(key: string): Promise<boolean> {
    let deleted = false;

    if (this.memoryCache.has(key)) {
      this.memoryCache.delete(key);
      deleted = true;
    }

    if (this.strategy.type === 'localStorage' || this.strategy.type === 'hybrid') {
      try {
        localStorage.removeItem(`vlibras:${key}`);
        deleted = true;
      } catch {}
    }

    if (this.strategy.type === 'indexedDB' || this.strategy.type === 'hybrid') {
      try {
        await this.deleteFromIndexedDB(key);
        deleted = true;
      } catch {}
    }

    return deleted;
  }

  /**
   * Armazena no localStorage
   */
  private async storeInLocalStorage<T>(entry: CacheEntry<T>): Promise<void> {
    try {
      const data = this.strategy.compression 
        ? this.compress(JSON.stringify(entry))
        : JSON.stringify(entry);
      
      localStorage.setItem(`vlibras:${entry.key}`, data);
    } catch (error) {
      console.warn('Erro ao armazenar no localStorage:', error);
    }
  }

  /**
   * Recupera do localStorage
   */
  private async retrieveFromLocalStorage<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const data = localStorage.getItem(`vlibras:${key}`);
      if (!data) return null;

      const parsedData = this.strategy.compression 
        ? JSON.parse(this.decompress(data))
        : JSON.parse(data);

      return parsedData as CacheEntry<T>;
    } catch {
      return null;
    }
  }

  /**
   * Armazena no IndexedDB
   */
  private async storeInIndexedDB<T>(_entry: CacheEntry<T>): Promise<void> {
    // TODO: Implementar IndexedDB storage
    console.log('IndexedDB storage não implementado ainda');
  }

  /**
   * Recupera do IndexedDB
   */
  private async retrieveFromIndexedDB<T>(_key: string): Promise<CacheEntry<T> | null> {
    // TODO: Implementar IndexedDB retrieval
    return null;
  }

  /**
   * Remove do IndexedDB
   */
  private async deleteFromIndexedDB(_key: string): Promise<void> {
    // TODO: Implementar IndexedDB deletion
  }

  /**
   * Limpa localStorage
   */
  private clearLocalStorage(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('vlibras:')) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Limpa IndexedDB
   */
  private async clearIndexedDB(): Promise<void> {
    // TODO: Implementar IndexedDB clear
  }

  /**
   * Comprime dados (implementação simples)
   */
  private compress(data: string): string {
    // TODO: Implementar compressão real (LZ-string, gzip, etc.)
    return btoa(data);
  }

  /**
   * Descomprime dados
   */
  private decompress(data: string): string {
    try {
      return atob(data);
    } catch {
      return data;
    }
  }

  /**
   * Atualiza estatísticas gerais
   */
  private updateStats(): void {
    this.stats.entries = this.memoryCache.size;
    this.stats.currentSize = Array.from(this.memoryCache.values())
      .reduce((total, entry) => total + entry.size, 0);

    if (this.stats.entries > 0) {
      const timestamps = Array.from(this.memoryCache.values()).map(e => e.timestamp);
      this.stats.oldestEntry = Math.min(...timestamps);
      this.stats.newestEntry = Math.max(...timestamps);
    }
  }

  /**
   * Atualiza taxa de acerto
   */
  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalRequests > 0 
      ? this.stats.hits / this.stats.totalRequests 
      : 0;
  }

  /**
   * Reseta estatísticas
   */
  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      hitRate: 0,
      currentSize: 0,
      maxSize: this.stats.maxSize,
      entries: 0,
      oldestEntry: 0,
      newestEntry: 0
    };
  }
}

/**
 * Utilitários de cache
 */
export class VLibrasCacheUtils {
  /**
   * Cria chave de cache baseada em parâmetros
   */
  static createKey(type: string, ...params: any[]): string {
    return `${type}:${params.map(p => String(p)).join(':')}`;
  }

  /**
   * Estima tamanho ideal de cache baseado no dispositivo
   */
  static getOptimalCacheSize(): number {
    const memory = (performance as any).memory;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (memory) {
      // Usa 5% da memória disponível
      const availableMemory = memory.jsHeapSizeLimit;
      const optimalSize = (availableMemory * 0.05) / (1024 * 1024); // Convert to MB
      return Math.min(optimalSize, isMobile ? 25 : 100);
    }

    return isMobile ? 10 : 50; // Fallback
  }

  /**
   * Migra cache antigo para nova versão
   */
  static async migrateCache(oldVersion: string, newVersion: string): Promise<void> {
    console.log(`🔄 Migrando cache de ${oldVersion} para ${newVersion}`);
    
    // TODO: Implementar migração baseada na versão
    const cache = VLibrasCache.getInstance();
    await cache.clear(); // Por enquanto, limpa cache antigo
    
    console.log('✅ Migração de cache concluída');
  }
}

// Exporta instância singleton
export const vlibrasCache = VLibrasCache.getInstance();
