import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../../styles/global-styles";
import { theme } from "../../styles/theme";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter } from "react-router-dom";
import MainRoutes from "../../Router";

import Layout from "../../components/template/layout";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <GlobalStyles />

      <BrowserRouter>
        <Layout>
          <MainRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
