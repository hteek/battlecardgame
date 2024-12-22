import middy from '@middy/core';
import { getInternal } from '@middy/util';

import { AmplifyClient, JobType, StartJobCommand } from '@aws-sdk/client-amplify';

const client = new AmplifyClient();

export const amplify = (): middy.MiddlewareObj => ({
  before: async (request) => {
    const appId = process.env['APP_ID'];
    const branchName = process.env['BRANCH_NAME'];

    if (!appId) {
      throw new Error('no app id given');
    }

    if (!branchName) {
      throw new Error('no branch name given');
    }

    const startJob = async () => client.send(new StartJobCommand({ appId, branchName, jobType: JobType.RELEASE }));

    Object.assign(request.internal, {
      startJob,
    });

    Object.assign(request.context, {
      amplify: {
        ...(await getInternal(['startJob'], request)),
      },
    });
  },
});
