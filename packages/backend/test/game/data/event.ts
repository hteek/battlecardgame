import { EntityKey, EventName, EventType } from '../../../lib/game/functions/lambda/model/index.js';

import { ids as userIds } from '../../auth/data/user.js';
import { ids as gameIds } from './game.js';

export const ids = ['01JH2ZJS742W5P2EP5J1K0WJVA', '01JH8KWR3WMV18XKVVG70ATGQB', '01JH8M201EH7W6VR9AEV158V7H'];

export const events: EventType[] = [
  {
    pk: `${EntityKey.Game}#${gameIds[0]}`,
    sk: `${EntityKey.Event}#${ids[0]}`,
    id: ids[0],
    gameId: gameIds[0],
    userId: userIds[0],
    opponentId: userIds[1],
    name: EventName.Join,
  },
  {
    pk: `${EntityKey.Game}#${gameIds[1]}`,
    sk: `${EntityKey.Event}#${ids[1]}`,
    id: ids[0],
    gameId: gameIds[1],
    userId: userIds[1],
    opponentId: userIds[0],
    name: EventName.Join,
  },
  {
    pk: `${EntityKey.Game}#${gameIds[2]}`,
    sk: `${EntityKey.Event}#${ids[2]}`,
    id: ids[1],
    gameId: gameIds[2],
    userId: userIds[2],
    opponentId: userIds[1],
    name: EventName.Join,
  },
];
