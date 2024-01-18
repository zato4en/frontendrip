import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  base: "/frontendrip/",
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.50.209:8888',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },

})
