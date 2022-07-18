import { ApolloClient, InMemoryCache } from '@apollo/client/core/index';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
	uri: `${import.meta.env.VITE_API_BASE_URL}/graphql`
});

export default client;
