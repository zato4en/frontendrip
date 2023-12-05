import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/DevelopmentNetworkApplicationFrontend/"
// })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/frontendrip/",
  server: {
    proxy: {
      '/api': 'http://localhost:8888',
    },
  },
})
