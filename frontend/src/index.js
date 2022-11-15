/* import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/app";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 */

/* TEMPORARIO!! => ISSO EVITA QUE O useEffcet fique executando x2 no desenvolvimento. */
import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./pages/app";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
