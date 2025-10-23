import { registerPlugin } from '@capacitor/core';

// تعریف interface متدهای پلاگین
export interface SahhaPluginInterface {
  connect(): Promise<{ heartRate?: number; steps?: number }>;
  initialize(options: { appId: string; appSecret: string; env: string }): Promise<void>;
}

// ثبت پلاگین با تایپ مشخص
export const SahhaPlugin = registerPlugin<SahhaPluginInterface>('SahhaPlugin');