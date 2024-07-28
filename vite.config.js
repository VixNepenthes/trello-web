import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép sử dụng được process.env, mặc định phải sử dụng import.meta.env
  define: {
    'process.env': process.env
  },
  plugins: [react(), svgr()],
  // base: './'
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
