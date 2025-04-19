import { useContext, useEffect, useRef, useState } from "react"

import { QueryClientContext } from "./QueryClientProvider";
import { QueryClient, QueryKey } from "./QueryClient";

export interface Observer<T> {
	notify: () => void;
	subscribe: (rerender: () => void) => () => void;
	getQueryState: () => QueryState<T>;
}

export interface QueryState<T> {
	lastUpdated: number | null | void;
	data: T | null;
	error: Error | null;
}

export const createQueryObserver = <T,>(queryClient: QueryClient, { queryKey, queryFn, staleTime = 0 }: { queryKey: QueryKey; queryFn: () => Promise<T>; staleTime?: number }) => {
	console.log('queryClient', queryClient)
	const query = queryClient.getQuery(queryKey, queryFn);

	const observer: Observer<T> = {
		notify: () => { },
		subscribe: (rerender: () => void): (() => void) => {
			if (query) {
				const unsubscribe = query.subscribe(observer);
				observer.notify = rerender;

				// Check staleTime on subscription
				if (
					!query.state.lastUpdated ||
					Date.now() - query.state.lastUpdated > staleTime
				) {
					query.fetch();
				}

				return unsubscribe;
			}
			return () => { }; // No-op if query is falsy
		},
		getQueryState: (): QueryState<T> => {
			if (!query) {
				return { lastUpdated: null, data: null, error: null };
			}
			return {
				lastUpdated: query.state.lastUpdated ?? null,
				data: (query.state.data as T) ?? null,
				error: query.state.error ?? null,
			};
		},
	};

	return observer;
};

export const useQuery = <T,>({
	queryKey,
	queryFn,
	staleTime = 0,
}: { queryKey: string[]; queryFn: () => Promise<T>; staleTime?: number }) => {
	const queryClient = useContext(QueryClientContext) as QueryClient<T>;
	const observer = useRef(
		createQueryObserver(queryClient as QueryClient<unknown>, {
			queryKey,
			queryFn,
			staleTime,
		})
	);

	const [, setState] = useState(0); // Dummy state to trigger re-renders

	const rerender = () => setState((prev) => prev + 1);

	useEffect(() => {
		const unsubscribe = observer.current.subscribe(rerender);

		// Periodically check staleTime
		const interval = setInterval(() => {
			const query = observer.current.getQueryState();
			if (
				!query.lastUpdated ||
				Date.now() - query.lastUpdated > staleTime
			) {
				console.log("Stale time exceeded, fetching new data...");
				observer.current.notify(); // Trigger re-render
				queryClient.getQuery(queryKey, queryFn)?.fetch(); // Fetch new data
			}
		}, staleTime);

		return () => {
			clearInterval(interval); // Cleanup interval
			unsubscribe(); // Cleanup subscription
		};
	}, [staleTime,/*  queryKey, queryFn, queryClient */]);

	return observer.current.getQueryState();
};