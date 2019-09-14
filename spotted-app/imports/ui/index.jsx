import React, { Component } from "react";
import { Provider } from "react-redux";

import store from "./redux/stores/index.js";
import App from "./components/app/App.jsx";

export default class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
