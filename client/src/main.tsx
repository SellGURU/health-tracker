import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { mockAuth } from "./lib/mock-auth";
import { createMockApiInterceptor } from "./lib/mock-api";
import './api/axios';
import { StatusBar, Style } from '@capacitor/status-bar';
// Enable mock mode in development
if (import.meta.env.DEV) {
  mockAuth.enableMockMode();
  createMockApiInterceptor();
}
StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setBackgroundColor({ color: '#ffffff' });

createRoot(document.getElementById("root")!).render(<App />);
