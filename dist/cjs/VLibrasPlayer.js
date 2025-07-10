"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VLibrasPlayer = void 0;
const config_1 = require("./config");
const PlayerManagerAdapter_1 = require("./PlayerManagerAdapter");
const GlosaTranslator_1 = require("./GlosaTranslator");
const types_1 = require("./types");
const UnityBridge_1 = require("./UnityBridge");
const VLibrasCSS_1 = require("./VLibrasCSS");
const VLibrasEvents_1 = require("./VLibrasEvents");
const VLibrasDevTools_1 = require("./VLibrasDevTools");
/**
 * VLibras Player - Classe principal para controle do avatar de Libras
 */
class VLibrasPlayer {
    constructor(options = {}) {
        this.loaded = false;
        this.status = types_1.PlayerStatus.IDLE;
        this.region = 'BR';
        this.globalGlossLength = '';
        this.options = {
            translator: options.translator || config_1.config.translatorUrl,
            targetPath: options.targetPath || config_1.config.defaultTargetPath,
            onLoad: options.onLoad || (() => { }),
            progress: options.progress || (() => null)
        };
        this.playerManager = new PlayerManagerAdapter_1.PlayerManagerAdapter();
        this.translator = new GlosaTranslator_1.GlosaTranslator(this.options.translator);
        this.eventEmitter = new VLibrasEvents_1.VLibrasEventEmitter();
        this.setupPlayerManagerEvents();
    }
    /**
     * Configura eventos do PlayerManager
     */
    setupPlayerManagerEvents() {
        this.playerManager.on('load', () => {
            this.loaded = true;
            this.onLoad();
            this.playerManager.setBaseUrl(config_1.config.dictionaryUrl + this.region + '/');
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
                this.changeStatus(types_1.PlayerStatus.PLAYING);
            }
            else if (!isPlaying && !isLoading) {
                this.onAnimationEnd();
                this.changeStatus(types_1.PlayerStatus.IDLE);
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
        this.gameContainer.setAttribute('id', config_1.config.unity.containerId);
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
            this.playerManager.setBaseUrl(config_1.config.dictionaryStaticUrl + this.region + '/');
        }
        else if (isEnabledStats && !this.isDefaultUrl()) {
            this.playerManager.setBaseUrl(config_1.config.dictionaryUrl + this.region + '/');
        }
        this.gloss = gloss || this.gloss;
        if (this.gloss !== undefined && this.loaded) {
            this.changeStatus(types_1.PlayerStatus.INITIALIZING);
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
        this.playerManager.setBaseUrl(config_1.config.dictionaryUrl + region + '/');
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
        return this.playerManager.currentBaseUrl === config_1.config.dictionaryUrl + this.region + '/';
    }
    getTargetScript() {
        return this.joinUrl(this.options.targetPath, config_1.config.unity.loaderFile);
    }
    joinUrl(...parts) {
        return parts.join('/').replace(/\/+/g, '/').replace(/\/$/, '');
    }
    initializeUnity() {
        const targetSetup = this.joinUrl(this.options.targetPath, config_1.config.unity.configFile);
        const targetScript = document.createElement('script');
        targetScript.src = this.getTargetScript();
        targetScript.onload = () => {
            const unityLoader = window.UnityLoader;
            if (!unityLoader) {
                this.onError('unity_loader_not_found');
                return;
            }
            this.player = unityLoader.instantiate(config_1.config.unity.containerId, targetSetup, {
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
            case types_1.PlayerStatus.IDLE:
                if (this.status === types_1.PlayerStatus.PLAYING) {
                    this.status = status;
                    this.onGlossEnd(this.globalGlossLength);
                }
                break;
            case types_1.PlayerStatus.INITIALIZING:
                this.status = status;
                break;
            case types_1.PlayerStatus.PLAYING:
                if (this.status === types_1.PlayerStatus.INITIALIZING) {
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
        (0, UnityBridge_1.setupUnityBridge)();
    }
    /**
     * Aplica CSS otimizado automaticamente
     */
    setupOptimizedCSS(containerSelector) {
        (0, VLibrasCSS_1.setupOptimizedCSS)(containerSelector);
    }
    /**
     * Executa diagnósticos do sistema
     */
    async runDiagnostics() {
        return await VLibrasDevTools_1.VLibrasDevTools.runDiagnostics();
    }
    /**
     * Ativa modo debug
     */
    enableDebugMode() {
        VLibrasDevTools_1.VLibrasDevTools.enableDebugMode();
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
exports.VLibrasPlayer = VLibrasPlayer;
//# sourceMappingURL=VLibrasPlayer.js.map