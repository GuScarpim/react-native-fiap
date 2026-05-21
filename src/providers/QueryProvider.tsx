import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
        },
    },
});
interface QueryProviderProps {
    children: React.ReactNode;
}
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    return (<QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>);
};
