import * as React from "react";
import "semantic-ui-css/semantic.min.css";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppContextProvider } from "./AppContext";
import { DefaultConfig } from "./IDefaultConfig";

const fallbackConfig: DefaultConfig = {
  "CALENDARS-GROUPS": [],
  CALENDARS: [],
  CALENDARS_API: "",
  CALENDARS_TEXT_LENGTH: 999,
  CALENDARS_UPDATE_INTERVAL: 60
};

fetch("config.json")
  .then(res => res.json())
  .then((config: DefaultConfig) => {
    console.log('Config gefunden.', config);
    
    render(
      <AppContextProvider defaultConfig={config}>
        <BrowserRouter basename={window.location.pathname}>
          <App />
        </BrowserRouter>
      </AppContextProvider>,
      document.getElementById("app")
    );
  })
  .catch(err => {
    console.log('Fehler beim Laden der Config. Fallback...', err);
    render(
      <AppContextProvider defaultConfig={fallbackConfig}>
        <BrowserRouter basename={window.location.pathname}>
          <App />
        </BrowserRouter>
      </AppContextProvider>,
      document.getElementById("app")
    );
  });
