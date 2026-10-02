import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';

// Locator assertions only, so CI can run without a model API key.
export default {
  targets: [
    {
      engine: web(),
      app: {
        url: 'http://127.0.0.1:0',
        command: {
          executable: 'node',
          args: ['scripts/serve.mjs'],
          env: { PORT: '{port}' },
          log: '.e2e/logs/app.log',
        },
      },
    },
  ],
} satisfies E2EConfig;
