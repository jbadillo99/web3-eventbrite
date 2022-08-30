import Layout from "../components/Layout";
import "../styles/globals.css";
import { ThemeProvider } from 'next-themes';
import ThemeSwitch from "../components/ThemeSwitch";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

// Configure the chains using the configureChains hook to run on the polygon chain
// Infura will be set as the provider
const { chains, provider } = configureChains(
  [chain.polygon],
  [infuraProvider({ infuraId }), publicProvider()]
);

// Connect the smart contract to the chain with our configurations
const { connectors } = getDefaultWallets({
  appName: "Web3EventBrite",
  chains,
});

// Create a wagmi client with the infura provider and polygon chain
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// Set the application to return our jsx with the configurations made above
// Wrap the application with WagmiConfig and Rainbowkit provider hooks to allow users to connect their wallets
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <WagmiConfig client={ wagmiClient }>
        <RainbowKitProvider chains={ chains }>
          <ApolloProvider client={ client }>
            <Layout>
              <Component {...pageProps} />
            </Layout> 
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig> 
    </ThemeProvider>
  );
}
