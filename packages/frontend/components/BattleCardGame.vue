<script setup lang="ts">
import type Phaser from 'phaser';
import { onMounted, onUnmounted, ref } from 'vue';

import { EventBus } from '~/game/eventBus';
import { useGameStore } from '~/store/game';
import { createGame } from '~/game/main';

const gameStore = useGameStore();

// Save the current scene instance
const scene = ref();
const game = ref();

const emit = defineEmits(['current-active-scene']);

onMounted(() => {
  game.value = createGame('game-container');

  EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
    emit('current-active-scene', scene_instance);
    scene.value = scene_instance;
    gameStore.startGame();
  });
});

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true, false);
    game.value = null;
  }
  gameStore.resetCurrentGame();
});

defineExpose({ scene, game });
</script>

<template>
  <div id="game-container" />
</template>
