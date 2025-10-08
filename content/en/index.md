---
links: []
navigation:
  title: Home
seo:
  title: JAMflow Documentation
  description: Documentation for JAMflow modules
---

::u-page-hero
#title
JAMflow Docs

#description
Find the documentation for JAMflow modules in Italian and English
::

::u-page-section
  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2
    to: /en/auth/getting-started
    ---

    #title
    Auth Module
    
    #description
    User authentication and management module for JAMflow applications.


    ```ts
    await requireUserPermission(event, {
      topic: 'products',
      actions: ['delete'],
    })
    ```
    ::::
  :::
::
