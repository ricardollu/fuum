import { defineConfig } from 'wxt'
import path from 'path'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'https://api.bgm.tv/*'],
  },
  vite: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  }),
})
