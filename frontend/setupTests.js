// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Alias global para usar jest.* en los tests aunque uses Vitest
globalThis.jest = vi;
globalThis.jest.fn = vi.fn;
globalThis.jest.mock = (...args) => vi.mock(...args);
// Esta línea es clave para que jest.requireActual funcione en ESM
globalThis.jest.requireActual = async (path) => vi.importActual(path);
