<template>
  <UPage>
    <PageHeader>
      <template #right>
        <ClientOnly>
          <UButton
            v-if="authStore.currentUser"
            icon="i-heroicons-arrow-right-start-on-rectangle"
            label="Sign out"
            color="gray"
            variant="ghost"
            @click="navigateTo('/logout')"
          />
          <UButton
            v-else
            icon="i-heroicons-arrow-left-end-on-rectangle"
            label="Sign in"
            color="gray"
            variant="ghost"
            @click="navigateTo('/login')"
          />
        </ClientOnly>
      </template>
    </PageHeader>
    <UPageBody>
      <UContainer>
        <slot />
      </UContainer>
    </UPageBody>
    <PageFooter />
  </UPage>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/store/auth';
import PageFooter from '~/components/PageFooter.vue';
import PageHeader from '~/components/PageHeader.vue';

const authStore = useAuthStore();
</script>
