import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Config, IBattleCardGameConfig } from '../lib/config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Default stack', async () => {
    process.env['ENVIRONMENT'] = undefined;
    const config = await Config.parseConfig<IBattleCardGameConfig>(join(__dirname, 'config'));
    expect(config.stackId).toBe('CustomProject');
    expect(config.projectId).toBe('custom-project');
    expect(config.camelCase('Test')).toBe('CustomProjectTest');
    expect(config.kebabCase('Test')).toBe('custom-project-test');
    const { values } = config;
    expect(values.domainName).toBe('my.custom.domain');
    expect(values.hostedZoneId).toBe('XXX');
  });

  test('Dev environment stack', async () => {
    process.env['ENVIRONMENT'] = 'dev';
    process.env['GIT_VERSION'] = 'jfijsdf';
    const config = await Config.parseConfig<IBattleCardGameConfig>(join(__dirname, 'config'));
    expect(config.stackId).toBe('CustomProjectDev');
    expect(config.projectId).toBe('custom-project-dev');
    expect(config.camelCase('Test')).toBe('CustomProjectTestDev');
    expect(config.kebabCase('Test')).toBe('custom-project-test-dev');
    const { values } = config;
    expect(values.domainName).toBe('dev.my.custom.domain');
    expect(values.hostedZoneId).toBe('YYY');
  });

  test('Non existing environment stack', async () => {
    process.env['ENVIRONMENT'] = 'non-existing';
    expect.assertions(1);
    try {
      await Config.parseConfig<IBattleCardGameConfig>(join(__dirname, 'config'));
    } catch (e) {
      expect((e as Error).message).toBe('No config found');
    }
  });
});
