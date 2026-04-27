import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),

    // Stamps dist/sw.js with a unique build timestamp on every production build.
    // Reads from src/ so Vite's public-dir copy never races with this write.
    {
      name: 'stamp-sw',
      closeBundle() {
        const stamp = Date.now().toString();
        const src = path.resolve(__dirname, 'src/sw-template.js');
        const dest = path.resolve(__dirname, 'dist/sw.js');
        const content = fs.readFileSync(src, 'utf8').replace('__BUILD_TIMESTAMP__', stamp);
        fs.writeFileSync(dest, content);
      },
    },

    // Uploads source maps to Sentry and deletes the .map files from dist/ so
    // they are never served publicly. Only active when SENTRY_AUTH_TOKEN is set
    // (i.e. in CI / Vercel build environment).
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            sourcemaps: {
              filesToDeleteAfterUpload: ['./dist/assets/*.js.map'],
            },
            telemetry: false,
          }),
        ]
      : []),
  ],

  build: {
    // Source maps required for Sentry to show readable stack traces.
    // The Sentry plugin uploads them and deletes the .map files afterward.
    sourcemap: true,
  },
});
