<template>
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
      <span class="text-xs text-gray-400 dark:text-gray-600">{{ $gitVersion ? $gitVersion : 'v' + $version }} </span>
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
</template>
