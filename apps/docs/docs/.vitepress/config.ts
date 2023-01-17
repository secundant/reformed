import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'reformed',
  description: 'Brings business logic to forms',
  lastUpdated: true,
  head: [],
  outDir: resolve(__dirname, '..', 'dist'),
  themeConfig: {
    siteTitle: 'Reformed',
    logo: '/reformed.svg',
    footer: {
      message: '@secundant (Dmitry Remezov)',
      copyright: 'Copyright © 2023'
    },
    outline: [2, 3],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/secundant/reformed'
      }
    ],
    sidebar: {
      '/learn': [
        {
          text: 'Learn',
          collapsible: true,
          items: [
            {
              text: 'Getting started',
              link: '/learn/'
            },
            {
              text: 'Intro',
              items: [
                {
                  text: 'Create fields',
                  link: '/learn/quick-start/create-fields'
                },
                {
                  text: 'Combine fields',
                  link: '/learn/intro/dynamic'
                }
              ]
            }
          ]
        },
        {
          text: 'More',
          items: [
            {
              text: 'Releases policy',
              link: '/statements/releases-policy'
            }
          ]
        }
      ],
      '/api': [
        {
          text: 'Field',
          items: [
            {
              text: 'Field',
              link: '/api/entities/field'
            }
          ]
        }
      ]
    },
    editLink: {
      pattern: 'https://github.com/secundant/reformed/blob/master/apps/docs/docs/:path'
    },
    nav: [
      {
        text: 'Learn',
        link: '/learn/',
        activeMatch: '^/(learn)/'
      },
      {
        text: 'API',
        link: '/api/',
        activeMatch: '^/(api)/'
      },
      {
        text: 'Roadmap',
        link: '/roadmap'
      },
      {
        text: 'Releases policy',
        link: '/statements/releases-policy'
      }
    ]
  },
  lang: 'en-US',
  locales: {
    '/': {
      lang: 'en-US',
      label: 'English'
    }
  },
  markdown: {
    toc: {
      level: [2, 3, 4]
    },
    headers: {
      level: [2, 3, 4]
    }
  }
});
