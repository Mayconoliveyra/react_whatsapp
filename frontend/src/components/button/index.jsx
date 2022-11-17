import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Search } from "react-bootstrap-icons";

const ButtonSC = styled.button`
  font-size: ${({ css }) => css.fontSize} !important;
  font-weight: ${({ css }) => css.fontWeight} !important;
  color: ${({ css }) => css.color} !important;
  background-color: ${({ css }) => css.backgroundColor} !important;
  padding: ${({ css }) => css.padding} !important;
  margin: ${({ css }) => css.margin} !important;
  border-radius: ${({ css }) => css.borderRadius} !important;
`;

const InputSearchSC = styled.div`
  display: flex;
  align-items: center !important;

  border-radius: 50px;
  box-shadow: 0 0px 5px rgb(0 0 0 / 27%);
  background-color: #ffffff;
  input {
    border: none;
    outline: none;
    border-radius: 50px;
    padding-left: 15px;
    padding-right: 5px;
    font-size: ${theme.font.sizes.xsmall};
    min-width: 250px;
  }
  svg {
    margin-right: 10px;
    font-size: 1rem;
  }
`;

export const Button = ({ children, css = {} }) => {
  const cssDefault = {
    fontSize: css.fontSize ? css.fontSize : "",
    color: css.color ? css.color : "",
    fontWeight: css.fontWeight ? css.fontWeight : "",
    backgroundColor: css.backgroundColor ? css.backgroundColor : "",
    padding: css.padding ? css.padding : "",
    margin: css.margin ? css.margin : "",
    borderRadius: css.borderRadius ? css.borderRadius : "",
  };
  return (
    <ButtonSC css={cssDefault} type="button">
      {children}
    </ButtonSC>
  );
};

export const InputSearch = () => {
  return (
    <InputSearchSC>
      <input type="text" placeholder="Pesquisar"></input>
      <Search />
    </InputSearchSC>
  );
};
