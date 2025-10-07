import { useState } from "react";
import { registerPlugin } from "@capacitor/core";

interface AuthenticateOptions {
  appId: string;
  appSecret: string;
  externalId: string;
}

interface SahhaPlugin {
  authenticate(options: AuthenticateOptions): Promise<void>;
  connect(): Promise<{ heartRate?: number; steps?: number }>;
}

const Sahha = registerPlugin<SahhaPlugin>("SahhaPlugin");

export function useSahha() {
  const [isInitialized, setInitialized] = useState(false);
  const [data, setData] = useState<{ heartRate?: number; steps?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async (appId: string, appSecret: string, externalId: string) => {
    try {
      await Sahha.authenticate({ appId, appSecret, externalId });
      setInitialized(true);
      setError(null);
    } catch (err: any) {
      alert(err.message || String(err));
      setError(err?.message || String(err) || "Authentication failed");
    }
  };

  const connect = async () => {
    try {
      const result = await Sahha.connect();
      setData(result);
      setError(null);
    } catch (err: any) {
      alert(err.message || String(err));
      setError(err?.message || String(err) || "Connect failed");
    }
  };

  return { isInitialized, data, error, authenticate, connect };
}
