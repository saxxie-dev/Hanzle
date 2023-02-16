# HanZle : Chinese single-character wordle
Try it at: [hanzle.saxxie.dev](hanzle.saxxie.dev)  
There are plenty of "chinese wordle" clones out there. My complaint is that they adapt their orthography to the parameters of the game, rather than adapting the game to the orthography. That's probably the right decision - but how nice of a game can we get by reversing the direction? This repo intends to find out.

## Data
We use a few datasources to extract rendering information. 
* [Babelstone IDS sequences](https://www.babelstone.co.uk/CJK/IDS.TXT) Contains IDS sequences for (every? most?) unicode-encoded CJK characters, as well as a number of not-yet-encoded components. Only a small subset is used in this project.
* [Unihan stroke counts](https://github.com/liao961120/strokes/blob/main/data/strokeCount.json) Contains the stroke counts for most chinese characters and components. Somewhat outdated. Only a small subset is included - we can re-hydrate stroke counts for most compound characters by summing all the component stroke counts.
* [Table of General Standard Chinese Characters](https://github.com/jaywcjlove/table-of-general-standard-chinese-characters/blob/main/data/characters.json) Contains the standard chinese characters. Only table 1/3 - the most common characters - is used as a source for candidate characters.

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just a extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `npm run qwik add` command to add additional integrations. Some examples of integrations include: Cloudflare, Netlify or Express server, and the [Static Site Generator (SSG)](https://qwik.builder.io/qwikcity/static-site-generation/static-site-config/).

```shell
npm run qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). During development, the `dev` command will server-side render (SSR) the output.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to locally preview a production build, and it should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. Additionally, the build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

## Static Site Generator (Node.js)

```
npm run build.server
```

## Static Site Generator (Node.js)

```
npm run build.server
```
