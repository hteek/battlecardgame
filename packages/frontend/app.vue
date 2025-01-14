<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
  <UModals />
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/store/notification';
import { useGameStore } from '~/store/game';

// Initialize the stores
const notificationStore = useNotificationStore();
notificationStore.init();

const gameStore = useGameStore();
gameStore.init();
</script>
