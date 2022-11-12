import styled from "styled-components";
import { House, ChevronDown, PersonCircle } from "react-bootstrap-icons";

const HeaderSC = styled.div`
  grid-area: header;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-top: 5px;
`;
const UserDropSC = styled.div`
  display: flex;
  background-color: #fdfdfd;
  text-transform: uppercase;
  border-radius: 25px;
  padding: 4px;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  box-shadow: 0 0px 6px rgb(0 0 0 / 27%);
`;

export default function Header() {
  return (
    <HeaderSC>
      <House size={27}></House>
      <UserDropSC>
        <PersonCircle size={28} style={{ marginRight: "7px" }} />
        Mendes & Silva LTDA
        <ChevronDown style={{ marginLeft: "15px", marginRight: "4px" }} />
      </UserDropSC>
    </HeaderSC>
  );
}
