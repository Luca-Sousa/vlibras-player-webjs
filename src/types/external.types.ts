/**
 * Tipos para dependências externas
 * Dependency Inversion: Abstrações para bibliotecas externas
 */

// Unity WebGL Types
export interface UnityInstance {
  SendMessage(gameObjectName: string, methodName: string, value?: any): void;
  SetFullscreen(fullscreen: boolean): void;
  Quit(): Promise<void>;
}

export interface UnityLoader {
  instantiate(container: HTMLElement, buildUrl: string, parameters?: any): Promise<UnityInstance>;
}

// Browser APIs
export interface MediaDevicesAPI {
  getUserMedia?(constraints: MediaStreamConstraints): Promise<MediaStream>;
  enumerateDevices?(): Promise<MediaDeviceInfo[]>;
}

export interface WebGLContextAttributes {
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  antialias?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
  desynchronized?: boolean;
}

// Storage APIs
export interface StorageAPI {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
}

export interface IndexedDBAPI {
  open(name: string, version?: number): IDBOpenDBRequest;
  deleteDatabase(name: string): IDBOpenDBRequest;
  cmp(first: any, second: any): number;
}

// Network APIs
export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface NetworkInformation {
  readonly effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
}

// Performance APIs
export interface PerformanceObserverEntry {
  readonly duration: number;
  readonly entryType: string;
  readonly name: string;
  readonly startTime: number;
}

export interface MemoryInfo {
  readonly jsHeapSizeLimit: number;
  readonly totalJSHeapSize: number;
  readonly usedJSHeapSize: number;
}

// Error Types
export interface VLibrasError extends Error {
  code: string;
  category: 'network' | 'unity' | 'configuration' | 'runtime' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  metadata?: Record<string, any>;
  timestamp: number;
}
