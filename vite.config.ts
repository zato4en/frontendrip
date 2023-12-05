import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/DevelopmentNetworkApplicationFrontend/"
// })

// https://vitejs.dev/config/i
export default defineConfig({
  base: "/frontendrip/",
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8888',
    },
  },
})
