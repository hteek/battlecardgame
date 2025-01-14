<template>
  <UPage>
    <div class="h-screen grid grid-rows content-start">
      <PageHeader />
      <UPageBody class="h-[calc(100vh-200px)] overflow-auto flex items-center justify-center">
        <slot />
      </UPageBody>
      <PageFooter />
    </div>
  </UPage>
</template>
