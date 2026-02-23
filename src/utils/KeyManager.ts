import { encryptData, decryptData, getCrypto } from './encryption';

export class KeyManager {
  private static ITERATIONS = 100000;
  private static KEY_LENGTH = 256;
  private static DIGEST = 'SHA-256';

  /**
   * Generates a random salt for key derivation.
   * @param length Length of the salt in bytes (default 16).
   * @returns The salt as a hex string.
   */
  static generateSalt(length: number = 16): string {
    const crypto = getCrypto();
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Derives a CryptoKey from a password and salt using PBKDF2.
   * The derived key is suitable for AES-GCM encryption.
   * @param password The user's password.
   * @param salt The salt (hex string).
   * @returns A Promise resolving to the AES-GCM CryptoKey.
   */
  static async deriveKeyFromPassword(password: string, salt: string): Promise<CryptoKey> {
    const crypto = getCrypto();
    const enc = new TextEncoder();

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    // Convert hex salt back to Uint8Array with validation
    const hexBytes = salt.match(/.{1,2}/g);
    if (!hexBytes) {
      throw new Error('Invalid salt format: must be a hex string');
    }
    const saltBuffer = new Uint8Array(hexBytes.map(byte => parseInt(byte, 16)));

    // Derive the key
    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: KeyManager.ITERATIONS,
        hash: KeyManager.DIGEST
      },
      keyMaterial,
      { name: "AES-GCM", length: KeyManager.KEY_LENGTH },
      true, // extractable
      ["encrypt", "decrypt"]
    );
  }

  /**
   * Rotates a key by re-encrypting data with a new key.
   * @param oldKey The current key used to encrypt the data.
   * @param newKey The new key to re-encrypt the data with.
   * @param encryptedData The currently encrypted data string.
   * @returns A Promise resolving to the data encrypted with the new key.
   */
  static async rotateKey(oldKey: CryptoKey, newKey: CryptoKey, encryptedData: string): Promise<string> {
    // 1. Decrypt with old key
    const decrypted = await decryptData(encryptedData, oldKey);

    // 2. Encrypt with new key
    const reEncrypted = await encryptData(decrypted, newKey);

    return reEncrypted;
  }
}
