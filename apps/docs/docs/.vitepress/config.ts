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
    logo: '/reformed.png',
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
      '/': [
        {
          text: 'Tutorial',
          collapsible: true,
          items: [
            {
              text: 'Getting started',
              link: '/tutorial/'
            },
            {
              text: 'Intro',
              items: [
                {
                  text: 'Fields',
                  link: '/tutorial/intro/fields'
                },
                {
                  text: 'Dynamic',
                  link: '/tutorial/intro/dynamic'
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
      ]
    },
    editLink: {
      pattern: 'https://github.com/secundant/reformed/blob/master/apps/docs/docs/:path'
    },
    nav: [
      {
        text: 'Tutorial',
        link: '/tutorial/',
        activeMatch: '^/(tutorial)/'
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
