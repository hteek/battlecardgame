<template>
  <div>
    <CardsLogo class="motion-safe:animate-ping w-auto h-28 fill-primary" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth';
import { signInWithRedirect } from 'aws-amplify/auth';

definePageMeta({
  layout: 'splash',
});

onMounted(async () => {
  const authStore = useAuthStore();
  const route = useRoute();

  const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();
  if (!tokens) {
    await signInWithRedirect();
  } else if (!authStore.hasCurrentUser) {
    await authStore.login();

    const { redirect } = route.query;
    if (redirect) {
      console.log('store redirect', redirect);
    }
    navigateTo('/');
  }
});
</script>
