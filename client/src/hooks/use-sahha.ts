import { useState } from "react";
import { registerPlugin } from "@capacitor/core";

interface InitializeOptions {
  appId: string;
  appSecret: string;
  env: "PRODUCTION" | "SANDBOX";
}

interface SahhaPlugin {
  initialize(options: InitializeOptions): Promise<void>;
  connect(): Promise<{ heartRate?: number; steps?: number }>;
}

const Sahha = registerPlugin<SahhaPlugin>("SahhaPlugin");

export function useSahha() {
  const [isInitialized, setInitialized] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const initialize = async (appId: string, appSecret: string, env: "PRODUCTION" | "SANDBOX" = "PRODUCTION") => {
    try {
      await Sahha.initialize({ appId, appSecret, env });
      setInitialized(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Initialization failed");
    }
  };

  const connect = async () => {
    try {
      const result = await Sahha.connect();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Connect failed");
    }
  };

  return { isInitialized, data, error, initialize, connect };
}
