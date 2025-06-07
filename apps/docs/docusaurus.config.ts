import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'TS PDF',
  tagline: 'Easy to use PDF viewer for React (more frameworks coming soon)',
  favicon: 'img/tspdf-logo.png',
  url: 'https://tspdf.dev',
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'tspdf',
  projectName: 'tspdf',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Use TS PDF logo as social card image
    image: 'img/tspdf-logo.png',
    navbar: {
      title: 'TS PDF',
      logo: {
        alt: 'TS PDF Logo',
        src: 'img/tspdf-logo.png',
      },
      items: [
        {
          href: 'https://github.com/tspdf/tspdf',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://mozilla.github.io/pdf.js/',
          label: 'PDF.js',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} TS PDF. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
