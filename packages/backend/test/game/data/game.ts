import { EntityKey, GameType } from '../../../lib/game/functions/lambda/model/index.js';

import { ids as userIds, users } from '../../auth/data/user.js';

export const ids = ['01JH2YT1H3RDN42GB49RJHP04Z', '01JH2YT9SR1FATY3HEACE9JZ3A', '01JH3FF7X6JH7CB83B5EEAQ1YY'];

export const games: GameType[] = [
  {
    pk: `${EntityKey.Game}#${ids[0]}`,
    sk: `${EntityKey.User}#${userIds[0]}`,
    id: ids[0],
    userId: userIds[0],
    opponentId: userIds[1],
    opponentEmail: users[1].email,
  },
  {
    pk: `${EntityKey.Game}#${ids[1]}`,
    sk: `${EntityKey.User}#${userIds[1]}`,
    id: ids[1],
    userId: userIds[1],
    opponentId: userIds[0],
    opponentEmail: users[0].email,
  },
  {
    pk: `${EntityKey.Game}#${ids[2]}`,
    sk: `${EntityKey.User}#${userIds[2]}`,
    id: ids[2],
    userId: userIds[2],
    opponentId: userIds[1],
    opponentEmail: users[1].email,
  },
];
