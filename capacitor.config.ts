import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.innovatifyltd",
  appName: 'Holosticare',
  webDir: 'dist/public',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 0
    }    
  },  
};


export default config;