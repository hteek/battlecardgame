import type { ResourcesConfig } from 'aws-amplify';

import type { NuxtApp } from '#app';
import { useRequestURL } from '#app';

type BattleCardGameConfig = {
  callbackUrls?: string[];
  logoutUrls?: string[];
  outputsUrl?: string;
};

export const fetchConfig = async (nuxtApp: NuxtApp) => {
  const { callbackUrls, logoutUrls, outputsUrl } = (nuxtApp.$config.public ?? {}) as unknown as BattleCardGameConfig;
  const { hostname, port, protocol } = useRequestURL();
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
  } = await useFetch<any>( // eslint-disable-line @typescript-eslint/no-explicit-any
    ((outputsUrl as string).startsWith('http')
      ? outputsUrl
      : `${protocol}//config.${hostname}${port ? ':' + port : ''}/${outputsUrl}`) as string,
  ).then((response) => response.data.value[Object.keys(response.data.value)[0]]);

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
              redirectSignIn: callbackUrls ? callbackUrls : [`https://${frontendDomainName}/login`],
              redirectSignOut: logoutUrls ? logoutUrls : [`https://${frontendDomainName}/logout`],
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
