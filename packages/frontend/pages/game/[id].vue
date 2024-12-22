<template>
  <ClientOnly>
    <div class="grid grid-cols-1 gap-4">
      <BattleCardGame ref="phaserRef" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '~/store/game';

const route = useRoute();
const gameStore = useGameStore();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
gameStore.loadGame(phaserRef, route.params.id as string);
</script>
