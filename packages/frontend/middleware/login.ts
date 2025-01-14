export default defineNuxtRouteMiddleware(async () => {
  const route = useRoute();

  const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();

  if (!tokens) {
    return navigateTo({ path: '/login', query: { redirect: route.fullPath } });
  }
});
