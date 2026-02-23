// Helper to get crypto object
export const getCrypto = () => {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  // Fallback for Node environment (tests)
  if (typeof global !== 'undefined' && global.crypto) {
    return global.crypto;
  }
  throw new Error('Crypto API not available');
};

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

export async function generateKey(): Promise<CryptoKey> {
  const crypto = getCrypto();
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const crypto = getCrypto();
  const exported = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
}

export async function importKey(jwkString: string): Promise<CryptoKey> {
  const crypto = getCrypto();
  const jwk = JSON.parse(jwkString);
  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const crypto = getCrypto();
  const encoded = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  // Combine IV and encrypted data for storage
  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);

  return arrayBufferToBase64(combined);
}

export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  const crypto = getCrypto();

  const combined = base64ToArrayBuffer(encryptedData);

  // Extract IV and data
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}
