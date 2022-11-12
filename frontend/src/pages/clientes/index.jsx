import apiUrl from "../../global";

import styled from "styled-components";
import Menu from "../../components/tabela/Menu";
import Titulo from "../../components/titulo";

import {
  Tabela,
  Corpo,
  Rodape,
  TdPadr,
  TdDesc,
} from "../../components/tabela/Tabela";

import { theme } from "../../styles/theme";

import {
  BsPeople,
  BsDownload,
  BsVinyl,
  BsSearch,
  BsThreeDotsVertical,
} from "react-icons/bs";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const InputSearcSC = styled.div`
  display: flex;
  align-items: center;
  padding: 11px 9px;
  border-radius: 50px;
  box-shadow: 0 0px 5px rgb(0 0 0 / 27%);
  background-color: #ffffff;
  input {
    border: none;
    outline: none;
    border-radius: 50px;
    padding-left: 7px;
    padding-right: 7px;
  }
`;
const ButtonSC = styled.button`
  padding: 7px 11px;
  background-color: #ffffff;
  border-radius: 5px;
  border: solid 1px #282544;
  font-weight: bold;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13, 5px;
`;
const ButtonSicrSC = styled(ButtonSC)`
  background-color: #252644;
  color: #ffffff;
`;
export default function Clientes() {
  const refTable = useRef(null);
  /* const [eventScroll, setEventScroll] = useState(false); */

  const [loading, setLoading] = useState(true);
  const [nextPag, setNextPage] = useState(1);
  const [allClientes, setAllClientes] = useState([]);
  const [{ total, ativos, inativos }, setTotais] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
  });

  useEffect(() => {
    refTable.current &&
      refTable.current.addEventListener("scroll", handleScroll);

    return () =>
      refTable.current &&
      refTable.current.removeEventListener("scroll", handleScroll);
  }, [allClientes]);

  useEffect(() => {
    getClientes();
  }, [nextPag]);

  function handleScroll() {
    console.log("oi");
    let alturaScroll = parseInt(
      (100 * refTable.current.scrollTop) /
        (refTable.current.scrollHeight - refTable.current.clientHeight)
    );

    /*   console.log(alturaScroll); */
    if (alturaScroll < 80 || loading) {
      return;
    }

    setNextPage(nextPag + 1);
  }

  async function getClientes() {
    setLoading(true);
    console.log("getApi; pag: " + nextPag);
    const url = `${apiUrl}/clientes?_page=${nextPag}&_limit=${250}`;
    await axios.get(url).then((res) => {
      setAllClientes([...allClientes, ...res.data.clientes]);
      setLoading(false);
    });
  }
  return (
    <>
      <Titulo
        src="c_clientes.jpg"
        titulo="Cadastro de clientes"
        descricao="Cadastre aqui os seus clientes que irão receber as informações das campanhas."
      ></Titulo>

      <Menu title="Clientes">
        <InputSearcSC>
          <input type="text" placeholder="Pesquisar"></input>
          <BsSearch />
        </InputSearcSC>
        <ButtonSC type="button">
          <BsPeople size={19} style={{ marginRight: "6px" }} /> Novo cliente
        </ButtonSC>
        <ButtonSC type="button">
          <BsDownload size={19} style={{ marginRight: "6px" }} />
          Importar contatos
        </ButtonSC>
        <ButtonSicrSC type="button">
          <BsVinyl size={19} style={{ marginRight: "6px" }} />
          Sicronizar contatos
        </ButtonSicrSC>
      </Menu>

      {!!allClientes.length > 0 && (
        <Tabela>
          <Corpo ref={refTable}>
            {allClientes.map((item) => {
              return (
                <tr key={item.codigo}>
                  <TdDesc max_w={100} descricao="Código">
                    {item.codigo}
                  </TdDesc>
                  <TdPadr max_w={999} font_w={600}>
                    {item.nome}
                  </TdPadr>
                  <TdDesc max_w={150} descricao="Numero">
                    {item.nmr_whatsapp}
                  </TdDesc>
                  <TdDesc max_w={150} descricao="Categoria">
                    {item.nmr_whatsapp}
                  </TdDesc>
                  <TdDesc max_w={150} descricao="Dispositivo">
                    {item.nmr_whatsapp}
                  </TdDesc>
                  {!item.desativado && (
                    <TdPadr
                      alinharX="center"
                      max_w={120}
                      corFont="#4EE1B2"
                      fundoCor="#b3f7e2"
                    >
                      <div>Ativo</div>
                    </TdPadr>
                  )}
                  {!!item.desativado && (
                    <TdPadr
                      alinharX="center"
                      max_w={120}
                      corFont="#FD729A"
                      fundoCor="#FFC1D4"
                    >
                      <div>Inativo</div>
                    </TdPadr>
                  )}
                  <TdPadr alinharX="center" max_w={20}>
                    <button>
                      <BsThreeDotsVertical />
                    </button>
                  </TdPadr>
                </tr>
              );
            })}
          </Corpo>

          <Rodape>
            <TdPadr
              max_w={200}
              alinharX="space-between"
              color={theme.colors.primaryColor}
            >
              <b>Quantidade:</b> {total}
            </TdPadr>
            <TdPadr
              max_w={200}
              alinharX="space-between"
              color={theme.colors.verdeCor}
            >
              <b>Ativos:</b> {ativos}
            </TdPadr>
            <TdPadr
              max_w={200}
              alinharX="space-between"
              color={theme.colors.vermelhoCor}
            >
              <b>Inativos:</b> {inativos}
            </TdPadr>
          </Rodape>
        </Tabela>
      )}
      {!allClientes.length > 0 && <h1>Vazio</h1>}
    </>
  );
}
