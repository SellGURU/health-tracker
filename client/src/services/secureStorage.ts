import { SecureStorage } from "@aparajita/capacitor-secure-storage";
import { Capacitor } from "@capacitor/core";

const STORAGE_KEY = "health_credentials";

export type StoredCredentials = Record<string, unknown> & {
  email: string;
  password: string;
};

export const secureStorage = {
  async save(email: string, password: string): Promise<void> {
    if (Capacitor.getPlatform() === "web") return;

    const data: StoredCredentials = {
      email,
      password,
    };

    await SecureStorage.set(STORAGE_KEY, data);
  },

  async get(): Promise<StoredCredentials | null> {
    if (Capacitor.getPlatform() === "web") return null;

    try {
      const value = await SecureStorage.get(STORAGE_KEY);
      if (!value) return null;

      return value as StoredCredentials;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    if (Capacitor.getPlatform() === "web") return;

    await SecureStorage.remove(STORAGE_KEY);
  },
};

// import { SecureStorage } from '@aparajita/capacitor-secure-storage';

// const KEY = 'biometric_credentials';

// export async function saveCredentials(email: string, password: string) {
//   await SecureStorage.set(KEY, {
//     email,
//     password,
//   });
// }

// export async function getCredentials(): Promise<{
//   email: string;
//   password: string;
// } | null> {
//   try {
//     return (await SecureStorage.get(KEY)) as {
//       email: string;
//       password: string;
//     };
//   } catch {
//     return null;
//   }
// }

// export async function clearCredentials() {
//   await SecureStorage.remove(KEY);
// }
