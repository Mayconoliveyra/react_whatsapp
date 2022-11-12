import styled from "styled-components";

const LogoSC = styled.div`
  margin-top: 2px;

  img {
    width: 170px;
    height: 38px;
  }
`;

export default function Logo() {
  return (
    <LogoSC>
      <img src="/images/softconnect.png" alt="Softconnect" />
    </LogoSC>
  );
}
