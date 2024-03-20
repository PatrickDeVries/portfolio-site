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
        image: 'https://www.patrickdevries.com/og-image.png',
        description: "Patrick DeVries' portfolio website",
        locale: 'en_US',
        type: 'website',
        url: 'https://www.patrickdevries.com/',
      },
      twitter: {
        title: 'Patrick DeVries',
        image: 'https://www.patrickdevries.com/og-image.png',
        description: "Patrick DeVries' portfolio website",
        card: 'summary_large_image',
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
