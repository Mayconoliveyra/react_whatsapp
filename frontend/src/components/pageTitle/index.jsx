import styled from "styled-components";

const TitleSC = styled.div`
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
    /* font-size: 1.5em; */
    margin: 0px;
    padding: 0px;
    padding-bottom: 10px;
  }
  p {
    /* font-size: 15px; */
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

export default function PageTitle({
  src = "c_clientes.jpg",
  title = "Sem Título",
  description = "Sem Descrição",
}) {
  return (
    <TitleSC>
      <div>
        <img src={`/images/${src}`} alt="Soft Connect" />
      </div>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </TitleSC>
  );
}
