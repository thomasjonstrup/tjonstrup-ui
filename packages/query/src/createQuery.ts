import { QueryKey } from "./QueryClient";

export type Status = 'pending' | 'success' | 'error';

export interface Query<T> {
	queryKey: QueryKey;
	queryHash: string;
	fetchingFunction: (() => Promise<void>) | null;
	subscribers: Array<{ notify: () => void }>;
	state: {
		status: Status;
		isFetching: boolean;
		data?: T;
		error?: Error;
		lastUpdated?: number;
	};
	subscribe: (subscriber: { notify: () => void }) => () => void;
	setState: (updater: (state: Query<T>['state']) => Query<T>['state']) => void;
	fetch: () => Promise<void>;
}

export const createQuery = <T,>(queryKey: QueryKey, queryFn: () => Promise<T>) => {
	const query: Query<T> = {
		queryKey,
		queryHash: JSON.stringify(queryKey),
		fetchingFunction: null,
		subscribers: [],
		state: {
			status: 'pending',
			isFetching: true,
			data: undefined,
			error: undefined,
			lastUpdated: undefined
		},
		subscribe: (subscriber) => {
			query.subscribers.push(subscriber);
			return () => {
				query.subscribers = query.subscribers.filter((s) => s !== subscriber);
			}
		},
		setState: (updater) => {
			query.state = updater(query.state);
			query.subscribers.forEach((subscriber) => {
				subscriber.notify();
			});
		},
		fetch: async () => {
			if (!query.fetchingFunction) {
				query.fetchingFunction = (async () => {
					query.setState((prevState) => {
						return {
							...prevState,
							isFetching: true,
							error: undefined
						};
					});

					try {
						const data = await queryFn();
						query.setState((prevState) => {
							const newContent = {
								...prevState,
								status: 'success' as Status,
								data,
								lastUpdated: Date.now()
							};
							return newContent;
						});
					} catch (error: unknown) {
						query.setState((prevState) => {
							return {
								...prevState,
								status: 'error',
								error: error as Error
							};
						});
					} finally {
						query.fetchingFunction = null;
						// Set isFetching to false after the query has been fetched
						query.setState((prevState) => {
							return {
								...prevState,
								isFetching: false
							};
						});
					}
				});

				query.fetchingFunction?.();
			}
		}
	};

	return query;
}