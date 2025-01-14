import { env } from 'process';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'apple-touch-icon',
          color: '#00a486',
          href: '/apple-touch-icon-180x180.png',
        },
      ],
      meta: [
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#171717', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
      ],
      title: 'Battle Card Game',
    },
  },
  colorMode: {
    preference: 'dark',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: { appManifest: false },
  extends: ['@nuxt/ui-pro'],
  hooks: {
    'prepare:types': ({ tsConfig }) => {
      tsConfig.include?.unshift('../types/index.d.ts');
    },
  },
  i18n: {
    experimental: {
      localeDetector: 'localeDetector.ts',
    },
    vueI18n: './i18n.config.ts',
  },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n', '@vite-pwa/nuxt', '@pinia/nuxt', '@vueuse/nuxt'],
  nitro: {
    preset: 'awsAmplify',
  },
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      display: 'standalone',
      name: 'Battle Card Game',
      short_name: 'Battle Card Game',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'maskable-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      navigateFallbackAllowlist: [/^\/$/],
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  runtimeConfig: {
    public: {
      callbackUrls: env.NODE_ENV === 'development' ? ['http://localhost:3000/login'] : undefined,
      logoutUrls: env.NODE_ENV === 'development' ? ['http://localhost:3000/logout'] : undefined,
      outputsUrl: env.NODE_ENV === 'development' ? 'https://config.battlecardgame.net/outputs.json' : 'outputs.json',
    },
  },
  spaLoadingTemplate: 'app/spa-loading-template.html',
  ssr: true,
});
