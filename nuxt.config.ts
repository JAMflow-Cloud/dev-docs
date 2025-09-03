export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
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
