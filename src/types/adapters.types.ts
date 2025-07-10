/**
 * Tipos dos adaptadores externos
 * Interface Segregation: Contratos específicos para integrações
 */

// React Adapter Types
export interface VLibrasReactProps {
  text?: string;
  width?: number;
  height?: string | number;
  responsive?: boolean;
  theme?: 'light' | 'dark' | 'high-contrast' | 'auto';
  preset?: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: Record<string, any>;
  children?: any;
}

export interface UseVLibrasOptions {
  autoLoad?: boolean;
  preset?: string;
  theme?: 'light' | 'dark' | 'high-contrast' | 'auto';
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export interface UseVLibrasReturn {
  player: any; // VLibrasPlayer instance
  translate: (text: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  isLoaded: boolean;
  isPlaying: boolean;
  error: Error | null;
}

// Testing Adapter Types
export interface MockPlayerConfig {
  simulateLoading?: boolean;
  loadingDelay?: number;
  simulateErrors?: boolean;
  errorRate?: number;
  responseDelay?: number;
}

export interface TestAssertion {
  name: string;
  condition: () => boolean | Promise<boolean>;
  message: string;
  timeout?: number;
}

export interface TestSuite {
  name: string;
  description?: string;
  beforeEach?: () => void | Promise<void>;
  afterEach?: () => void | Promise<void>;
  tests: TestCase[];
}

export interface TestCase {
  name: string;
  description?: string;
  test: () => void | Promise<void>;
  timeout?: number;
  skip?: boolean;
  only?: boolean;
}

export interface TestResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestCaseResult[];
}

export interface TestCaseResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
}
