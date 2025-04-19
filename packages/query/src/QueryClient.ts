import { createQuery, type Query } from './createQuery';

export type QueryKey = string | string[];

export class QueryClient<T = unknown> {
	queries: Query<T>[];

	constructor() {
		this.queries = [];
	}

	getQuery(queryKey: QueryKey, queryFn: () => Promise<T>) {
		const queryHash = JSON.stringify(queryKey);
		const existingQuery = this.queries.find((query) => query.queryHash === queryHash);

		if (!existingQuery) {
			const newQuery = createQuery(queryKey, queryFn);
			this.queries.push(newQuery);
			return newQuery;
		}
	}

	getQueries() {
		return this.queries.map((query) => query);
	}
}