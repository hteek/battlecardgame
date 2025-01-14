import { Amplify } from 'aws-amplify';

import { fetchConfig } from '~/plugins/util/config';
import { useAuthStore } from '~/store/auth';

if (import.meta.client) {
  const { config } = fetchConfig('battlecardgame.net');
  Amplify.configure(config, { ssr: true });
}

export default defineNuxtPlugin({
  name: 'AmplifyAuthRedirect',
  enforce: 'pre',
  async setup(nuxtApp) {
    addRouteMiddleware(
      'AmplifyAuthMiddleware',
      defineNuxtRouteMiddleware(async (to, from) => {
        const authStore = useAuthStore();
        try {
          const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();
          if (to.path !== '/login' && tokens && !authStore.hasCurrentUser) {
            return nuxtApp.runWithContext(() => navigateTo({ path: '/login', query: { redirect: from.fullPath } }));
          }
        } catch (e) {
          console.error(e);
          return nuxtApp.runWithContext(() => navigateTo('/'));
        }
      }),
      { global: true },
    );

    addRouteMiddleware(
      'login',
      defineNuxtRouteMiddleware(async (to, from) => {
        try {
          const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();
          if (!tokens) {
            return nuxtApp.runWithContext(() => navigateTo({ path: '/login', query: { redirect: from.fullPath } }));
          }
        } catch (e) {
          console.error(e);
          return nuxtApp.runWithContext(() => navigateTo('/'));
        }
      }),
    );
  },
});
