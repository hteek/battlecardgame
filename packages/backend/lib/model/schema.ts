export enum Gsi {
  SkPkIndex = 'SkPkIndex',
  Gs1Index = 'gs1',
  Gs2Index = 'gs2',
}

export const baseSchema = {
  format: 'onetable:1.1.0',
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    [Gsi.SkPkIndex]: { hash: 'sk', sort: 'pk' },
    [Gsi.Gs1Index]: { hash: 'gs1pk', sort: 'gs1sk', follow: true, project: 'keys' },
    [Gsi.Gs2Index]: { hash: 'gs2pk', sort: 'gs2sk', follow: true, project: 'keys' },
  },
  models: {} as const,
  params: {
    timestamps: true,
  },
} as const;
