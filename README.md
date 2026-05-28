# Viper Agency

Offline/static mirror of `https://viper-template.framer.website/`, plus a Vite + React wrapper app that preserves the original Framer pages, layouts, media, interactions, and animations.

The React app is intentionally preservation-first: routes render the mirrored Framer HTML inside a full-window frame. This keeps the original visuals intact while still giving the project a Vite/React build, routing layer, and deployment package. Migrating individual pages into native React components is possible later, but it should be treated as a redesign/rebuild step because exact Framer parity is hard to guarantee by hand.

## File Structure

```text
viper-agency/
|-- README.md
|-- package.json
|-- index.html
|-- vite.config.js
|-- dist/
|   |-- index.html
|   |-- about/
|   |-- blog/
|   |-- contact/
|   |-- work/
|   |-- assets/
|   |   |-- framerusercontent.com/
|   |   |-- cdn.unicorn.studio/
|   |   |-- events.framer.com/
|   |   `-- offline-support.js
|   `-- offline-manifest.json
|-- src/
|   |-- App.jsx
|   |-- main.jsx
|   |-- styles.css
|   |-- components/
|   |   |-- FramerPageFrame.jsx
|   |   `-- PreservedFramerPage.jsx
|   |-- pages/
|       |-- HomePage.jsx
|       |-- AboutPage.jsx
|       |-- WorkPage.jsx
|       |-- BlogPage.jsx
|       `-- ContactPage.jsx
|   `-- data/
|       `-- siteRoutes.js
|-- tools/
|   |-- mirror-framer-site.mjs
|   |-- prepare-vite-public.mjs
|   `-- finalize-vite-build.mjs
|-- public/
|   |-- assets/
|   `-- mirror/
`-- react-dist/
```

## Static Export Preview

Run this from PowerShell:

```powershell
cd "C:\Users\pguet\Desktop\Code Projects\viper-agency\dist"
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

Keep the PowerShell window open while previewing. Press `Ctrl+C` to stop the server.

## React App Preview

Install dependencies once:

```powershell
cd "C:\Users\pguet\Desktop\Code Projects\viper-agency"
npm install
```

Run the Vite dev server:

```powershell
npm run dev -- --port 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

All site routes are available in the React preview, including:

```text
/
/about
/work
/blog
/contact
```

Each route has a React page component under `src/pages/`. Those components intentionally preserve the generated Framer document by rendering the mirrored page through the shared `PreservedFramerPage` and `FramerPageFrame` components. This keeps the original DOM, class names, CSS, media references, interactions, and Framer animation runtime intact.

## React Production Build

```powershell
npm run build
npm run preview -- --port 4174
```

Then open:

```text
http://127.0.0.1:4174/
```

Deploy the contents of `react-dist/` for the Vite + React app. Deploy the contents of `dist/` only if you want the original static mirror instead.

For cloud deployment, configure the host to serve `react-dist/index.html` as the fallback for direct route loads such as `/contact` or `/work/raven-claw`.

The floating Framer badge and duplicate "Use for Free" control are hidden in the offline mirror. The contact form is shimmed for offline/static preview and does not send messages unless connected to a real form backend.

## Native JSX Migration Branch

The `native-jsx-pages` branch is for converting pages one at a time while keeping the current mirrored version as the visual reference.

Reference routes are available under `/__reference`, for example:

```text
/__reference/contact
/__reference/about
/__reference/work/raven-claw
```

See `docs/native-jsx-migration.md` for the conversion rules and QA gate.
