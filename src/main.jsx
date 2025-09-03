import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { getRuntimeConfig } from "./config";

const Root = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      const runtimeConfig = await getRuntimeConfig();
      setConfig(runtimeConfig);
      console.log(runtimeConfig.VITE_API_BASE, runtimeConfig.FIREBASE_APIKEY);
    }
    fetchConfig();
  }, []);

  return <App config={config} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Root />
  </Provider>
);
