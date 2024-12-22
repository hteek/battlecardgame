import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Config } from '../lib/config.js';
import { BattleCardGameGitHubOidcStack, BattleCardGameStack } from '../lib/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) =>
    `"${(val as string)
      .replace(/([A-Fa-f0-9]{64})\.(json|zip)|(SsrEdgeFunctionCurrentVersion[A-Fa-f0-9]{40})/, '[FILENAME REMOVED]')
      .replace(
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
        '[VERSION REMOVED]',
      )}"`,
});

describe('BattleCardGame', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test default stack', async () => {
    const config = await Config.parseConfig(join(__dirname, '../config'));
    const stack = new BattleCardGameStack(new App(), config);
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
  });

  test('Test custom environment stack', async () => {
    process.env['ENVIRONMENT'] = 'dev';
    process.env['GIT_VERSION'] = 'jfijsdf';
    const config = await Config.parseConfig(join(__dirname, './config'));
    const stack = new BattleCardGameStack(new App(), config);
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
  });
});

describe('BattleCardGame GitHub OIDC', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test stack (default)', async () => {
    const config = await Config.parseConfig(join(__dirname, 'config'));
    expect(() => new BattleCardGameGitHubOidcStack(new App(), config)).toThrow(
      'GitHub owner and repo must be provided',
    );
  });

  test('Test stack (custom)', async () => {
    process.env['ENVIRONMENT'] = 'dev';
    const config = await Config.parseConfig(join(__dirname, 'config'));
    const stack = new BattleCardGameGitHubOidcStack(new App(), config);
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
  });
});
