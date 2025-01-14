<template>
  <CardsLogo class="motion-safe:animate-ping w-auto h-28 fill-primary" />
</template>

<script setup lang="ts">
import { signInWithRedirect } from 'aws-amplify/auth';
import { useAuthStore } from '~/store/auth';

definePageMeta({
  layout: 'splash',
});
const authStore = useAuthStore();
const route = useRoute();

const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();
if (!tokens) {
  signInWithRedirect();
} else if (authStore.hasCurrentUser) {
  await authStore.login();
}

const { redirect } = route.query;
if (redirect) {
  console.log('store redirect', redirect);
}
navigateTo('/');
</script>
