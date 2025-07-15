import { IVLibrasPlugin, PluginContext } from '../interfaces/IPlugin';

/**
 * Plugin exemplo para notificações de acessibilidade
 */
export class AccessibilityNotifierPlugin implements IVLibrasPlugin {
  name = 'accessibility-notifier';
  version = '1.0.0';
  description = 'Fornece notificações auditivas e visuais para melhor acessibilidade';
  
  private announcements: HTMLDivElement | null = null;

  async init(context: PluginContext): Promise<void> {
    console.log('♿ Accessibility Notifier Plugin iniciado');
    
    // Criar região de anúncios para leitores de tela
    this.createAnnouncementRegion();
    
    // Configurar eventos
    this.setupEventListeners(context);
  }

  private createAnnouncementRegion(): void {
    this.announcements = document.createElement('div');
    this.announcements.id = 'vlibras-accessibility-announcements';
    this.announcements.setAttribute('aria-live', 'polite');
    this.announcements.setAttribute('aria-atomic', 'true');
    this.announcements.style.position = 'absolute';
    this.announcements.style.left = '-10000px';
    this.announcements.style.width = '1px';
    this.announcements.style.height = '1px';
    this.announcements.style.overflow = 'hidden';
    
    document.body.appendChild(this.announcements);
  }

  private announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcements) return;

    this.announcements.setAttribute('aria-live', priority);
    this.announcements.textContent = message;

    // Limpar após um tempo
    setTimeout(() => {
      if (this.announcements) {
        this.announcements.textContent = '';
      }
    }, 1000);
  }

  private setupEventListeners(context: PluginContext): void {
    if (context.events) {
      context.events.on('player:ready', () => {
        this.announce('VLibras carregado e pronto para uso');
        this.showVisualNotification('✅ VLibras Pronto', 'success');
      });

      context.events.on('translation:start', () => {
        this.announce('Iniciando tradução para Libras');
        this.showVisualNotification('🔄 Traduzindo...', 'info');
      });

      context.events.on('translation:complete', () => {
        this.announce('Tradução concluída');
        this.showVisualNotification('✅ Tradução Concluída', 'success');
      });

      context.events.on('animation:start', () => {
        this.announce('Reproduzindo tradução em Libras');
        this.showVisualNotification('▶️ Reproduzindo', 'info');
      });

      context.events.on('animation:complete', () => {
        this.announce('Reprodução da tradução concluída');
      });

      context.events.on('player:error', (data: any) => {
        this.announce(`Erro no VLibras: ${data.error?.message || 'Erro desconhecido'}`, 'assertive');
        this.showVisualNotification('❌ Erro no VLibras', 'error');
      });
    }
  }

  private showVisualNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const notification = document.createElement('div');
    notification.className = `vlibras-notification vlibras-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      max-width: 300px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animar entrada
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });

    // Remover após alguns segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  private getNotificationColor(type: string): string {
    const colors = {
      success: '#10B981',
      error: '#EF4444', 
      info: '#3B82F6',
      warning: '#F59E0B'
    };
    return colors[type as keyof typeof colors] || colors.info;
  }

  async destroy(): Promise<void> {
    console.log('♿ Accessibility Notifier Plugin destruído');
    
    if (this.announcements && this.announcements.parentNode) {
      this.announcements.parentNode.removeChild(this.announcements);
    }
  }

  hooks = {
    beforePlay: async (text: string): Promise<string> => {
      this.announce(`Preparando para reproduzir tradução de ${text.length} caracteres`);
      return text;
    },

    onReady: async (): Promise<void> => {
      this.announce('Sistema VLibras inicializado com suporte a acessibilidade');
    }
  };
}
