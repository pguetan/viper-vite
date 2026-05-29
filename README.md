# Viper Agency

Offline/static Vite + React version of the Viper agency site. The app preserves the original pages, layouts, media, interactions, and animations for local preview and cloud deployment.

The React app is preservation-first: routes render extracted Framer documents through reusable React page components. This keeps the original DOM, class names, CSS, media references, interactions, and animation runtime intact while still giving the project a Vite/React build, routing layer, and deployment package.

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
|   |   |-- FramerDocumentPage.jsx
|   |   |-- FramerPageFrame.jsx
|   |   `-- PreservedFramerPage.jsx
|   |-- generated/
|   |   |-- aboutFramerDocument.js
|   |   |-- homeFramerDocument.js
|   |   |-- workFramerDocument.js
|   |   |-- blogFramerDocument.js
|   |   `-- contactFramerDocument.js
|   |-- pages/
|       |-- HomePage.jsx
|       |-- AboutPage.jsx
|       |-- WorkPage.jsx
|       |-- BlogPage.jsx
|       `-- ContactPage.jsx
|   `-- data/
|       `-- siteRoutes.js
|-- tools/
|   |-- extract-framer-document.mjs
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
/work/raven-claw
/work/willow-studio
/work/maison-law
/work/mystic-meadows
/blog
/blog/polestar-new-ev
/blog/audemars-piguet
/blog/global-nikon-meetup
/contact
```

Each route has a React page component under `src/pages/`. Those components render generated document modules from `src/generated/` through the shared `FramerDocumentPage` component. This keeps the original visual and interaction behavior intact while making each page part of the Vite/React route tree.

## React Production Build

```powershell
npm run build
npm run preview -- --port 4174
```

Then open:

```text
http://127.0.0.1:4174/
```

Deploy the contents of `react-dist/` for the Vite + React app. Deploy the contents of `dist/` only if you want the static mirror instead.

For cloud deployment, configure the host to serve `react-dist/index.html` as the fallback for direct route loads such as `/contact` or `/work/raven-claw`.

The floating Framer badge and duplicate "Use for Free" control are hidden in the offline and React previews. The contact form is shimmed for offline/static preview and does not send messages unless connected to a real form backend.

## Reference Routes

Preserved reference routes are available under `/__reference` for visual QA, for example:

```text
/__reference/contact
/__reference/about
/__reference/work/raven-claw
```

See `docs/native-jsx-migration.md` for the conversion rules and QA gate.
