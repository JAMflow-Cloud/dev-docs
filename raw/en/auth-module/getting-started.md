# Auth Module: Getting Started

> JAMflow Authentication and Authorization

Jamflow Auth Module integrates Nuxt applications with the Jamflow Auth Service. It centralizes authentication, team membership, and permission checks without relying on database connection for each validation. Instead, it uses JWT-based ID, access, and refresh tokens issued by the Auth Service and exposes friendly utilities on both client and server.

The permissions model is inspired by Google Zanzibar and allows defining fine-grained access control rules based on user roles, team membership, and resource relationships.

## What you get

- Automatic session bootstrap during SSR and SPA hydration
- Typed Vue composables (`useUserSession`, `usePermissions`) for working with tokens and permissions
- Nitro utilities for verifying sessions, guarding routes, and performing service-to-service requests
- Proxy endpoints (`/_auth-api/**`, `/.well-known/jwks.json`) to keep cookies on your domain and avoid CORS headaches
- Minimal configuration surface that plugs into the Auth Service tenants your company manages

## Quickstart

Once you receive an Auth Service deployment, you can install the Auth Module in your Nuxt applications.

1. Install the module via your preferred package manager.
2. Register it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@jamflow/auth-module'],
  auth: {
    issuer: 'https://<YOUR-PROJECT>.auth.jamflow.app',
    audience: 'https://your-project.com',
  },
})
```

1. Ensure the environment allows setting secure cookies for the host that serves your Nuxt app.
2. Use the provided [Client-side Guide](./client-guide) and [Server-side Guide](./server-guide) to wire user flows.

## Token model

The Auth Service issues three cookies:

<table>
<thead>
  <tr>
    <th>
      Token
    </th>
    
    <th>
      Default cookie
    </th>
    
    <th>
      Purpose
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
      Identifies the logged-in user (name, email, team, etc.).
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
      Carries serialized permission strings for authorization.
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
      Allows renewing ID/access tokens without re-authentication.
    </td>
  </tr>
</tbody>
</table>

The module verifies tokens with the JWKS document exposed by your Auth Service. Verification is done automatically under the hood and caches the key set for one hour.

## Architecture at a glance

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

- Client composables always talk to `/_auth-api/...`, which proxies to `${issuer}/api/...`.
- Server utilities do the same and also cache decoded tokens on the `H3Event` context for reuse.
- JWKS keys are proxied through `/.well-known/jwks.json` to avoid cross-origin requests from the browser.

## Configuration reference

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Env Var
    </th>
    
    <th>
      Description
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
      Base URL of your Auth Service deployment. Required.
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
      Expected audience for access tokens. Required.
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
      Path to the JWKS document. Defaults to <code>
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
      Cookie name for the ID token. Defaults to <code>
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
      Cookie name for the access token. Defaults to <code>
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
      Cookie name for the refresh token. Defaults to <code>
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
      Expiration (seconds) used when evaluating refresh token longevity.
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
      Machine token for Auth Service API access (used by <code>
        createInvite
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Development checklist when using the module

1. Configure runtime values via environment variables in `.env` files or deployment secrets.
2. Confirm that cookies are issued with the expected `Secure` and `SameSite` attributes for your hosting scenario.
3. Decide how your UI handles permission failures (redirect vs. empty state).

## Learn more

- [Client-side Guide](/en/auth-module/client-guide.md) – working with composables, login flows, and permissions in Vue.
- [Server-side Guide](/en/auth-module/server-guide.md) – Nitro utilities, permission guards, and service helpers.
