"use strict";
// Jest setup file
Object.defineProperty(window, 'location', {
    value: {
        host: 'localhost:3000'
    },
    writable: true
});
// Mock fetch globally
globalThis.fetch = jest.fn();
// Mock UnityLoader
globalThis.UnityLoader = {
    instantiate: jest.fn(() => ({
        SendMessage: jest.fn()
    })),
    SystemInfo: {
        hasWebGL: true
    }
};
//# sourceMappingURL=setup.js.map