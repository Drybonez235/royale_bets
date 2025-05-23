import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {dirname, resolve} from 'node:path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'dist', // Where to output build files
    emptyOutDir: true, // Clean dist before building
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        viewer_sign_up: resolve(__dirname, '/viewer/player_tag_input.html'),
        bet_interface: resolve(__dirname, '/viewer/bet_interface.html'),
        streamer_sign_up: resolve(__dirname, '/streamer/streamer_sign_up.html'),
        streamer_redirect: resolve(__dirname, '/streamer/streamer_sign_up_redirect.html')
      },
    },
  },

  server: {
    port: 3000,
    open: true, // Set to true if you want the browser to open on `npm run dev`
    strictPort: true, // Fail if 3000 is in use
    proxy: {
        '/redirect': {
          target: 'http://localhost:5318',
          changeOrigin: true,
        },
        '/subscription_handler': {
          target: 'http://localhost:5318',
          changeOrigin: true,
        },
        '/receive_twitch_event': {
          target: 'http://localhost:5318',
          changeOrigin: true,
        },
        '/verify_player_tag': {
          target: 'http://localhost:5318',
          changeOrigin: true,
        },
        '/start_royale_bets': {
          target: 'http://localhost:5318',
          changeOrigin: true,
        },
        '/update_royale_bets': {
          target: 'http://localhost:5318',
          changeOrigin: true,
        },
      }
  },

})
//This is a test to see if I am in the bug branch.