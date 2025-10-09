---
links: []
navigation:
  title: Home
seo:
  title: JAMflow Documentazione
  description: Documentazione per i moduli JAMflow
---

::u-page-hero
#title
JAMflow Docs

#description
La documentazione per i moduli JAMflow in italiano e inglese
::

::u-page-section
  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2
    to: /it/auth-module/getting-started
    ---

    #title
    Auth Module
    
    #description
    Modulo di autenticazione e gestione degli utenti per le applicazioni JAMflow.

    ```ts
    await requireUserPermission(event, {
      topic: 'products',
      actions: ['delete'],
    })
    ```
    ::::
  :::
::
