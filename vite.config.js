import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {dirname, resolve} from 'node:path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        viewer_sign_up: resolve(__dirname, '/Users/jonathanlewis/Documents/Projects/royale_bets/viewer/player_tag_input.html'),
        bet_interface: resolve(__dirname, '/Users/jonathanlewis/Documents/Projects/royale_bets/viewer/bet_interface.html'),
        streamer_sign_up: resolve(__dirname, '/Users/jonathanlewis/Documents/Projects/royale_bets/streamer/streamer_sign_up.html'),
        streamer_redirect: resolve(__dirname, '/Users/jonathanlewis/Documents/Projects/royale_bets/streamer/streamer_sign_up_redirect.html')
      },
    },
  },

})
