import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig} from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

// configureChains hook to configure for polygon mumbai testnet and the the infuraId
const {chains, provider } = configureChains(
  [chain.polygon],
  [infuraProvider({infuraId}),publicProvider()]
);

// Connect the wallet configured to the the polygon mumbai testnet and the our Smart Contract
const { connectors } = getDefaultWallets({
  appName: "web3-eventbrite",
  chains,
});

// Create a wagmi client that autoconnects to the wallet so the client only has to connect their wallet once
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  providers,
});

// Wrap the dApp frontend within WagmiConfig and RainbowKitProvider
export default function MyApp({Component,pageProps}){
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
