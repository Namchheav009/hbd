# A Little World for You ♡

A complete React + Vite birthday gift with Tailwind CSS, Motion, and Lucide icons. No backend required.

## Run

Install Node.js 20.19+ or 22.12+, then run:

```sh
npm install
npm run dev
```

Build with `npm run build`; serve the build with `npm run preview`.

## Make it yours

Edit **src/config.js** for names, birthday (YYYY-MM-DD), messages, love letter, reasons, six memories, future plans, and the final message. Default personal copy is example text: review it before sharing.

Replace the six locally stored SVG illustrations by adding your JPG/WebP photos to **public/photos/** and changing their paths in the config. Set `heroPhoto` and `finalPhoto` too. Images have a local fallback. The small placeholder notice is in the Memories section of `src/main.jsx`; remove it after replacing the illustrations.

Put your own permitted audio file in **public/music/** and set `music: '/music/our-song.mp3'`. An empty music path plays a quiet, locally synthesized music-box melody. Music starts only with the play button; it never autoplays. No microphone access is used for the candle interaction.

Fonts use Google Fonts with serif, cursive, and sans-serif fallbacks. Photos and music stay local. For fully offline fonts, download licensed font files into public/fonts and replace the Google Fonts import with @font-face rules.

## Deploy

For Vercel, import this folder/repository, choose Vite, build command **npm run build**, output **dist**. For Netlify use the same build/output settings, or drag the built **dist** folder into a manual deploy. This is a single-page static app with hash navigation; no server routes or secrets are needed.

Keyboard support includes visible focus, Escape to close dialogs, trapped dialog focus, arrow keys in the gallery viewer, and focus restoration. Reduced motion is respected. Replay resets the story, hearts, candles, and gift.
