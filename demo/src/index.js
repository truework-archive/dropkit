import 'core-js/features/object/assign';
import 'regenerator-runtime/runtime';

import React from "react";
import { render } from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyle } from "@truework/ui";

import { App } from "./App.js";

/** hot module reloading */
if (module.hot && process && process.env.NODE_ENV !== "production") {
  module.hot.accept();
}

/** application code */
render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
