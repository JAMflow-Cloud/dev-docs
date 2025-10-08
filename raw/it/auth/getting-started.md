# Auth Module and Service

> JAMflow Authentication and Autorization

I progetti di Auth Module e Auth Service sono servizi integrati con l'infrastruttura JAMflow per la gestione delle sessioni e dei permessi usando una soluzione ispirata da Google Zanzibar.

- basato su JWT
- Auto-Refresh della sessione
- Progettato per un'architettura globale, distribuita e stateless.

Una volta che avete accesso a un deployment di Auth Service, potete connettervi ad esso usando l'Auth Module nelle vostre applicazioni Nuxt.

```bash
npx nypm add @jamflow/auth-module
```

Poi configuratelo nel vostro `nuxt.config.ts`:

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
