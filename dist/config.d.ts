/**
 * Configurações padrão do VLibras Player
 */
export declare const config: {
    /** URL base do serviço de tradução */
    readonly translatorUrl: "https://www.vlibras.gov.br/app/trad/1";
    /** URL do dicionário com estatísticas */
    readonly dictionaryUrl: "https://www.vlibras.gov.br/dict/";
    /** URL do dicionário estático (sem estatísticas) */
    readonly dictionaryStaticUrl: "https://www.vlibras.gov.br/dict-static/";
    /** Caminho padrão para os assets do Unity */
    readonly defaultTargetPath: "./target";
    /** Configurações padrão do Unity */
    readonly unity: {
        readonly containerId: "vlibras-game-container";
        readonly configFile: "playerweb.json";
        readonly loaderFile: "UnityLoader.js";
    };
    /** Timeout padrão para requisições (ms) */
    readonly requestTimeout: 30000;
    /** Regiões suportadas */
    readonly supportedRegions: readonly ["BR", "PE", "RJ", "SP"];
    /** Velocidades suportadas */
    readonly supportedSpeeds: readonly [0.5, 1, 1.5, 2];
};
//# sourceMappingURL=config.d.ts.map