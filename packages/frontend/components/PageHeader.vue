<template>
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
      <slot name="right" />
    </template>
  </UHeader>
</template>
<script setup lang="ts"></script>
