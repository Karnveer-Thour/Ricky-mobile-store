import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/App.tsx";
import "./styles/index.css";
import { GOOGLE_CLIENT_ID } from "./app/services/googleAuth.ts";
import { registerServiceWorker } from "./sw-register.ts";

// Initialize PWA Service Worker
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
);

