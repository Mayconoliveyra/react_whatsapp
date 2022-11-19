import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../../styles/theme";

import {
  ColumnsGap,
  Megaphone,
  Phone,
  People,
  Diagram3,
  Folder,
} from "react-bootstrap-icons";

const AsideSC = styled.aside`
  grid-area: menu;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #33355b;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
  padding: 13px 30px;
`;

const LogoSC = styled.div`
  margin-top: 2px;

  img {
    width: 170px;
    height: 38px;
  }
`;

const NavSC = styled.ul`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin: 0px;
  padding: 0px;
  margin-top: 13px;
  li {
    border-top: 2px solid #c0bfc9;
    width: 100%;
    height: 86px;

    a {
      color: ${theme.colors.primaryColor};
      font-size: ${theme.font.sizes.small};
      font-family: ${theme.font.family.bold};
      letter-spacing: 0.07em;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;

      svg {
        margin-bottom: 9px;
        font-size: 25px;
      }
    }
    a:hover {
      background-color: #2a2b49;
    }
  }
  li:last-child {
    border-bottom: 2px solid #c0bfc9;
  }
`;
export default function Menu() {
  return (
    <AsideSC>
      <LogoSC>
        <img src="/images/softconnect.png" alt="Softconnect" />
      </LogoSC>
      <NavSC>
        <li>
          <Link to="dashboard">
            <ColumnsGap />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="campanhas">
            <Megaphone />
            Campanhas
          </Link>
        </li>
        <li>
          <Link to="dispositivos">
            <Phone />
            Dispositivos
          </Link>
        </li>
        <li>
          <Link to="clientes">
            <People />
            Clientes
          </Link>
        </li>
        <li>
          <Link to="categorias">
            <Diagram3 />
            Categorias
          </Link>
        </li>
        <li>
          <Link to="modelos">
            <Folder />
            Modelos
          </Link>
        </li>
      </NavSC>
    </AsideSC>
  );
}
