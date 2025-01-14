<template>
  <div>
    <section id="welcome">
      <UPageHero :title="$t('game.title')" :description="$t('game.description')" align="left">
        <template #links>
          <UForm v-if="authStore.hasCurrentUser" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormGroup
              :label="$t('game.invitation.label')"
              :description="$t('game.invitation.description')"
              required
              name="email"
            >
              <UInput v-model="state.email" placeholder="opponent@example.com" />
            </UFormGroup>

            <UButton size="lg" type="submit">{{ $t('game.create') }}</UButton>
            <UButton
              v-if="gameStore.games.length > 0"
              color="gray"
              size="lg"
              trailing-icon="i-heroicons-arrow-down-20-solid"
              class="ml-3"
              :to="{ hash: '#games' }"
            >
              {{ $t('game.continue') }}
            </UButton>
          </UForm>
          <UButton v-else @click="navigateTo('/login')">{{ $t('game.login') }}</UButton>
        </template>
        <div class="flex flex-col items-center justify-center">
          <img src="/assets/cards/back.png" class="rounded-md" />
        </div>
      </UPageHero>
    </section>
    <section v-if="gameStore.games.length > 0" id="games">
      <UDivider>
        <span class="text-md text-gray-500 dark:text-gray-400"
          >{{ $t('game.existing') }}<br />{{ authStore.currentUserNameOrEmail }}</span
        >
      </UDivider>
      <UPageGrid v-if="gameStore.games.length > 0" class="mt-10">
        <UPageCard v-for="(game, index) in gameStore.games as Game[]" :key="index" :to="`/game/${game.id}`">
          <template #title>
            <p class="text-base font-semibold truncate flex items-center gap-1.5">
              <span :class="isYou(game.userEmail) ? 'text-primary' : 'text-gray-900 dark:text-white'">{{
                getPlayerName(game.userEmail)
              }}</span>
              <span class="text-gray-500 dark:text-gray-400">vs.</span>
              <span :class="isYou(game.opponentEmail) ? 'text-primary' : 'text-gray-900 dark:text-white'">{{
                getPlayerName(game.opponentEmail)
              }}</span>
            </p>
          </template>
          <template #description>
            <span class="line-clamp-2">{{ game.created }}</span>
          </template>
        </UPageCard>
      </UPageGrid>
      <div class="flex flex-col items-center justify-center mt-10">
        <UButton
          color="gray"
          size="lg"
          trailing-icon="i-heroicons-arrow-up-20-solid"
          class="ml-3"
          :to="{ hash: '#welcome' }"
        >
          Back to top!
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';

import type { Game } from '~/gql/graphql';
import { useAuthStore } from '~/store/auth';
import { useGameStore } from '~/store/game';

const authStore = useAuthStore();
const gameStore = useGameStore();

const { t } = useI18n();

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
});

const getPlayerName = (email: string) => (authStore.currentUser?.email === email ? t('game.you') : email);
const isYou = (email: string) => authStore.currentUser?.email === email;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { id } = await gameStore.create(event.data.email);
  if (id) {
    navigateTo(`/game/${id}`);
  }
}
</script>
