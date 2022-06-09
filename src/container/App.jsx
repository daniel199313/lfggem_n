
import React from "react";
import "./App.scss";

import Main from "../pages/Main";
import { MetaMaskProvider } from "metamask-react";

function App() {
  return (


    <MetaMaskProvider>
      <Main />
    </MetaMaskProvider>

  );
}

export default App;
