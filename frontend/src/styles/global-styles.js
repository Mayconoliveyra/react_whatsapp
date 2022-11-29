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
    margin: ${({ theme }) => theme.spacings.xsmall} 0;
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

  a,
  button {
    text-decoration:none;
    color:  #252644; /* cor padrão */

    &:hover{
      cursor: pointer;
      text-decoration:none;
      color:  #252644; /* cor padrão */
      opacity: 85%;
    }
    &:disabled {
      background-color:#efefef4d !important;
      color:#1010104d !important;
      border: 1px solid #7676764d !important;
      opacity: 100% !important;
    }
  }

  input:focus, 
  select:focus {
    outline: 0 !important;
    transform: scale(0.99);
  }
  
  a:active,
  button:active{
    transform: scale(0.98);
  }
  
  .table {
    width: 100%;
  }
`;
