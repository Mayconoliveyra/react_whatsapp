import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../../styles/global-styles";
import { theme } from "../../styles/theme";

import { BrowserRouter } from "react-router-dom";
import MainRoutes from "../../Router";

import Layout from "../../components/template/layout";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <BrowserRouter>
        <Layout>
          <MainRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
