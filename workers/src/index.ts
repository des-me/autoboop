import { createServer } from '@graphql-yoga/common';
import geohash from 'ngeohash';
import { Resolvers } from './generated-resolver-types';
import typeDefs from './schema.graphql';

declare const AUTOBOOP_KV;
declare const AUTOBOOP_R2;

const resolvers: Resolvers<Request> = {
	Query: {
		cat: async (parent, { x, y }, ctx) => {
			const hash = geohash.encode_int(x, y);
			const cats = await AUTOBOOP_KV.list({ prefix: hash.toString().slice(0, 2) });
			console.log(`Got ${cats.keys.length} keys. Comparing with hash ${hash}`);
			const keys: number[] = cats.keys
				.map((k) => parseInt(k.name))
				.sort((a, b) => Math.abs(a - hash) - Math.abs(b - hash))
				.slice(0, 10);
			const key = keys[Math.floor(Math.random() * keys.length)];
			const data = await AUTOBOOP_KV.get(key, { type: 'json' });
			return {
        ...data,
        name: `cats/${data.name}`
      };
		}
	}
};

const yoga = createServer({
	schema: {
		typeDefs,
		resolvers: resolvers
	},
	graphiql: {
		defaultQuery: /* GraphQL */ `
			query Cat($x: Int!, $y: Int!) {
				cat(x: $x, y: $y) {
					y
					x
					width
					name
					height
					base64
				}
			}
		`
	}
});

async function handleRequest(request: Request) {
	const url = new URL(request.url);
	if (url.pathname.startsWith('/graphql')) {
		return yoga.handleRequest(request);
	} else {
		const key = url.pathname.slice(1);
		const object = await AUTOBOOP_R2.get(`${key}`);

		if (object === null) {
			return new Response('Object Not Found', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		return new Response(object.body, {
			headers
		});
	}
}

addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event.request));
});
