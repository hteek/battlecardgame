<template>
  <CardsLogo class="motion-safe:animate-ping w-auto h-28 fill-primary" />
</template>

<script setup lang="ts">
import { signOut } from 'aws-amplify/auth';
import { useAuthStore } from '~/store/auth';

definePageMeta({
  layout: 'splash',
});
const authStore = useAuthStore();

const { tokens } = await useNuxtApp().$Amplify.Auth.fetchAuthSession();
if (tokens) {
  console.log('logout...');
  await signOut();
  authStore.logout();
  console.log('...done');
}
console.log('now navigate');
navigateTo('/');
</script>
