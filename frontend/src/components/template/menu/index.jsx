import styled from "styled-components";

import Logo from "./components/Logo";
import Nav from "./components/Nav";

const AsideSC = styled.aside`
  grid-area: menu;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #33355b;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
  padding: 13px 30px;
`;

export default function Menu() {
  return (
    <AsideSC>
      <Logo></Logo>
      <Nav></Nav>
    </AsideSC>
  );
}
