import type { Preset } from '@vite-pwa/assets-generator/config';
import { defineConfig } from '@vite-pwa/assets-generator/config';

const preset: Preset = {
  transparent: {
    sizes: [64, 192, 512],
    favicons: [
      [48, 'favicon-48x48.ico'],
      [64, 'favicon.ico'],
    ],
  },
  maskable: {
    sizes: [192, 512],
  },
  apple: {
    sizes: [180],
  },
};

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset,
  images: ['public/logo.svg'],
});
