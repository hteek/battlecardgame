import { baseSchema } from '../../../../model/index.js';

export enum EntityKey {
  User = 'user',
}

export const schema = {
  ...baseSchema,
  models: {
    User: {
      pk: { type: String, value: `${EntityKey.User}#\${sub}` },
      sk: { type: String, value: `${EntityKey.User}#\${id}` },
      id: {
        type: String,
        generate: 'ulid',
        required: true,
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      sub: {
        type: String,
        required: true,
        validate: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      },
      email: {
        type: String,
        required: true,
      },
      firstName: { type: String },
      lastName: { type: String },
      disabled: {
        type: Boolean,
        default: false,
      },
      //  Search by role or by type
      gs1pk: { type: String, value: '${_type}#' },
      gs1sk: { type: String, value: '${_type}#${disabled}#${id}' },
    },
  } as const,
} as const;
