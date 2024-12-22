import { EntityKeys, UserType } from '../../../lib/auth/functions/lambda/model/index.js';

export const emails = ['max.mustermann@example.com', 'marta.musterfrau@example.com'];
export const ids = ['01G7D53VWTE6405EFSQPZVQMZY', '01G7D53VWT9DYMYPJV2JBSZ7Q2'];
export const subs = ['5c924ac4-638a-5ac3-b28b-740ed8e231a3', 'bf4cc9d0-d578-5646-94ef-2a223c1b74d4'];

export const users: UserType[] = [
  {
    pk: `${EntityKeys.User}#${subs[0]}`,
    sk: `${EntityKeys.User}#${ids[0]}`,
    id: ids[0],
    sub: subs[0],
    email: emails[0],
    firstName: 'Max',
    lastName: 'Mustermann',
  },
  {
    pk: `${EntityKeys.User}#${subs[1]}`,
    sk: `${EntityKeys.User}#${ids[1]}`,
    id: ids[1],
    sub: subs[1],
    email: emails[1],
    firstName: 'Marta',
    lastName: 'Musterfrau',
  },
];
