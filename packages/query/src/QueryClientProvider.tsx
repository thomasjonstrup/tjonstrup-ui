import { createContext } from 'react';

export const QueryClientContext = createContext(null as unknown);

interface QueryClientProviderProps {
	client: unknown;
	children: React.ReactNode;
}

export const QueryClientProvider = ({
	client,
	children
}: QueryClientProviderProps) => {
	return (
		<QueryClientContext.Provider value={client}>
			{children}
		</QueryClientContext.Provider>
	);
}