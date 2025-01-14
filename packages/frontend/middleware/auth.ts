import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const route = useRoute();

  const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();

  if (tokens && !authStore.hasCurrentUser) {
    return navigateTo({ path: '/login', query: { redirect: route.fullPath } });
  }
});
