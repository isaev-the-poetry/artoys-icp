import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { PlugWallet } from "@connect2ic/core/providers/plug-wallet"
import { createClient } from "@connect2ic/core";
import { Connect2ICProvider } from "@connect2ic/react";
import "@connect2ic/core/style.css";
const client = createClient({
  providers: [new PlugWallet()],
  // canisters: {
  //   myCanister
  // }
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Connect2ICProvider client={client}>
      <App />
    </Connect2ICProvider>
  </React.StrictMode>
);
