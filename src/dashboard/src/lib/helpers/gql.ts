import { createClient, Client} from '@urql/core';

export const getGqlClient = ():Client  => {
	const client = createClient({
		url: 'https://dgraph.xn--lkv.com/graphql',
	});

	return client;
};

export const runQuery = ({query, client, variables = {}}: {query: string, client: Client, variables?: any}) => {
	return client.query(query, variables).toPromise();
};

export const runMutation = ({mutation, client, variables}: {mutation: string, client: Client, variables: any})  => {
	
	return client.mutation(mutation, variables).toPromise();
}
