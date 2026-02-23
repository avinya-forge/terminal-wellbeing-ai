import { describe, test, expect } from "bun:test";
import { KeyManager } from "./KeyManager";
import { encryptData, decryptData, generateKey } from "./encryption";

describe("KeyManager", () => {
  test("should generate a random salt", () => {
    const salt = KeyManager.generateSalt();
    expect(salt).toBeDefined();
    expect(salt.length).toBe(32); // 16 bytes * 2 hex chars/byte
    expect(/^[0-9a-f]+$/i.test(salt)).toBe(true);
  });

  test("should derive a key from password and salt", async () => {
    const password = "mySecretPassword";
    const salt = KeyManager.generateSalt();
    const key = await KeyManager.deriveKeyFromPassword(password, salt);

    expect(key).toBeDefined();
    // In bun:test, key.algorithm might not be fully populated or inspectable as expected, but we can verify it works
  });

  test("derived key should work for encryption/decryption", async () => {
    const password = "mySecretPassword";
    const salt = KeyManager.generateSalt();
    const key = await KeyManager.deriveKeyFromPassword(password, salt);

    const originalData = "Hello Secure World!";
    const encrypted = await encryptData(originalData, key);
    const decrypted = await decryptData(encrypted, key);

    expect(decrypted).toBe(originalData);
  });

  test("different passwords should produce different keys", async () => {
    const salt = KeyManager.generateSalt();
    const key1 = await KeyManager.deriveKeyFromPassword("pass1", salt);
    const key2 = await KeyManager.deriveKeyFromPassword("pass2", salt);

    const data = "test";
    const enc1 = await encryptData(data, key1);

    // Attempting to decrypt with key2 should fail or produce garbage (AES-GCM usually throws on tag mismatch)
    let failed = false;
    try {
        await decryptData(enc1, key2);
    } catch (e) {
        failed = true;
    }
    expect(failed).toBe(true);
  });

  test("different salts should produce different keys", async () => {
    const password = "pass";
    const salt1 = KeyManager.generateSalt();
    const salt2 = KeyManager.generateSalt();

    const key1 = await KeyManager.deriveKeyFromPassword(password, salt1);
    const key2 = await KeyManager.deriveKeyFromPassword(password, salt2);

    const data = "test";
    const enc1 = await encryptData(data, key1);

    let failed = false;
    try {
        await decryptData(enc1, key2);
    } catch (e) {
        failed = true;
    }
    expect(failed).toBe(true);
  });

  test("should rotate key correctly", async () => {
    const oldKey = await generateKey();
    const newKey = await generateKey();

    const data = "This data needs to be moved to a new key.";
    const encryptedOld = await encryptData(data, oldKey);

    const encryptedNew = await KeyManager.rotateKey(oldKey, newKey, encryptedOld);

    // Should be decryptable with new key
    const decryptedNew = await decryptData(encryptedNew, newKey);
    expect(decryptedNew).toBe(data);

    // Should NOT be decryptable with old key (AES-GCM throws)
    let failed = false;
    try {
        await decryptData(encryptedNew, oldKey);
    } catch (e) {
        failed = true;
    }
    expect(failed).toBe(true);
  });
});
