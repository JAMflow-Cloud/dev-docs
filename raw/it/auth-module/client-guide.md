# Client Guide

> Autenticazione e autorizzazione sul lato client

Questo modulo fornisce una serie di composables Vue e plugin Nuxt che facilitano l'integrazione con Jamflow Auth Service nelle applicazioni Nuxt. Qui trovi i principali strumenti lato client, come comunicano con il backend Auth e come integrarli nella tua app.

<warning>

**Prerequisiti**

- Il tuo contratto deve includere un'istanza di Auth Service.
- Il modulo deve essere registrato in `nuxt.config.ts` e configurato con almeno `issuer` e `audience`.
- I cookie per ID, access e refresh token sono gestiti automaticamente dal modulo; assicurati che il tuo ambiente di deploy non li blocchi.

</warning>

## Bootstrap della sessione

Due plugin Nuxt si occupano di mantenere la sessione aggiornata durante navigazione e idratazione:

- `session.server`: viene eseguito prima del render sul server. Popola il payload con una flag `isCached` e, quando la richiesta è renderizzata al volo, chiama `useUserSession().fetch()` per decodificare gli ID e access token più recenti.
- `session.client`: viene eseguito sul client durante l'idratazione. Se la pagina è stata consegnata da cache del payload o da prerendering statico, recupera la sessione dopo il mount dell'app per evitare dati obsoleti.

Non è necessario importare manualmente questi plugin: vengono registrati automaticamente all'installazione del modulo.

## `useUserSession()`

`useUserSession` è il composable principale esposto dal modulo. Si occupa di rinfrescare i cookie in modo trasparente, comunicare con le route proxy del server e fornire uno stato reattivo per l'utente autenticato.

```ts
const {
  user,       // Computed<IDTokenClaims | null>
  access,     // Computed<AccessTokenClaims | null>
  loggedIn,   // Computed<boolean>
  login,
  requestAccess,
  fetch,
  refresh,
  clear,
} = useUserSession()
```

### Accesso allo stato

- `user`: claim dell'ID token (sub, email, team, ecc.). `null` quando il visitatore è anonimo o il token non è verificabile.
- `access`: claim dell'access token, inclusi i codici di permesso serializzati usati da `usePermissions`.
- `loggedIn`: booleano di comodo derivato da `user`.

### Azioni

- `login(email, password)`: Chiama `/_auth-api/auth/login`, imposta i cookie, recupera i permessi di accesso e risolve quando la sessione è pronta.
- `requestAccess(teamId?)`: Richiede manualmente un access token aggiornato per l'utente corrente. Utile quando si cambia contesto team.
- `fetch()`: Rilegge i cookie, valida i token contro il JWKS e aggiorna lo stato locale. Di solito non serve chiamarla direttamente perché i plugin la gestiscono.
- `refresh()`: Usa l'endpoint di refresh per ottenere nuovi ID e access token.
- `clear()`: Disconnette l'utente cancellando i cookie tramite `/_auth-api/auth/session` e resettando lo stato in memoria.

### Uso nei diversi contesti di fetch

Il composable seleziona automaticamente tra `$fetch` client e `$fetch` request-scoped sul server. Questo è importante quando si scrivono plugin o middleware personalizzati: lo stesso codice funziona in componenti, route server e handler Nitro senza configurazioni aggiuntive.

## Gestire i permessi con `usePermissions()`

I permessi sono codificati nell'access token come codici brevi (es. `@blog:cru` per create/read/update globali sul topic `blog`). `usePermissions` traduce queste stringhe in una struttura dati descrittiva e fornisce helper per proteggere UI e pagine.

```ts
const { permissions, hasPermission, pagePermission } = usePermissions()
```

- `permissions`: oggetto computed di tipo `DecryptedPermissions` che separa gli ambiti `team` e `global`.
- `hasPermission(check)`: Restituisce `true` se l'access token corrente concede tutte le azioni richieste per uno specifico topic. Imposta `check.team = true` per valutare i permessi a livello di team; altrimenti si controlla l'ambito globale.
- `pagePermission(check, { redirect? })`: Restituisce l'oggetto `ResourcePermissions` completo per il topic. Se l'utente non ha accesso puoi abilitare un redirect (di default `'/'`). Senza redirect restituisce un oggetto con tutte le azioni a `false`, utile per renderizzare uno stato di avviso.

### Esempio: proteggere una pagina

```vue
const { pagePermission } = usePermissions()

<script setup lang="ts">
const blogPerms = await pagePermission({
  topic: 'blog-posts',
  actions: ['read'],
})
</script>

<template>
  <section v-if="blogPerms.read">
    <!-- Contenuto protetto -->
  </section>
  <NuxtErrorBoundary v-else>
    <p>Non hai ancora accesso ai post del blog.</p>
  </NuxtErrorBoundary>
</template>
```

### Esempio: abilitare/disabilitare controlli UI

```vue
<script setup lang="ts">
const { hasPermission } = usePermissions()

const canPublish = computed(() => hasPermission({
  topic: 'blog-posts',
  actions: ['execute'],
}))
</script>

<template>
  <UButton :disabled="!canPublish">Publish</UButton>
</template>
```

## Ciclo di vita dei token

- I cookie vengono aggiornati automaticamente ad ogni chiamata a `fetch()` e `refresh()` tramite l'helper `refreshCookie` di Nuxt.
- Quando un access token è scaduto, `useUserSession` richiede trasparentemente uno nuovo e propaga gli header Set-Cookie dall'API al browser.
- Le chiavi JWKS vengono memorizzate in memoria per fino a un'ora per ridurre traffico di rete inutile.

## Risoluzione dei problemi

<table>
<thead>
  <tr>
    <th>
      Sintomo
    </th>
    
    <th>
      Probabile causa
    </th>
    
    <th>
      Soluzione
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        useUserSession().user
      </code>
      
       è sempre <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        issuer
      </code>
      
       / <code>
        audience
      </code>
      
       runtime mancanti o non validi
    </td>
    
    <td>
      Verifica <code>
        nuxt.config
      </code>
      
       e le variabili d'ambiente.
    </td>
  </tr>
  
  <tr>
    <td>
      Il login riesce ma i permessi sono vuoti
    </td>
    
    <td>
      Access token non richiesto o codici permesso non configurati server-side
    </td>
    
    <td>
      Assicurati che <code>
        requestAccess()
      </code>
      
       venga chiamato dopo il login e che l'Auth Service emetta i permessi.
    </td>
  </tr>
  
  <tr>
    <td>
      Le navigazioni client perdono la sessione
    </td>
    
    <td>
      Cookie bloccati dal dominio o mismatch degli attributi secure
    </td>
    
    <td>
      Controlla l'URL base del deploy e la configurazione dei cookie nel servizio.
    </td>
  </tr>
</tbody>
</table>

## Passi successivi

- Consulta la [Guida server](/it/auth-module/server-guide.md) per le utility Nitro da usare nelle route API.
- Fai attenzione alla scadenza dei token in tab mantenute a lungo; valuta di chiamare periodicamente `useUserSession().refresh()` se la tua UX lo richiede.
