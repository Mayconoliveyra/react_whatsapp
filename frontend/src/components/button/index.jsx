import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Search } from "react-bootstrap-icons";

const ButtonSC = styled.button`
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : theme.colors.white};
  color: ${({ color }) => (color ? color : theme.colors.black)};
  padding: 7px 11px;
  border-radius: 5px;
  border: solid 1px #282544;
  font-weight: bold;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  &&:hover {
    cursor: pointer;
  }
  svg {
    margin-right: 6px;
  }
`;

const InputSearcSC = styled.div`
  display: flex;
  align-items: center;
  padding: 11px 9px;
  border-radius: 50px;
  box-shadow: 0 0px 5px rgb(0 0 0 / 27%);
  background-color: #ffffff;
  input {
    border: none;
    outline: none;
    border-radius: 50px;
    padding-left: 7px;
    padding-right: 7px;
  }
`;

export const Button = ({ ...props }) => {
  return (
    <ButtonSC {...props} type="button">
      {props.children}
    </ButtonSC>
  );
};

export const InputSearc = () => {
  return (
    <InputSearcSC type="button">
      <input type="text" placeholder="Pesquisar"></input>
      <Search />
    </InputSearcSC>
  );
};
