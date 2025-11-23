import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // สำคัญมาก! เปิด SharedArrayBuffer สำหรับไฟล์ใหญ่ 10GB+
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    target: 'es2022', // รองรับ SharedArrayBuffer
  },
})