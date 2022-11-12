import styled from "styled-components";

import Link from "./Link";

import {
  ColumnsGap,
  Megaphone,
  Phone,
  People,
  Diagram3,
  Folder,
} from "react-bootstrap-icons";

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
  }
  li:last-child {
    border-bottom: 2px solid #c0bfc9;
  }
  a {
    color: #ebeded;
    font-weight: bold;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }
  a:hover {
    background-color: #2a2b49;
  }
`;

const styleIcon = {
  marginBottom: "8px",
  fontSize: "25px",
};

export default function Nav() {
  const dashboard = <ColumnsGap style={styleIcon} />;
  const campanhas = <Megaphone style={styleIcon} />;
  const dispositivo = <Phone style={styleIcon} />;
  const clientes = <People style={styleIcon} />;
  const categorias = <Diagram3 style={styleIcon} />;
  const modelos = <Folder style={styleIcon} />;

  return (
    <NavSC>
      <Link to="/dashboard" name="Dashboard" icon={dashboard}></Link>
      <Link to="/campanhas" name="Campanhas" icon={campanhas}></Link>
      <Link to="/dispositivos" name="Dispositivos" icon={dispositivo}></Link>
      <Link to="/clientes" name="Clientes" icon={clientes}></Link>
      <Link to="/categorias" name="Categorias" icon={categorias}></Link>
      <Link to="/modelos" name="Modelos" icon={modelos}></Link>
    </NavSC>
  );
}
