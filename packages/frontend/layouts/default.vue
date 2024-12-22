<template>
  <UPage>
    <UHeader>
      <template #logo>
        <div class="flex">
          <CardsLogo class="w-auto h-10 fill-primary" />
          <div class="content-center ml-3">
            <span class="text-3xl">Battle Card Game</span>
          </div>
        </div>
      </template>
      <template #right>
        <ClientOnly>
          <UButton
            v-if="authStore.currentUser"
            icon="i-heroicons-arrow-right-start-on-rectangle"
            label="Sign out"
            color="gray"
            variant="ghost"
            @click="signOut()"
          />
          <UButton
            v-else
            icon="i-heroicons-arrow-left-end-on-rectangle"
            label="Sign in"
            color="gray"
            variant="ghost"
            @click="signInWithRedirect()"
          />
        </ClientOnly>
      </template>
    </UHeader>
    <UPageBody>
      <UContainer>
        <slot />
      </UContainer>
    </UPageBody>
    <UDivider>
      <CardsLogo class="w-5 fill-gray-400 dark:fill-gray-600" />
    </UDivider>
    <UFooter>
      <template #left>
        <NuxtLink
          to="https://github.com/hteek/battlecardgame"
          target="_blank"
          class="text-sm text-[var(--ui-text-muted)]"
        >
          Published under <span class="text-[var(--ui-text-highlighted)]">MIT License</span>
        </NuxtLink>
      </template>
      <template #center>
        <span class="text-xs text-gray-400 dark:text-gray-600">v{{ $version }} </span>
      </template>
      <template #right>
        <UButton
          to="https://github.com/hteek/battlecardgame"
          target="_blank"
          icon="i-simple-icons-github"
          color="gray"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UPage>
</template>
<script setup lang="ts">
import { signInWithRedirect, signOut } from 'aws-amplify/auth';

import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
</script>
