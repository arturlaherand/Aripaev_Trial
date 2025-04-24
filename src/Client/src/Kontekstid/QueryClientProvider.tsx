import { DefaultError, Mutation, MutationCache, Query, QueryCache, QueryClient, QueryKey, QueryClientProvider as TanStackClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

const genericErrorMessage = "Viga päringuga";

const logErrorDetails = (error: DefaultError): void => {
    if (error) {
        console.warn(error);
    }
};

const getQueryClient = () => {
    return new QueryClient({
        defaultOptions: {},
        queryCache: new QueryCache({
            onError: (error: DefaultError, _query: Query<unknown, unknown, unknown, QueryKey>) => {
                logErrorDetails(error ?? genericErrorMessage);
            }
        }),
        mutationCache: new MutationCache({
            onError: (error: DefaultError, _variables: unknown, _context: unknown, _mutation: Mutation<unknown, unknown, unknown>) => {
                logErrorDetails(error ?? genericErrorMessage);
            }
        })
    });
}

export const QueryClientProvider = (props: PropsWithChildren) => {
    const [queryClient] = useState<QueryClient>(() => getQueryClient());

    return (
        <TanStackClientProvider client={queryClient}>
            {props.children}
        </TanStackClientProvider>
    );
};