import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";

const LinkSC = styled(Link)`
  font-size: ${({ css }) => css.fontSize} !important;
  font-family: ${({ css }) =>
    css.fontWeight ? theme.font.family.medium : ""} !important;
  color: ${({ css }) => css.color} !important;
  background-color: ${({ css }) => css.backgroundColor} !important;
  padding: ${({ css }) => css.padding} !important;
  margin: ${({ css }) => css.margin} !important;
  border-radius: ${({ css }) => css.borderRadius} !important;
`;

export default function LinkRouter({ to = "/", children, css = {} }) {
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
    <LinkSC css={cssDefault} to={to}>
      {children}
    </LinkSC>
  );
}
