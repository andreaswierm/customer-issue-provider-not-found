import "./App.css";
import {
  EthereumWalletConnectors,
  isEthereumWallet,
} from "@dynamic-labs/ethereum";
import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { parseEther } from "viem";

const Content = () => {
  const { user, primaryWallet } = useDynamicContext();

  const sendTransaction = async () => {
    if (primaryWallet?.connector.supportsNetworkSwitching()) {
      try {
        await primaryWallet?.switchNetwork(80002);
        console.log("Success, Network switched");
      } catch (e) {
        console.log("Error switching network", e);
      }
    }
    /** dynamic v3 lines */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let txHash: any = null;
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      return null;
    } else {
      const publicClient = await primaryWallet?.getPublicClient();
      const walletClient = await primaryWallet?.getWalletClient();

      txHash = await walletClient.sendTransaction({
        to: "--------- fill with your address --------------",
        value: parseEther("0.001"),
      });
    }

    console.log("txHash", txHash);
  };

  if (!user) {
    return <DynamicWidget />;
  }

  return (
    <div>
      <DynamicWidget />
      <button onClick={() => sendTransaction()}>Send Transaction</button>
    </div>
  );
};

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "--------- fill with your environment id --------------",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <Content />
    </DynamicContextProvider>
  );
}

export default App;
