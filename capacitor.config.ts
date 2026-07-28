import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.innovatifyltd",
  appName: 'holisticare',
  webDir: 'dist/public',
  server: {
    // Allow opening hosted report/PDF assets from in-app WebView / window.open
    allowNavigation: [
      "vercel-backend-one-roan.vercel.app",
      "*.vercel.app",
      "*.amazonaws.com",
      "*.cloudfront.net",
      "*.googleapis.com",
      "*.googleusercontent.com",
    ],
  },
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