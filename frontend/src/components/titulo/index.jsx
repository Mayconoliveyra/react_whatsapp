import styled from "styled-components";

const TituloSC = styled.div`
  margin-top: 17px;
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: #fdfdfd;
  border-radius: 7px;
  padding: 5px;
  box-shadow: 0 0px 5px rgb(0 0 0 / 27%);
  height: 115px;
  h1 {
    font-size: 19px;
    margin: 0px;
    padding: 0px;
    padding-bottom: 10px;
  }
  p {
    font-size: 15px;
    margin: 0px;
    padding: 0px;
  }
  div:first-child {
    margin-right: 17px;
    img {
      width: 140px;
      height: 90px;
    }
  }
`;

export default function Titulo({ src = "c_clientes.jpg", titulo, descricao }) {
  return (
    <TituloSC>
      <div>
        <img src={`/images/${src}`} alt="Soft Connect" />
      </div>
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </TituloSC>
  );
}
