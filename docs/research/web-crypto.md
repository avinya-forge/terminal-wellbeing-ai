# Web Crypto API Research & Implementation

## Overview
This document outlines the implementation strategy for cryptographic operations within the Terminal Wellbeing AI project, specifically for fulfilling the requirements of [EPIC-5.1] Local Data Encryption.

We utilize the **Web Crypto API (`window.crypto.subtle`)** for all cryptographic operations to ensure performance, security, and standard compliance across modern browsers.

## Core Components

### 1. Symmetric Encryption (AES-GCM)
We use **AES-GCM (Galois/Counter Mode)** for encrypting user data (Journal entries, Memories, Profile). AES-GCM provides both confidentiality and integrity (via authentication tags).

**Parameters:**
- **Algorithm:** AES-GCM
- **Key Length:** 256 bits
- **IV (Initialization Vector):** 12 bytes (96 bits), unique per encryption operation.
- **Tag Length:** 128 bits (default).

**Implementation:**
- `encryptData(data, key)`: Generates a random IV, encrypts the data, and prepends the IV to the ciphertext.
- `decryptData(encryptedData, key)`: Extracts the IV from the start of the data and decrypts the rest.

### 2. Key Derivation (PBKDF2)
To support user-provided passwords or stable device identifiers without storing the raw key, we use **PBKDF2 (Password-Based Key Derivation Function 2)**.

**Parameters:**
- **Algorithm:** PBKDF2
- **Hash Function:** SHA-256
- **Iterations:** 100,000 (Balance between security and client-side performance).
- **Salt:** 16 bytes, randomly generated per user/key.
- **Derived Key Algorithm:** AES-GCM (256 bits).

**Implementation:**
- `KeyManager.deriveKeyFromPassword(password, salt)`:
    1. Imports the password as key material (`PBKDF2`).
    2. Derives an AES-GCM key using the salt and iteration count.

### 3. Key Management
- **Key Generation:** `crypto.subtle.generateKey` for random session keys.
- **Key Export/Import:** Keys can be exported to JWK (JSON Web Key) format for storage in `localStorage` (if not using password derivation).
- **Key Rotation:** `KeyManager.rotateKey(oldKey, newKey, data)` decrypts with the old key and re-encrypts with the new key.

## Security Considerations
- **IV Reuse:** We generate a fresh random IV for every encryption operation (`crypto.getRandomValues`).
- **Salt Uniqueness:** Each user/derived key has a unique random salt.
- **Key Storage:**
    - If using random keys (auto-login), the key is stored in `localStorage` (obfuscation/at-rest encryption).
    - If using password derivation, the key is *never* stored; only the salt is stored. The key is re-derived on session start.
- **Memory Hardening:** PBKDF2 iterations are set to 100,000 to resist brute-force attacks.

## Compatibility
- Works natively in all modern browsers (Chrome, Firefox, Safari, Edge).
- Tested in Node.js environments via `node:crypto` polyfill in `jest.setup.js`.
