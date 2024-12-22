import { capitalize, toCamelCase, toKebabCase, uncapitalize } from '../../lib/common/index.js';

describe('utils', () => {
  test('toKebabCase', () => {
    expect(toKebabCase('TestTest-Test')).toStrictEqual('test-test-test');
  });

  test('toCamelCase', () => {
    expect(toCamelCase('Test Test Test-Test')).toStrictEqual('testTestTestTest');
  });

  test('capitalize', () => {
    expect(capitalize('testTest')).toStrictEqual('TestTest');
  });

  test('capitalize (empty)', () => {
    expect(capitalize()).toStrictEqual('');
  });

  test('uncapitalize', () => {
    expect(uncapitalize('TestTest')).toStrictEqual('testTest');
  });

  test('uncapitalize (empty)', () => {
    expect(uncapitalize()).toStrictEqual('');
  });
});
