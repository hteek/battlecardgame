import { EventBridgeEvent, Handler } from 'aws-lambda';
import lambdaTester from 'lambda-tester';

import {
  baseHandler,
  CloudFormationStackStatusChangeDetail,
} from '../../../../lib/amplify/functions/lambda/deployHandler.js';

import { createTestContext } from '../../data/context.js';

describe('deploy handler', () => {
  const testHandler = baseHandler as unknown as Handler<
    EventBridgeEvent<'CloudFormation Stack Status Change', CloudFormationStackStatusChangeDetail>,
    void
  >;

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns successfully', async () => {
    const {
      context,
      mocks: { amplifyStartJob, powertoolsLoggerInfo },
    } = createTestContext({});

    return lambdaTester(testHandler)
      .context(context)
      .event({
        version: '0',
        id: 'ee8716cb-b97c-5e23-62ee-ec216bd4a583',
        'detail-type': 'CloudFormation Stack Status Change',
        source: 'aws.cloudformation',
        account: '469901899619',
        time: '2021-11-02T14:18:46Z',
        region: 'eu-central-1',
        resources: ['cloudformation'],
        detail: {
          'stack-id': 'string',
          'logical-resource-id': 'string',
          'physical-resource-id': 'string',
          'status-details': {
            status: 'string',
            'status-reason': 'string',
          },
          'resource-type': 'string',
          'client-request-token': 'string',
        },
      })
      .expectResolve(() => {
        expect(amplifyStartJob).toHaveBeenCalled();
        expect(powertoolsLoggerInfo).toHaveBeenCalledWith('deploy amplify job', { jobSummary: undefined });
      });
  });
});
