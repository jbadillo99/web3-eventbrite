import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/jbadillo99/web3-eventbrite",
    cache: new InMemoryCache(),
});

export default client;