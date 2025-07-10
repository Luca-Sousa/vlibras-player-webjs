"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManagerAdapter = void 0;
/**
 * Adapter para gerenciar comunicação com o Unity Player
 */
class PlayerManagerAdapter {
    constructor() {
        this.player = null;
        this.listeners = {};
        this.currentBaseUrl = '';
        // Torna os métodos de callback globalmente acessíveis para o Unity
        window.VLibrasPlayerManagerAdapter = this;
    }
    /**
     * Adiciona listener para evento
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    /**
     * Remove listener de evento
     */
    off(event, callback) {
        const callbacks = this.listeners[event];
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    /**
     * Emite evento
     */
    emit(event, ...args) {
        const callbacks = this.listeners[event];
        if (callbacks) {
            callbacks.forEach((callback) => {
                try {
                    callback(...args);
                }
                catch (error) {
                    console.warn(`Erro no callback do evento ${event}:`, error);
                }
            });
        }
    }
    /**
     * Define a referência do Unity Player
     */
    setPlayerReference(player) {
        this.player = player;
        this.emit('load');
    }
    /**
     * Define a URL base para recursos
     */
    setBaseUrl(url) {
        this.currentBaseUrl = url;
        if (this.player) {
            this.sendMessage('Avatar', 'setUrl', url);
        }
    }
    /**
     * Reproduz uma glosa
     */
    play(gloss) {
        if (!this.player)
            return;
        if (gloss) {
            this.sendMessage('Avatar', 'setGlosa', gloss);
        }
        this.sendMessage('Avatar', 'play', '');
    }
    /**
     * Reproduz mensagem de boas-vindas
     */
    playWellcome() {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'playWelcome', '');
    }
    /**
     * Pausa a reprodução
     */
    pause() {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'pause', '');
    }
    /**
     * Para a reprodução
     */
    stop() {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'stop', '');
    }
    /**
     * Define a velocidade de reprodução
     */
    setSpeed(speed) {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'setSpeed', speed.toString());
    }
    /**
     * Define personalização do avatar
     */
    setPersonalization(personalization) {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'setPersonalization', JSON.stringify(personalization));
    }
    /**
     * Muda o avatar
     */
    changeAvatar(avatarName) {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'changeAvatar', avatarName);
    }
    /**
     * Alterna exibição de legendas
     */
    toggleSubtitle() {
        if (!this.player)
            return;
        this.sendMessage('Avatar', 'toggleSubtitle', '');
    }
    /**
     * Envia mensagem para o Unity Player
     */
    sendMessage(objectName, methodName, value) {
        if (this.player && this.player.SendMessage) {
            try {
                this.player.SendMessage(objectName, methodName, value);
            }
            catch (error) {
                console.warn('Erro ao enviar mensagem para Unity:', error);
            }
        }
    }
    /**
     * Manipuladores para eventos do Unity (devem ser chamados pelo Unity)
     */
    /**
     * Chamado pelo Unity quando há progresso na animação
     */
    onProgress(progress) {
        this.emit('progress', progress);
    }
    /**
     * Chamado pelo Unity quando o estado muda
     */
    onStateChange(isPlaying, isPaused, isLoading) {
        this.emit('stateChange', isPlaying, isPaused, isLoading);
    }
    /**
     * Chamado pelo Unity com contador de glosa
     */
    onCounterGloss(counter, glosaLength) {
        this.emit('CounterGloss', counter, glosaLength);
    }
    /**
     * Chamado pelo Unity com informações do avatar
     */
    onGetAvatar(avatar) {
        this.emit('GetAvatar', avatar);
    }
    /**
     * Chamado pelo Unity quando termina boas-vindas
     */
    onFinishWelcome(finished) {
        this.emit('FinishWelcome', finished);
    }
}
exports.PlayerManagerAdapter = PlayerManagerAdapter;
//# sourceMappingURL=PlayerManagerAdapter.js.map