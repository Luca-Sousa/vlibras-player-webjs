/**
 * Configurações padrão do VLibras Player
 */
export const config = {
  /** URL base do serviço de tradução */
  translatorUrl: 'https://www.vlibras.gov.br/app/trad/1',
  
  /** URL do dicionário com estatísticas */
  dictionaryUrl: 'https://www.vlibras.gov.br/dict/',
  
  /** URL do dicionário estático (sem estatísticas) */
  dictionaryStaticUrl: 'https://www.vlibras.gov.br/dict-static/',
  
  /** Caminho padrão para os assets do Unity */
  defaultTargetPath: './target',
  
  /** Configurações padrão do Unity */
  unity: {
    containerId: 'vlibras-game-container',
    configFile: 'playerweb.json',
    loaderFile: 'UnityLoader.js'
  },
  
  /** Timeout padrão para requisições (ms) */
  requestTimeout: 30000,
  
  /** Regiões suportadas */
  supportedRegions: ['BR', 'PE', 'RJ', 'SP'] as const,
  
  /** Velocidades suportadas */
  supportedSpeeds: [0.5, 1.0, 1.5, 2.0] as const
} as const;
