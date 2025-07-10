// Jest setup file
Object.defineProperty(window, 'location', {
  value: {
    host: 'localhost:3000'
  },
  writable: true
});

// Mock fetch globally
(globalThis as any).fetch = jest.fn();

// Mock UnityLoader
(globalThis as any).UnityLoader = {
  instantiate: jest.fn(() => ({
    SendMessage: jest.fn()
  })),
  SystemInfo: {
    hasWebGL: true
  }
};
