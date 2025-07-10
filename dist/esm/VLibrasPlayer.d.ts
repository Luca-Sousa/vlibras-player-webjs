import { PlayerConfig, PlayerStatus, TranslateOptions, PlayOptions, PersonalizationConfig, PlaybackSpeed, SupportedRegion } from './types';
/**
 * VLibras Player - Classe principal para controle do avatar de Libras
 */
export declare class VLibrasPlayer {
    private options;
    private playerManager;
    private translator;
    private text?;
    private gloss?;
    private eventEmitter;
    private loaded;
    private gameContainer?;
    private player?;
    private status;
    private region;
    private globalGlossLength;
    constructor(options?: PlayerConfig);
    /**
     * Configura eventos do PlayerManager
     */
    private setupPlayerManagerEvents;
    /**
     * Carrega o player no elemento wrapper especificado
     */
    load(wrapper: HTMLElement): void;
    /**
     * Traduz texto para glosa e reproduz
     */
    translate(text: string, options?: TranslateOptions): void;
    /**
     * Reproduz glosa
     */
    play(gloss?: string, options?: PlayOptions): void;
    /**
     * Reproduz mensagem de boas-vindas
     */
    playWelcome(): void;
    /**
     * Continua reprodução
     */
    continue(): void;
    /**
     * Repete reprodução atual
     */
    repeat(): void;
    /**
     * Pausa reprodução
     */
    pause(): void;
    /**
     * Para reprodução
     */
    stop(): void;
    /**
     * Define velocidade de reprodução
     */
    setSpeed(speed: PlaybackSpeed): void;
    /**
     * Define personalização do avatar
     */
    setPersonalization(personalization: PersonalizationConfig): void;
    /**
     * Muda avatar
     */
    changeAvatar(avatarName: string): void;
    /**
     * Alterna legendas
     */
    toggleSubtitle(): void;
    /**
     * Define região
     */
    setRegion(region: SupportedRegion): void;
    getStatus(): PlayerStatus;
    getText(): string | undefined;
    getGloss(): string | undefined;
    isLoaded(): boolean;
    getRegion(): SupportedRegion;
    private isDefaultUrl;
    private getTargetScript;
    private joinUrl;
    private initializeUnity;
    private changeStatus;
    protected onLoad(): void;
    protected onTranslateStart(): void;
    protected onTranslateEnd(): void;
    protected onGlossStart(): void;
    protected onGlossEnd(_glossLength: string): void;
    protected onAnimationPlay(): void;
    protected onAnimationPause(): void;
    protected onAnimationEnd(): void;
    protected onAnimationProgress(_progress: number): void;
    protected onGlossResponse(_counter: number, _glossLength: string): void;
    protected onGetAvatar(_avatar: any): void;
    protected onStartWelcome(): void;
    protected onStopWelcome(_finished: boolean): void;
    protected onError(error: string): void;
    /**
     * Adiciona listener para eventos do player
     */
    on<K extends keyof import('./VLibrasEvents').PlayerEvents>(event: K, listener: (data: import('./VLibrasEvents').PlayerEvents[K]) => void): () => void;
    /**
     * Remove listener de evento
     */
    off<K extends keyof import('./VLibrasEvents').PlayerEvents>(event: K, listener: (data: import('./VLibrasEvents').PlayerEvents[K]) => void): void;
    /**
     * Configura Unity Bridge automaticamente
     */
    setupUnityBridge(): void;
    /**
     * Aplica CSS otimizado automaticamente
     */
    setupOptimizedCSS(containerSelector?: string): void;
    /**
     * Executa diagnósticos do sistema
     */
    runDiagnostics(): Promise<import("./VLibrasDevTools").DiagnosticResult>;
    /**
     * Ativa modo debug
     */
    enableDebugMode(): void;
    /**
     * Obtém estatísticas do player
     */
    getStats(): {
        status: PlayerStatus;
        loaded: boolean;
        region: SupportedRegion;
        text: string | undefined;
        gloss: string | undefined;
    };
}
//# sourceMappingURL=VLibrasPlayer.d.ts.map