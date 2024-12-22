import { PreTokenGenerationV2TriggerEvent } from 'aws-lambda';

export const preTokenGenerationTriggerEvent = (props?: {
  email?: string;
  sub?: string;
  userId?: string;
}): PreTokenGenerationV2TriggerEvent => {
  const { email, sub, userId } = props || {};
  const claimsToAddOrOverride = {
    ...(email ? { email } : {}),
    ...(userId ? { userId } : {}),
  };
  return {
    version: '1',
    triggerSource: 'TokenGeneration_NewPasswordChallenge',
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_in5hxzdbq',
    userName: 'r1234567890',
    callerContext: {
      awsSdkVersion: 'aws-sdk-unknown-unknown',
      clientId: '4im5lrbj1d8s3tle82iaa1tf44',
    },
    request: {
      userAttributes: {
        ...(sub ? { sub } : {}),
        'cognito:user_status': 'CONFIRMED',
        ...(email ? { email, email_verified: 'true' } : {}),
      },
      groupConfiguration: {
        groupsToOverride: [],
        iamRolesToOverride: [],
      },
    },
    response: {
      claimsAndScopeOverrideDetails: {
        accessTokenGeneration: {
          claimsToAddOrOverride,
        },
        idTokenGeneration: {
          claimsToAddOrOverride,
        },
      },
    },
  };
};
