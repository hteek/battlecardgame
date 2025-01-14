import type { ResourcesConfig } from 'aws-amplify';

import fetch from 'sync-fetch';

export const fetchConfig = (url: string) => {
  const config = fetch(
    // eslint-disable-line @typescript-eslint/no-explicit-any
    `https://config.${url}/outputs.json`,
  ).json();

  const {
    environment,
    gitVersion,
    frontendDomainName,
    graphqlEndpoint,
    identityPoolId,
    identityProviders,
    project,
    region,
    userPoolDomainName,
    userPoolId,
    userPoolWebClientId,
    version,
  } = config[Object.keys(config)[0]];

  return {
    config: {
      API: {
        GraphQL: {
          defaultAuthMode: 'userPool',
          endpoint: graphqlEndpoint,
          region,
        },
      },
      Auth: {
        Cognito: {
          identityPoolId,
          userPoolId,
          userPoolClientId: userPoolWebClientId,
          allowGuestAccess: false,
          loginWith: {
            oauth: {
              domain: userPoolDomainName,
              scopes: ['email', 'profile', 'openid'],
              redirectSignIn: ['http://localhost:3000/login', `https://${frontendDomainName}/login`],
              redirectSignOut: ['http://localhost:3000/logout', `https://${frontendDomainName}/logout`],
              responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
            },
          },
        },
      },
    } as ResourcesConfig,
    environment,
    gitVersion,
    identityProviders: JSON.parse(identityProviders || '{}') as { custom: string[]; social: string[] },
    project,
    version,
  };
};
