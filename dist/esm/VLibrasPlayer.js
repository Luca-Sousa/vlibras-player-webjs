import { config } from './config';
import { PlayerManagerAdapter } from './PlayerManagerAdapter';
import { GlosaTranslator } from './GlosaTranslator';
import { PlayerStatus } from './types';
import { setupUnityBridge } from './UnityBridge';
import { setupOptimizedCSS } from './VLibrasCSS';
import { VLibrasEventEmitter } from './VLibrasEvents';
import { VLibrasDevTools } from './VLibrasDevTools';
/**
 * VLibras Player - Classe principal para controle do avatar de Libras
 */
export class VLibrasPlayer {
    constructor(options = {}) {
        this.loaded = false;
        this.status = PlayerStatus.IDLE;
        this.region = 'BR';
        this.globalGlossLength = '';
        this.options = {
            translator: options.translator || config.translatorUrl,
            targetPath: options.targetPath || config.defaultTargetPath,
            onLoad: options.onLoad || (() => { }),
            progress: options.progress || (() => null)
        };
        this.playerManager = new PlayerManagerAdapter();
        this.translator = new GlosaTranslator(this.options.translator);
        this.eventEmitter = new VLibrasEventEmitter();
        this.setupPlayerManagerEvents();
    }
    /**
     * Configura eventos do PlayerManager
     */
    setupPlayerManagerEvents() {
        this.playerManager.on('load', () => {
            this.loaded = true;
            this.onLoad();
            this.playerManager.setBaseUrl(config.dictionaryUrl + this.region + '/');
            if (this.options.onLoad) {
                this.options.onLoad();
            }
            else {
                this.play(undefined, { fromTranslation: true });
            }
        });
        this.playerManager.on('progress', (progress) => {
            this.onAnimationProgress(progress);
        });
        this.playerManager.on('stateChange', (isPlaying, isPaused, isLoading) => {
            if (isPaused) {
                this.onAnimationPause();
            }
            else if (isPlaying && !isPaused) {
                this.onAnimationPlay();
                this.changeStatus(PlayerStatus.PLAYING);
            }
            else if (!isPlaying && !isLoading) {
                this.onAnimationEnd();
                this.changeStatus(PlayerStatus.IDLE);
            }
        });
        this.playerManager.on('CounterGloss', (counter, glossLength) => {
            this.onGlossResponse(counter, glossLength);
            this.globalGlossLength = glossLength;
        });
        this.playerManager.on('GetAvatar', (avatar) => {
            this.onGetAvatar(avatar);
        });
        this.playerManager.on('FinishWelcome', (finished) => {
            this.onStopWelcome(finished);
        });
    }
    /**
     * Carrega o player no elemento wrapper especificado
     */
    load(wrapper) {
        this.gameContainer = document.createElement('div');
        this.gameContainer.setAttribute('id', config.unity.containerId);
        this.gameContainer.classList.add('emscripten');
        wrapper.appendChild(this.gameContainer);
        this.initializeUnity();
    }
    /**
     * Traduz texto para glosa e reproduz
     */
    translate(text, options = {}) {
        const { isEnabledStats = true } = options;
        this.onTranslateStart();
        if (this.loaded) {
            this.stop();
        }
        this.text = text;
        const callback = (gloss, error) => {
            if (error) {
                if (error === 'timeout_error') {
                    this.onError('timeout_error');
                }
                else {
                    this.onTranslateEnd();
                    return;
                }
            }
            if (gloss) {
                this.play(gloss, { fromTranslation: true, isEnabledStats });
            }
            this.onTranslateEnd();
        };
        this.translator.translate(text, window.location.host, callback);
    }
    /**
     * Reproduz glosa
     */
    play(gloss, options = {}) {
        const { isEnabledStats = true } = options;
        // Gerencia URLs de dicionário baseado em estatísticas
        if (!isEnabledStats && this.isDefaultUrl()) {
            this.playerManager.setBaseUrl(config.dictionaryStaticUrl + this.region + '/');
        }
        else if (isEnabledStats && !this.isDefaultUrl()) {
            this.playerManager.setBaseUrl(config.dictionaryUrl + this.region + '/');
        }
        this.gloss = gloss || this.gloss;
        if (this.gloss !== undefined && this.loaded) {
            this.changeStatus(PlayerStatus.INITIALIZING);
            this.playerManager.play(this.gloss);
        }
    }
    /**
     * Reproduz mensagem de boas-vindas
     */
    playWelcome() {
        this.playerManager.playWellcome();
        this.onStartWelcome();
    }
    /**
     * Continua reprodução
     */
    continue() {
        this.playerManager.play();
    }
    /**
     * Repete reprodução atual
     */
    repeat() {
        this.play();
    }
    /**
     * Pausa reprodução
     */
    pause() {
        this.playerManager.pause();
    }
    /**
     * Para reprodução
     */
    stop() {
        this.playerManager.stop();
    }
    /**
     * Define velocidade de reprodução
     */
    setSpeed(speed) {
        this.playerManager.setSpeed(speed);
    }
    /**
     * Define personalização do avatar
     */
    setPersonalization(personalization) {
        this.playerManager.setPersonalization(personalization);
    }
    /**
     * Muda avatar
     */
    changeAvatar(avatarName) {
        this.playerManager.changeAvatar(avatarName);
    }
    /**
     * Alterna legendas
     */
    toggleSubtitle() {
        this.playerManager.toggleSubtitle();
    }
    /**
     * Define região
     */
    setRegion(region) {
        this.region = region;
        this.playerManager.setBaseUrl(config.dictionaryUrl + region + '/');
    }
    // Getters públicos
    getStatus() {
        return this.status;
    }
    getText() {
        return this.text;
    }
    getGloss() {
        return this.gloss;
    }
    isLoaded() {
        return this.loaded;
    }
    getRegion() {
        return this.region;
    }
    // Métodos privados
    isDefaultUrl() {
        return this.playerManager.currentBaseUrl === config.dictionaryUrl + this.region + '/';
    }
    getTargetScript() {
        return this.joinUrl(this.options.targetPath, config.unity.loaderFile);
    }
    joinUrl(...parts) {
        return parts.join('/').replace(/\/+/g, '/').replace(/\/$/, '');
    }
    initializeUnity() {
        const targetSetup = this.joinUrl(this.options.targetPath, config.unity.configFile);
        const targetScript = document.createElement('script');
        targetScript.src = this.getTargetScript();
        targetScript.onload = () => {
            const unityLoader = window.UnityLoader;
            if (!unityLoader) {
                this.onError('unity_loader_not_found');
                return;
            }
            this.player = unityLoader.instantiate(config.unity.containerId, targetSetup, {
                compatibilityCheck: (_, accept, deny) => {
                    if (unityLoader.SystemInfo.hasWebGL) {
                        return accept();
                    }
                    this.onError('unsupported');
                    alert('Seu navegador não suporta WebGL');
                    console.error('Seu navegador não suporta WebGL');
                    deny();
                }
            });
            this.playerManager.setPlayerReference(this.player);
        };
        targetScript.onerror = () => {
            this.onError('unity_script_load_failed');
        };
        document.body.appendChild(targetScript);
    }
    changeStatus(status) {
        switch (status) {
            case PlayerStatus.IDLE:
                if (this.status === PlayerStatus.PLAYING) {
                    this.status = status;
                    this.onGlossEnd(this.globalGlossLength);
                }
                break;
            case PlayerStatus.INITIALIZING:
                this.status = status;
                break;
            case PlayerStatus.PLAYING:
                if (this.status === PlayerStatus.INITIALIZING) {
                    this.status = status;
                    this.onGlossStart();
                }
                break;
        }
    }
    // Event handlers - podem ser sobrescritos
    onLoad() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onTranslateStart() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onTranslateEnd() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onGlossStart() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onGlossEnd(_glossLength) {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onAnimationPlay() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onAnimationPause() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onAnimationEnd() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onAnimationProgress(_progress) {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onGlossResponse(_counter, _glossLength) {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onGetAvatar(_avatar) {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onStartWelcome() {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onStopWelcome(_finished) {
        // Implementação padrão vazia - pode ser sobrescrita
    }
    onError(error) {
        console.error('VLibras Player Error:', error);
        this.eventEmitter.emit('player:error', {
            error: new Error(error),
            player: this,
            timestamp: Date.now()
        });
    }
    // === NOVAS FUNCIONALIDADES v2.1.0 ===
    /**
     * Adiciona listener para eventos do player
     */
    on(event, listener) {
        return this.eventEmitter.on(event, listener);
    }
    /**
     * Remove listener de evento
     */
    off(event, listener) {
        this.eventEmitter.off(event, listener);
    }
    /**
     * Configura Unity Bridge automaticamente
     */
    setupUnityBridge() {
        setupUnityBridge();
    }
    /**
     * Aplica CSS otimizado automaticamente
     */
    setupOptimizedCSS(containerSelector) {
        setupOptimizedCSS(containerSelector);
    }
    /**
     * Executa diagnósticos do sistema
     */
    async runDiagnostics() {
        return await VLibrasDevTools.runDiagnostics();
    }
    /**
     * Ativa modo debug
     */
    enableDebugMode() {
        VLibrasDevTools.enableDebugMode();
    }
    /**
     * Obtém estatísticas do player
     */
    getStats() {
        return {
            status: this.status,
            loaded: this.loaded,
            region: this.region,
            text: this.text,
            gloss: this.gloss
        };
    }
}
//# sourceMappingURL=VLibrasPlayer.js.map