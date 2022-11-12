import styled from "styled-components";

import Menu from "../menu";
import Contet from "../content";
import Header from "../header";

const AppSC = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-template-columns: 215px 1fr;
  grid-template-areas:
    "menu header"
    "menu content";
`;

export default function Layout({ children }) {
  return (
    <AppSC>
      <Menu></Menu>
      <Header></Header>
      <Contet>{children}</Contet>
    </AppSC>
  );
}
