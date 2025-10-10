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
Find the documentation for JAMflow modules in Italian and English,   
and start building your application today!
::

::u-page-section
  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2
    to: /en/auth-module/getting-started
    ---

    #title
    Auth Module
    
    #description
    User authentication, authorization and management module for JAMflow applications.


    ```ts
    await requireUserPermission(event, {
      topic: 'products',
      actions: ['delete'],
    })
    ```
    ::::
  :::
::
