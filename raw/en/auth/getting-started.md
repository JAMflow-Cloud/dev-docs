# Auth Module and Service

> JAMflow Authentication and Autorization

The Auth Module and Auth Service are projects integrated with the JAMflow infrastructure for managing sessions and permissions using a solution inspired by Google Zanzibar.

- JWT based
- Session Auto-Refresh
- Designed for a global, distributed, and stateless setup.

Once you receive an Auth Service deployment, you can install the Auth Module in your Nuxt applications.

```bash
npx nypm add @jamflow/auth-module
```

Then configure it in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    '@jamflow/auth-module'
  ],

  auth: {
    issuer: 'https://<YOUR-PROJECT>.auth.jamflow.app',
    audience: 'https://your-project.com',
  }
})
```
