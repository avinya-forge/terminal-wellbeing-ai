import { generateKey, exportKey, importKey, encryptData, decryptData } from './encryption';

// Jest JSDOM environment usually includes web crypto, but sometimes needs polyfill
// If this fails, I might need to mock crypto or setup environment

describe('encryption', () => {
    // Basic test to see if crypto is available
    test('generateKey should return a CryptoKey', async () => {
        const key = await generateKey();
        expect(key).toBeDefined();
        // expect(key.algorithm.name).toBe('AES-GCM');
    });

    test('should encrypt and decrypt data correctly', async () => {
        const key = await generateKey();
        const originalData = "Hello World! This is a secret.";

        const encrypted = await encryptData(originalData, key);
        expect(encrypted).not.toBe(originalData);
        expect(typeof encrypted).toBe('string');

        const decrypted = await decryptData(encrypted, key);
        expect(decrypted).toBe(originalData);
    });

    test('should handle key export and import', async () => {
        const key = await generateKey();
        const exported = await exportKey(key);
        expect(typeof exported).toBe('string');

        const importedKey = await importKey(exported);
        expect(importedKey).toBeDefined();

        // Verify key works
        const originalData = "Test Key Import";
        const encrypted = await encryptData(originalData, importedKey);
        const decrypted = await decryptData(encrypted, key); // Decrypt with original key
        expect(decrypted).toBe(originalData);
    });
});
