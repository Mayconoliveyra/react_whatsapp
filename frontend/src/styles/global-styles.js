import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
@font-face {
    font-family: 'roboto-regular';
    src: url('/font/Roboto-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'roboto-medium';
    src: url('/font/Roboto-Medium.ttf') format('truetype');
  }
  @font-face {
    font-family: 'roboto-bold';
    src: url('/font/Roboto-Bold.ttf') format('truetype');
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 1em;
    scroll-behavior: smooth;
  }

  body {
   
    font-size: ${({ theme }) => theme.font.sizes.xsmall};
    font-family: ${({ theme }) => theme.font.family.regular};
    background-color: #f5f5f5; /* cor padrão */
    color:  #252644; /* cor padrão */
    letter-spacing: 0.025em;
    height: 100vh;
    display:flex;
  }
  #root {
    flex:1;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.font.family.default};
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

  a,button {
    text-decoration:none;
    color:  #252644; /* cor padrão */
    &:hover{
      cursor: pointer;
      text-decoration:none;
      color:  #252644; /* cor padrão */
      opacity: 85%;
    }
  }
    input:active, button:active {
    outline-style: none !important;
    box-shadow: 0 0 0 0 !important;
    outline: 0 !important;
  }
    input:focus, button:focus {
    outline-style: none !important;
    box-shadow: 0 0 0 0 !important;
    outline: 0 !important;
  }
  .table {
    width: 100%;
   /*  overflow-y: auto; */
  }
`;
