/*
  you may want to put the following into a file tests/setup.ts
  and then specify your vite.config.ts as such

      import { defineConfig } from "vitest/config";

      export default defineConfig({
        test: {
          setupFiles: ["tests/setup.ts"],
        },
      });

  to add the custom mat chers before each test run
*/
import { expect } from 'vitest';
import {
  toReceiveCommandTimes,
  toHaveReceivedCommandTimes,
  toReceiveCommandOnce,
  toHaveReceivedCommandOnce,
  toReceiveCommand,
  toHaveReceivedCommand,
  toReceiveCommandWith,
  toHaveReceivedCommandWith,
  toReceiveNthCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveLastCommandWith,
  toHaveReceivedLastCommandWith,
} from 'aws-sdk-client-mock-vitest';

expect.extend({
  toReceiveCommandTimes,
  toHaveReceivedCommandTimes,
  toReceiveCommandOnce,
  toHaveReceivedCommandOnce,
  toReceiveCommand,
  toHaveReceivedCommand,
  toReceiveCommandWith,
  toHaveReceivedCommandWith,
  toReceiveNthCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveLastCommandWith,
  toHaveReceivedLastCommandWith,
});
