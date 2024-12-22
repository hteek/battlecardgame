import { AmplifyClient, JobSummary, StartJobCommand } from '@aws-sdk/client-amplify';
import middy from '@middy/core';

import { mockClient } from 'aws-sdk-client-mock';

import { amplify, MiddlewareContext, MiddyfiedMiddlewareHandler, powertools } from '../../lib/middleware/index.js';

import { appId, branchName } from './data/index.js';

describe('Amplify middleware handler', () => {
  const OLD_ENV = process.env;

  const amplifyClientMock = mockClient(AmplifyClient);
  const context = {} as MiddlewareContext;

  const handler: MiddyfiedMiddlewareHandler<void, void> = middy<void, void, Error, MiddlewareContext>()
    .use(powertools())
    .use(amplify())
    .handler(async () => {
      const { amplify } = context ?? {};
      const { startJob } = amplify ?? {};

      if (!startJob) {
        throw new Error('startJob not found');
      }
      await startJob();
    });

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
    process.env['APP_ID'] = appId;
    process.env['BRANCH_NAME'] = branchName;
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
    vi.clearAllMocks();
    amplifyClientMock.reset();
  });

  test('called successfully', async () => {
    amplifyClientMock.on(StartJobCommand).resolves({
      $metadata: { httpStatusCode: 200 },
      jobSummary: {
        commitId: 'HEAD',
        commitTime: new Date('2024-06-08T13:29:27.543Z'),
        jobArn: 'arn:aws:amplify:eu-central-1:674066001516:apps/d2jp0qc43sutoy/branches/main/jobs/0000000001',
        jobId: '1',
        status: 'PENDING',
      } as JobSummary,
    });

    await handler(undefined, context);
    expect(amplifyClientMock).toHaveReceivedCommandWith(StartJobCommand, {
      appId,
      branchName: 'main',
      jobType: 'RELEASE',
    });
  });

  test('start job failed', async () => {
    amplifyClientMock.on(StartJobCommand).rejects(new Error('testError'));
    await expect(handler(undefined, context)).rejects.toThrowError('testError');
    expect(amplifyClientMock).toHaveReceivedCommandWith(StartJobCommand, {
      appId,
      branchName: 'main',
      jobType: 'RELEASE',
    });
  });
});
