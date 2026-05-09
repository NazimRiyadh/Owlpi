// Polyfill globalThis.crypto for Node.js < 23
// bcryptjs v3.x expects the Web Crypto API (crypto.getRandomValues) to be
// globally available. Node.js only makes it a true global in v23+.
// This preload script ensures it's available before any other module loads.
import { webcrypto } from "node:crypto";

if (typeof globalThis.crypto === "undefined") {
    globalThis.crypto = webcrypto;
}
("");
