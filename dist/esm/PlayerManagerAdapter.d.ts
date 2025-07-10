import { UnityPlayer, PersonalizationConfig, PlaybackSpeed } from './types';
/**
 * Tipo para callbacks de eventos
 */
export type EventCallback = (...args: any[]) => void;
/**
 * Adapter para gerenciar comunicação com o Unity Player
 */
export declare class PlayerManagerAdapter {
    private player;
    private listeners;
    currentBaseUrl: string;
    constructor();
    /**
     * Adiciona listener para evento
     */
    on(event: string, callback: EventCallback): void;
    /**
     * Remove listener de evento
     */
    off(event: string, callback: EventCallback): void;
    /**
     * Emite evento
     */
    private emit;
    /**
     * Define a referência do Unity Player
     */
    setPlayerReference(player: UnityPlayer): void;
    /**
     * Define a URL base para recursos
     */
    setBaseUrl(url: string): void;
    /**
     * Reproduz uma glosa
     */
    play(gloss?: string): void;
    /**
     * Reproduz mensagem de boas-vindas
     */
    playWellcome(): void;
    /**
     * Pausa a reprodução
     */
    pause(): void;
    /**
     * Para a reprodução
     */
    stop(): void;
    /**
     * Define a velocidade de reprodução
     */
    setSpeed(speed: PlaybackSpeed): void;
    /**
     * Define personalização do avatar
     */
    setPersonalization(personalization: PersonalizationConfig): void;
    /**
     * Muda o avatar
     */
    changeAvatar(avatarName: string): void;
    /**
     * Alterna exibição de legendas
     */
    toggleSubtitle(): void;
    /**
     * Envia mensagem para o Unity Player
     */
    private sendMessage;
    /**
     * Manipuladores para eventos do Unity (devem ser chamados pelo Unity)
     */
    /**
     * Chamado pelo Unity quando há progresso na animação
     */
    onProgress(progress: number): void;
    /**
     * Chamado pelo Unity quando o estado muda
     */
    onStateChange(isPlaying: boolean, isPaused: boolean, isLoading: boolean): void;
    /**
     * Chamado pelo Unity com contador de glosa
     */
    onCounterGloss(counter: number, glosaLength: string): void;
    /**
     * Chamado pelo Unity com informações do avatar
     */
    onGetAvatar(avatar: any): void;
    /**
     * Chamado pelo Unity quando termina boas-vindas
     */
    onFinishWelcome(finished: boolean): void;
}
//# sourceMappingURL=PlayerManagerAdapter.d.ts.map