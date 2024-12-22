import {
  amplify,
  createMiddlewareEventBridgeHandler,
  getAmplifyFromContext,
  getPowertoolsFromContext,
  MiddlewareEventBridgeHandler,
  MiddyfiedMiddlewareEventBridgeHandler,
  powertools,
} from '../../../middleware/index.js';

export type CloudFormationStackStatusChangeDetail = {
  'stack-id': 'string';
  'logical-resource-id': 'string';
  'physical-resource-id': 'string';
  'status-details': {
    status: 'string';
    'status-reason': 'string';
  };
  'resource-type': 'string';
  'client-request-token': 'string';
};

export const baseHandler: MiddlewareEventBridgeHandler<
  'CloudFormation Stack Status Change',
  CloudFormationStackStatusChangeDetail,
  void
> = async (event, context) => {
  const { startJob } = getAmplifyFromContext(context);
  const { logger } = getPowertoolsFromContext(context);

  const { jobSummary } = await startJob();
  logger.info('deploy amplify job', { jobSummary });
};

export const handler: MiddyfiedMiddlewareEventBridgeHandler<
  'CloudFormation Stack Status Change',
  CloudFormationStackStatusChangeDetail
> = createMiddlewareEventBridgeHandler(baseHandler).use(powertools()).use(amplify());
