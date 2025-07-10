/**
 * Estados melhorados baseados no feedback do FUNCOES-UTILITARIAS-VLIBRAS.md
 *
 * Estados mais claros e específicos para melhor UX
 */
export var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus["IDLE"] = "idle";
    PlayerStatus["INITIALIZING"] = "initializing";
    PlayerStatus["LOADING_ASSETS"] = "loading_assets";
    PlayerStatus["READY"] = "ready";
    PlayerStatus["TRANSLATING"] = "translating";
    PlayerStatus["PLAYING"] = "playing";
    PlayerStatus["PAUSED"] = "paused";
    PlayerStatus["COMPLETED"] = "completed";
    PlayerStatus["ERROR"] = "error"; // Erro ocorrido
})(PlayerStatus || (PlayerStatus = {}));
/**
 * Mensagens padrão em português
 */
export const DEFAULT_STATE_MESSAGES = {
    [PlayerStatus.IDLE]: 'Aguardando...',
    [PlayerStatus.INITIALIZING]: 'Inicializando player...',
    [PlayerStatus.LOADING_ASSETS]: 'Carregando assets...',
    [PlayerStatus.READY]: 'Pronto para usar!',
    [PlayerStatus.TRANSLATING]: 'Traduzindo texto...',
    [PlayerStatus.PLAYING]: 'Reproduzindo em Libras',
    [PlayerStatus.PAUSED]: 'Pausado',
    [PlayerStatus.COMPLETED]: 'Tradução concluída!',
    [PlayerStatus.ERROR]: 'Erro ocorrido'
};
//# sourceMappingURL=index.js.map