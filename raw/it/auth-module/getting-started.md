# Auth Module: Getting Started

> JAMflow Authentication and Authorization

Jamflow Auth Module integra le applicazioni Nuxt con il Jamflow Auth Service. Centralizza l'autenticazione, l'appartenenza ai team e i controlli di permessi senza richiedere una connessione al database per ogni validazione. Invece, utilizza token JWT per ID, accesso e refresh emessi dall'Auth Service ed espone utility amichevoli sia sul client che sul server.

Il modello dei permessi è ispirato a Google Zanzibar e permette di definire regole di controllo accessi molto dettagliate basate su ruoli utente, appartenenza a team e relazioni tra risorse.

<u->



</u->

## Cosa ottieni

- Bootstrap automatico della sessione durante SSR e idratazione SPA
- Composables Vue tipizzati (`useUserSession`, `usePermissions`) per lavorare con token e permessi
- Utility Nitro per verificare sessioni, proteggere route ed effettuare richieste service-to-service
- Endpoint proxy (`/_auth-api/**`, `/.well-known/jwks.json`) per mantenere i cookie sul tuo dominio e evitare problemi CORS
- Superficie di configurazione minima che si collega ai tenant dell'Auth Service gestiti dalla tua azienda

## Quickstart

Una volta ricevuto un deployment dell'Auth Service, puoi installare l'Auth Module nelle tue applicazioni Nuxt.

1. Installa il modulo tramite il package manager preferito.
2. Registralo in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@jamflow/auth-module'],
  auth: {
    issuer: 'https://<YOUR-PROJECT>.auth.jamflow.app',
    audience: 'https://your-project.com',
  },
})
```

1. Assicurati che l'ambiente permetta di impostare cookie sicuri per l'host che serve la tua app Nuxt.
2. Usa la [Guida client](./client-guide) e la [Guida server](./server-guide) fornite per collegare i flussi utenti.

## Modello dei token

L'Auth Service emette tre cookie:

<table>
<thead>
  <tr>
    <th>
      Token
    </th>
    
    <th>
      Cookie di default
    </th>
    
    <th>
      Scopo
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      ID token
    </td>
    
    <td>
      <code>
        j_id_token
      </code>
    </td>
    
    <td>
      Identifica l'utente autenticato (nome, email, team, ecc.).
    </td>
  </tr>
  
  <tr>
    <td>
      Access token
    </td>
    
    <td>
      <code>
        j_access_token
      </code>
    </td>
    
    <td>
      Trasporta stringhe di permessi serializzate per l'autorizzazione.
    </td>
  </tr>
  
  <tr>
    <td>
      Refresh token
    </td>
    
    <td>
      <code>
        j_refresh_token
      </code>
    </td>
    
    <td>
      Permette di rinnovare ID/access token senza riautenticazione.
    </td>
  </tr>
</tbody>
</table>

Il modulo verifica i token usando il documento JWKS esposto dal tuo Auth Service. La verifica è automatica e la chiave viene messa in cache per un'ora.

## Architettura a colpo d'occhio

<mermaid>

```text
flowchart LR
  subgraph Browser
    A[Vue component]
  end
  subgraph NuxtApp[Nuxt Nitro]
    B[useUserSession]
    C[usePermissions]
    D[/requireUserSession, requireUserPermission/]
    E[Proxy routes]
  end
  subgraph AuthService
    F["/api/auth/*" endpoints]
    G["/.well-known/jwks.json"]
  end

  A --> B
  A --> C
  B & C --> E --> F
  D --> E
  E --> G
```

</mermaid>

- I composables client parlano sempre a `/_auth-api/...`, che fa da proxy verso `${issuer}/api/...`.
- Le utility server fanno lo stesso e inoltre mettono in cache i token decodificati nel contesto `H3Event` per il riutilizzo.
- Le chiavi JWKS sono proxate tramite `/.well-known/jwks.json` per evitare richieste cross-origin dal browser.

## Riferimento di configurazione

<table>
<thead>
  <tr>
    <th>
      Opzione
    </th>
    
    <th>
      Variabile d'ambiente
    </th>
    
    <th>
      Descrizione
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        auth.issuer
      </code>
    </td>
    
    <td>
      <code>
        NUXT_PUBLIC_AUTH_ISSUER
      </code>
    </td>
    
    <td>
      URL base del deployment del tuo Auth Service. Obbligatorio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.audience
      </code>
    </td>
    
    <td>
      <code>
        NUXT_PUBLIC_AUTH_AUDIENCE
      </code>
    </td>
    
    <td>
      Audience attesa per gli access token. Obbligatorio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.jwksUrl
      </code>
    </td>
    
    <td>
      <code>
        NUXT_PUBLIC_AUTH_JWKS_URL
      </code>
    </td>
    
    <td>
      Percorso al documento JWKS. Di default <code>
        /.well-known/jwks.json
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.idToken.name
      </code>
    </td>
    
    <td>
      <code>
        NUXT_PUBLIC_AUTH_ID_TOKEN_NAME
      </code>
    </td>
    
    <td>
      Nome del cookie per l'ID token. Di default <code>
        j_id_token
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.accessToken.name
      </code>
    </td>
    
    <td>
      <code>
        NUXT_PUBLIC_AUTH_ACCESS_TOKEN_NAME
      </code>
    </td>
    
    <td>
      Nome del cookie per l'access token. Di default <code>
        j_access_token
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.refreshToken.name
      </code>
    </td>
    
    <td>
      <code>
        NUXT_AUTH_REFRESH_TOKEN_NAME
      </code>
    </td>
    
    <td>
      Nome del cookie per il refresh token. Di default <code>
        j_refresh_token
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.refreshToken.expiresIn
      </code>
    </td>
    
    <td>
      <code>
        NUXT_AUTH_REFRESH_TOKEN_EXPIRES_IN
      </code>
    </td>
    
    <td>
      Scadenza (in secondi) usata per valutare la longevità del refresh token.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        auth.apiToken
      </code>
    </td>
    
    <td>
      <code>
        NUXT_AUTH_API_TOKEN
      </code>
    </td>
    
    <td>
      Token macchina per l'accesso all'API dell'Auth Service (usato da <code>
        createInvite
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Checklist per lo sviluppo usando il modulo

1. Configura i valori runtime tramite variabili d'ambiente in file `.env` o segreti di deploy.
2. Conferma che i cookie siano emessi con gli attributi `Secure` e `SameSite` attesi per il tuo scenario di hosting.
3. Decidi come l'interfaccia gestisce i fallimenti di permesso (redirect vs. stato vuoto).

## Per saperne di più

- [Guida client](/it/auth-module/client-guide.md) – lavorare con i composables, i flussi di login e i permessi in Vue.
- [Guida server](/it/auth-module/server-guide.md) – utility Nitro, guardie per i permessi e helper di servizio.
