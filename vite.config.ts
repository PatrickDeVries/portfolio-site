import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import ogPlugin from 'vite-plugin-open-graph'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    ogPlugin({
      basic: {
        title: 'Patrick DeVries',
        image: './open-graph-preview.png',
        description: "Patrick DeVries' portfolio website",
        locale: 'en_US',
      },
    }),
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
  ],
})

// <title>Patrick DeVries</title>
// <meta name="description" content="Personal website of Patrick DeVries">

// <!-- Facebook Meta Tags -->
// <meta property="og:url" content="https://www.patrickdevries.com/">
// <meta property="og:type" content="website">
// <meta property="og:title" content="Patrick DeVries">
// <meta property="og:description" content="Personal website of Patrick DeVries">
// <meta property="og:image" content="/open-graph-preview.png">

// <!-- Twitter Meta Tags -->
// <meta name="twitter:card" content="summary_large_image">
// <meta property="twitter:domain" content="patrickdevries.com">
// <meta property="twitter:url" content="https://www.patrickdevries.com/">
// <meta name="twitter:title" content="Patrick DeVries">
// <meta name="twitter:description" content="Personal website of Patrick DeVries">
// <meta name="twitter:image" content="/open-graph-preview.png">
