import { AppSyncResolverEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';

import { Event, EventType } from '../../../../lib/game/functions/lambda/model/index.js';
import { baseHandler, GetEventByIdInput } from '../../../../lib/game/functions/lambda/getEventByIdHandler.js';

import { appSyncResolverEvent } from '../../../data/events.js';
import { ids as userIds, subs } from '../../../auth/data/user.js';

import { context } from '../../../data/context.js';
import { events, ids as eventIds } from '../../data/event.js';

describe('get event by id handler', () => {
  const getEventSpy = vi.spyOn(Event, 'getById');

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testHandler = baseHandler as unknown as Handler<AppSyncResolverEvent<GetEventByIdInput>, EventType>;

  test('get event', async () => {
    getEventSpy.mockResolvedValue(events[1]);

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            id: eventIds[1],
          },
        ),
      )
      .expectResult((result) => {
        expect(getEventSpy).toHaveBeenCalledTimes(1);
        expect(getEventSpy).toHaveBeenCalledWith(expect.anything(), eventIds[1]);
        expect(result).toStrictEqual(events[1]);
      });
  });

  test('get event (error)', async () => {
    getEventSpy.mockRejectedValue(new Error('get error'));

    return lambdaTester(testHandler)
      .context(context)
      .event(
        appSyncResolverEvent(
          {
            sub: subs[0],
            userId: userIds[0],
          },
          {
            id: eventIds[2],
          },
        ),
      )
      .expectReject((error: Error) => {
        expect(getEventSpy).toHaveBeenCalledTimes(1);
        expect(getEventSpy).toHaveBeenCalledWith(expect.anything(), eventIds[2]);
        expect(error.message).toBe('get error');
      });
  });
});
