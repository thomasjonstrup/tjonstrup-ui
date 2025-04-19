import { useContext, useEffect, useReducer } from 'react';
import { useQuery } from './useQuery';
import { QueryClient } from './QueryClient';
import { QueryClientContext } from './QueryClientProvider';

const useDevtools = <T,>() => {
	const queryClient = useContext(QueryClientContext) as QueryClient<T>;

	return queryClient;
}

const ReactQueryDevtools = () => {
	const queryClient = useDevtools();

	const queries = queryClient.getQueries();
	const sortedQueries = queries.sort((a, b) => (a.queryHash > b.queryHash ? 1 : -1));
	return (
		<div className="fixed bottom-0 w-full overflow-scroll dark:text-white bg-black divide-y-2 divide-gray-800 divide-solid">
			{sortedQueries.map((query) => {
				const { queryHash, state } = query;
				return (
					<div key={queryHash} className="p-4">
						<h3 className="text-lg font-bold">{queryHash}</h3>
						<p>Last Updated: {state.lastUpdated}</p>
						<p>Data: {JSON.stringify(state.data)}</p>
						<p>Error: {JSON.stringify(state.error)}</p>
					</div>
				);
			})}
		</div>
	)
}

export default ReactQueryDevtools;