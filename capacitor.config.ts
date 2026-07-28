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
      // Keep native splash until BootGate hides it after network check
      launchAutoHide: false,
      launchShowDuration: 10000,
      backgroundColor: "#ffffff",
      showSpinner: false,
    },
  },
};


export default config;
