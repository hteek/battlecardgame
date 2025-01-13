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
          <UButton v-else @click="signInWithRedirect()">{{ $t('game.login') }}</UButton>
        </template>
        <div class="flex flex-col items-center justify-center">
          <img src="/assets/cards/back.png" class="rounded-md" >
        </div>
      </UPageHero>
    </section>
    <section v-if="gameStore.games.length > 0" id="games">
      <UDivider>
        <span class="text-lg text-gray-500 dark:text-gray-400">{{ $t('game.existing') }}</span>
      </UDivider>
      <UPageGrid v-if="gameStore.games.length > 0" class="mt-10">
        <UPageCard v-for="(game, index) in gameStore.games as Game[]" :key="index" :to="`/game/${game.id}`">
          <template #title>
            <p class="text-gray-900 dark:text-white text-base font-semibold truncate flex items-center gap-1.5">
              {{ game.userEmail }} <span class="text-primary">vs.</span> {{ game.opponentEmail }}
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

import { signInWithRedirect } from 'aws-amplify/auth';
import { z } from 'zod';

import type { Game } from '~/gql/graphql';
import { useAuthStore } from '~/store/auth';
import { useGameStore } from '~/store/game';

const authStore = useAuthStore();
const gameStore = useGameStore();

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { id } = await gameStore.create(event.data.email);
  if (id) {
    navigateTo(`/game/${id}`);
  }
}
</script>
