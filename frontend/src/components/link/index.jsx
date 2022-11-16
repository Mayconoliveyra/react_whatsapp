import { Link } from "react-router-dom";
import { theme } from "../../styles/theme";
import styled from "styled-components";

const LinkSC = styled(Link)`
  color: ${({ css }) => css.color};
  font-weight: ${({ fontWeight }) => fontWeight};
  background-color: ${({ backgroundColor1 }) => backgroundColor1};
`;

export default function LinkRouter({ to = "/", children, css = {} }) {
  const cssDefault = {
    color: css.color ? css.color : theme.colors.black,
    fontWeight: css.fontWeight ? css.fontWeight : "bold",
    backgroundColor: css.backgroundColor
      ? css.backgroundColor
      : theme.colors.white,
  };
  return (
    <LinkSC css={cssDefault} to={to}>
      {children}
    </LinkSC>
  );
}
