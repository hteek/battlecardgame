import { Amplify } from 'aws-amplify';
import { fetchAuthSession, fetchUserAttributes, signIn, signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

import { fetchConfig } from '~/plugins/util/config';

const client = generateClient();

export default defineNuxtPlugin({
  name: 'AmplifyAPIs',
  enforce: 'pre',

  async setup() {
    const { config, environment, gitVersion, identityProviders, project, version } = fetchConfig('battlecardgame.net');
    console.log('amplify config client side loaded', config);

    // This configures Amplify on the client side of your Nuxt app
    Amplify.configure(config, { ssr: true });

    return {
      provide: {
        // You can add the Amplify APIs that you will use on the client side
        // of your Nuxt app here.
        //
        // You can call the API by via the composable `useNuxtApp()`. For example:
        // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
        Amplify: {
          Auth: {
            fetchAuthSession,
            fetchUserAttributes,
            signIn,
            signOut,
          },
          GraphQL: {
            client,
          },
        },
        environment,
        gitVersion,
        identityProviders,
        project,
        version,
      },
    };
  },
});
