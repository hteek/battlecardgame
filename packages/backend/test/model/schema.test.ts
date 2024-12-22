import { baseSchema, Gsi } from '../../lib/model/index.js';

describe('schema', () => {
  test('successful initialisation', () => {
    expect(baseSchema).toHaveProperty('format');
    expect(baseSchema).toHaveProperty('version');
    expect(baseSchema).toHaveProperty(['indexes', 'primary']);
    expect(baseSchema).toHaveProperty(['indexes', Gsi.SkPkIndex]);
    expect(baseSchema).toHaveProperty(['indexes', Gsi.Gs1Index]);
    expect(baseSchema).toHaveProperty(['indexes', Gsi.Gs2Index]);
    expect(baseSchema).toHaveProperty('models');
    expect(baseSchema).toHaveProperty(['params', 'timestamps']);
  });
});
