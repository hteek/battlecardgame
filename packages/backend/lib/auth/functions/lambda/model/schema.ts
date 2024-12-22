import { baseSchema } from '../../../../model/index.js';

export enum EntityKeys {
  User = 'user',
}

export const schema = {
  ...baseSchema,
  models: {
    User: {
      pk: { type: String, value: `${EntityKeys.User}#\${sub}` },
      sk: { type: String, value: `${EntityKeys.User}#\${id}` },
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
      gs1pk: { type: String, value: '${_type}#' }, // eslint-disable-line no-template-curly-in-string
      gs1sk: { type: String, value: '${_type}#${disabled}#${id}' }, // eslint-disable-line no-template-curly-in-string
    },
  } as const,
} as const;
