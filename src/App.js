import "./App.css";
import { Homepage } from "./pages/Homepage";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, goerli, polygonMumbai } from "@wagmi/core/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";

function App() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, goerli, polygonMumbai],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === mainnet.id) {
            return {
              http: "https://eth-mainnet.g.alchemy.com/v2/AJQ3xAToNbhrRgr-JKAnZzYYT0-KrC8P",
              webSocket:
                "wss://eth-mainnet.g.alchemy.com/v2/AJQ3xAToNbhrRgr-JKAnZzYYT0-KrC8P",
            };
          } else if (chain.id === goerli.id) {
            return {
              http: "https://eth-goerli.g.alchemy.com/v2/ZCKGMAa8VUVlwSU3XhlREkPDWIDyAvbQ",
              webSocket:
                "wss://eth-goerli.g.alchemy.com/v2/ZCKGMAa8VUVlwSU3XhlREkPDWIDyAvbQ",
            };
          } else if (chain.id === polygonMumbai.id) {
            return {
              http: "https://polygon-mumbai.g.alchemy.com/v2/Ns5fI1hfcy06usLf4LUEq-r7zyOz8mXv",
              webSocket:
                "wss://polygon-mumbai.g.alchemy.com/v2/Ns5fI1hfcy06usLf4LUEq-r7zyOz8mXv",
            };
          }
        },
      }),
    ]
  );
  const config = createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={config}>
      <Homepage />
    </WagmiConfig>
  );
}

export default App;
