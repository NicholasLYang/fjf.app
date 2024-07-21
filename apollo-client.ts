import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { auth } from "@/auth";
import { SessionWithToken } from "@/lib/types";

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists

  const session = (await auth()) as SessionWithToken | null;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: session?.accessToken
        ? `bearer ${session?.accessToken}`
        : "",
    },
  };
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});
