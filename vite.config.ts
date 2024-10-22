import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Added .web.* extensions to be compatible with react-native-web.
// Reference: https://stereobooster.com/posts/react-native-web-with-vite/#final-config
// Note: Default extensions are ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
// Addtl Ref: https://v2.vitejs.dev/config/#resolve-extensions
const extensions = [
  ".mjs",
  ".web.tsx",
  ".tsx",
  ".web.ts",
  ".ts",
  ".web.jsx",
  ".jsx",
  ".web.js",
  ".js",
  ".css",
  ".json",
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // needed for react-native-web
  },

  resolve: {
    extensions: extensions,
    alias: {
      "react-native": "react-native-web",
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      jsx: "automatic",
      loader: { ".js": "jsx" },
    },
  },
});
