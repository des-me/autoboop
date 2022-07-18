# Autoboop

https://autoboop.com

Inspired by [Pointer Pointer](https://pointerpointer.com/)

## Architecture

The frontend uses [SvelteKit](https://kit.svelte.dev).

The backend runs on a Cloudflare worker with an Apollo server.

The assets are stored in Cloudflare's R2 Storage and accessed from the worker.

Cat data (filename, size, coordinates) is stored in Cloudflare Workers KV. The worker queries KV with the [geohash](https://www.npmjs.com/package/ngeohash) of the cursor.

[GraphQL Code Generator](https://www.graphql-code-generator.com/) is used to make the resolvers and queries strongly typed.

## Running locally

```
cd workers
npm i
./node_modules/.bin/wrangler login
npm run build
npm run start
```

```
cd frontend
cp .env.example .env
npm i
npm run dev
```