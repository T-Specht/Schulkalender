import * as React from "react";
import "semantic-ui-css/semantic.min.css";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppContextProvider } from "./AppContext";

render(
  <AppContextProvider>
    <BrowserRouter basename={window.location.pathname}>
      <App />
    </BrowserRouter>
  </AppContextProvider>,
  document.getElementById("app")
);
