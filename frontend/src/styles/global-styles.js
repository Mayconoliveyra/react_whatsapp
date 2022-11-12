import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
  }
  body {
    font-size: 1.4rem;
    font-family: ${({ theme }) => theme.font.family.default};
    min-height: 100vh;
    display:flex;
    background-color: #f5f5f5;
  }
  #root {
    flex:1;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.font.family.secondary};
    margin: ${({ theme }) => theme.spacings.large} 0;
  }
  p {
    margin: ${({ theme }) => theme.spacings.medium} 0;
  }
  ul, ol {
    margin: ${({ theme }) => theme.spacings.medium};
    padding: ${({ theme }) => theme.spacings.medium};
  }
  li{
    list-style-type: none;
  }
  a {
    color: ${({ theme }) => theme.colors.secondaryColor};
  }
  .table {
    width: 100%;
   /*  overflow-y: auto; */
  }
`;
