import styled from "styled-components";

const ContentSC = styled.div`
  grid-area: content;
  margin: 0px 45px;
  display: flex;
  flex-direction: column;
`;

export default function Content({ children }) {
  return <ContentSC>{children}</ContentSC>;
}
