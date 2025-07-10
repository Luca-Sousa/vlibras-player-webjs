/**
 * Configurações principais do VLibras Player
 */
export interface PlayerConfig {
  /** URL do serviço de tradução */
  translator?: string;
  /** Caminho para os assets do Unity */
  targetPath?: string;
  /** Callback executado quando o player é carregado */
  onLoad?: () => void;
  /** Função customizada para exibir progresso de carregamento */
  progress?: (wrapper: HTMLElement) => any;
}

/**
 * Estados melhorados baseados no feedback do FUNCOES-UTILITARIAS-VLIBRAS.md
 * 
 * Estados mais claros e específicos para melhor UX
 */
export enum PlayerStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',     // Inicializando biblioteca
  LOADING_ASSETS = 'loading_assets', // Carregando assets do Unity
  READY = 'ready',                   // Pronto para usar
  TRANSLATING = 'translating',       // Convertendo texto para glosa
  PLAYING = 'playing',               // Reproduzindo animação
  PAUSED = 'paused',                 // Pausado
  COMPLETED = 'completed',           // Animação terminada
  ERROR = 'error'                    // Erro ocorrido
}

/**
 * Evento de mudança de estado com informações detalhadas
 */
export interface StateChangeEvent {
  state: PlayerStatus;
  previousState: PlayerStatus;
  progress?: number;        // 0-100 para loading/progress
  message?: string;         // Mensagem amigável para o usuário
  timestamp: number;        // Timestamp do evento
  details?: any;           // Detalhes específicos do estado
}

/**
 * Configuração de mensagens amigáveis para cada estado
 */
export interface StateMessages {
  [PlayerStatus.IDLE]: string;
  [PlayerStatus.INITIALIZING]: string;
  [PlayerStatus.LOADING_ASSETS]: string;
  [PlayerStatus.READY]: string;
  [PlayerStatus.TRANSLATING]: string;
  [PlayerStatus.PLAYING]: string;
  [PlayerStatus.PAUSED]: string;
  [PlayerStatus.COMPLETED]: string;
  [PlayerStatus.ERROR]: string;
}

/**
 * Mensagens padrão em português
 */
export const DEFAULT_STATE_MESSAGES: StateMessages = {
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

/**
 * Opções para tradução
 */
export interface TranslateOptions {
  /** Habilitar estatísticas de uso */
  isEnabledStats?: boolean;
}

/**
 * Opções para reprodução
 */
export interface PlayOptions {
  /** Indica se a reprodução vem de uma tradução */
  fromTranslation?: boolean;
  /** Habilitar estatísticas de uso */
  isEnabledStats?: boolean;
}

/**
 * Configurações de personalização do avatar
 */
export interface PersonalizationConfig {
  /** Configurações de aparência */
  appearance?: {
    skinColor?: string;
    hairColor?: string;
    clothingColor?: string;
  };
  /** Configurações de velocidade */
  speed?: number;
}

/**
 * Informações sobre o progresso da animação
 */
export interface AnimationProgress {
  /** Progresso atual (0-1) */
  current: number;
  /** Duração total */
  total: number;
  /** Tempo decorrido */
  elapsed: number;
}

/**
 * Eventos legacy - mantidos para compatibilidade
 * Para novos projetos, use PlayerEvents de VLibrasEvents.ts
 */
export interface LegacyPlayerEvents {
  /** Player foi carregado e está pronto */
  'load': () => void;
  /** Iniciou tradução */
  'translate:start': () => void;
  /** Terminou tradução */
  'translate:end': () => void;
  /** Iniciou reprodução da glosa */
  'gloss:start': () => void;
  /** Terminou reprodução da glosa */
  'gloss:end': (glossLength: string) => void;
  /** Animação iniciou */
  'animation:play': () => void;
  /** Animação pausou */
  'animation:pause': () => void;
  /** Animação terminou */
  'animation:end': () => void;
  /** Progresso da animação */
  'animation:progress': (progress: AnimationProgress) => void;
  /** Resposta com informações da glosa */
  'response:glosa': (counter: number, glossLength: string) => void;
  /** Informações do avatar */
  'GetAvatar': (avatar: any) => void;
  /** Boas-vindas iniciaram */
  'start:welcome': () => void;
  /** Boas-vindas terminaram */
  'stop:welcome': (finished: boolean) => void;
  /** Erro ocorreu */
  'error': (error: string) => void;
}

/**
 * Interface para o Unity Player
 */
export interface UnityPlayer {
  SendMessage: (objectName: string, methodName: string, value?: any) => void;
}

/**
 * Interface para o UnityLoader global
 */
export interface IUnityLoader {
  instantiate: (containerId: string, configPath: string, options: any) => UnityPlayer;
  SystemInfo: {
    hasWebGL: boolean;
  };
}

/**
 * Regiões suportadas
 */
export type SupportedRegion = 'BR' | 'PE' | 'RJ' | 'SP';

/**
 * Velocidades suportadas
 */
export type PlaybackSpeed = 0.5 | 1.0 | 1.5 | 2.0;
