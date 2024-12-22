declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    callbackUrls?: string[];
    logoutUrls?: string[];
    outputsUrl: string;
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {};
