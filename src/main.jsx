import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppContextProvider from "./Context/AppContext.jsx";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const wallets = [new PetraWallet()];

createRoot(document.getElementById("root")).render(
  <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
    <BrowserRouter>
      <AppContextProvider>
        <div>
          <Toaster />
        </div>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </AptosWalletAdapterProvider>
);
