#!/usr/bin/env node

// Set up crypto polyfill before importing Vite
import { webcrypto } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto;
}

// Also ensure getRandomValues is available
if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  globalThis.crypto.getRandomValues = webcrypto.getRandomValues;
}

// Now import and run Vite
import { createServer } from 'vite';
import { resolve } from 'path';

const configPath = resolve('./vite.config.ts');
const config = await import(configPath);

const server = await createServer(config.default);
await server.listen(); 