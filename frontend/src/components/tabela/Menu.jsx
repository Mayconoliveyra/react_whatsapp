import styled from "styled-components";

const MenuSC = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 5px;
`;
const TituloSC = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 16px;
  font-weight: bold;
`;
const UteisSC = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export default function Menu({ title, children }) {
  return (
    <MenuSC>
      <TituloSC>{title}</TituloSC>
      <UteisSC>{children}</UteisSC>
    </MenuSC>
  );
}
