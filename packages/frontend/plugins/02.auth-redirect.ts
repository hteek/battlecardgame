import { Amplify } from 'aws-amplify';
import { signInWithRedirect } from 'aws-amplify/auth';

import type { NuxtApp } from '#app';

import { fetchConfig } from '~/plugins/util/config';

export default defineNuxtPlugin({
  name: 'AmplifyAuthRedirect',
  enforce: 'pre',
  async setup(nuxtApp) {
    if (import.meta.client) {
      const { config } = await fetchConfig(nuxtApp as NuxtApp);
      Amplify.configure(config, { ssr: true });
    }

    addRouteMiddleware(
      'AmplifyAuthMiddleware',
      defineNuxtRouteMiddleware(async (to) => {
        try {
          const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();
          if (!tokens && to.path !== '/') {
            // If the request is not associated with a valid user session and
            // the route is not `/` redirect to the federated login.
            await signInWithRedirect();
            return abortNavigation();
          }
        } catch (e) {
          console.error(e);
          return nuxtApp.runWithContext(() => navigateTo('/'));
        }
      }),
      { global: true },
    );
  },
});
