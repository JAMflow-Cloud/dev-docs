export default defineNuxtConfig({
  extends: ['docus'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  eslint: {
    config: {
      stylistic: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'it', name: 'Italian' },
    ],
  },

  llms: {
    domain: 'https://jamflow-docs.nuxt.space/',
    title: 'Your Site Name',
    description: 'A brief description of your site',
    full: {
      title: 'Your Site Name',
      description: 'A brief description of your site',
    },
  },
})
