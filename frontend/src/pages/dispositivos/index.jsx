import { useEffect, useState } from "react";
import apiUrl from "../../global";
import axios from "axios";

import styled from "styled-components";
import Menu from "../../components/tabela/Menu";
import Titulo from "../../components/titulo";

import { Button } from "../../components/button";
import {
  Tabela,
  Corpo,
  Rodape,
  TdPadr,
  TdDesc,
} from "../../components/tabela/Tabela";

import { theme } from "../../styles/theme";

import { VinylFill, Search, ThreeDotsVertical } from "react-bootstrap-icons";

export default function Dispositivos() {
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const [limitPage] = useState(200);
  const [{ clientes, total, ativos, inativos }, setClientes] = useState({
    clientes: [],
    total: 0,
    ativos: 0,
    inativos: 0,
  });

  useEffect(() => {
    const refTable = document.getElementById("scrollBody");
    if (refTable) {
      refTable.addEventListener("scroll", handleScroll);

      return () => refTable.removeEventListener("scroll", handleScroll);
    }
  }, [clientes]);

  function handleScroll() {
    const refTable = document.getElementById("scrollBody");
    /* Altura atual da barra scroll na tbody(0% a 99%) 0 inicio  e 99 final. */
    let alturaScroll = parseFloat(
      (100 * refTable.scrollTop) /
        (refTable.scrollHeight - refTable.clientHeight)
    );

    if (
      alturaScroll < 99 ||
      loading ||
      nextPage >= parseFloat(total / limitPage)
    ) {
      return;
    }

    setNextPage(nextPage + 1);
  }

  useEffect(() => {
    getClientes();
  }, [nextPage]);

  async function getClientes() {
    setLoading(true);
    const url = `${apiUrl}/clientes?_page=${nextPage}&_limit=${limitPage}`;
    await axios.get(url).then((res) => {
      console.log("getApi; pag: " + nextPage);
      const data = res.data;
      setClientes({
        clientes: [...clientes, ...data.dados],
        total: data.total,
        ativos: data.ativos,
        inativos: data.inativos,
      });
      setLoading(false);
    });
  }

  return (
    <>
      <Titulo
        src="c_dipositivos.jpg"
        titulo="Cadastro de novos dispositivos"
        descricao="Cadastre novos dispositivos para ter acesso aos contatos possibilitando ainda mais alcance nas suas campanhas."
      />

      <Menu title="Dispositivos">
      {/*   <InputSearcSC>
          <input type="text" placeholder="Pesquisar"></input>
          <Search />
        </InputSearcSC> */}

        {/*  <ButtonSicrSC type="button">
          <VinylFill size={19} style={{ marginRight: "6px" }} />
          Sicronizar contatos
        </ButtonSicrSC> */}
        <Button>
          <VinylFill size={19} style={{ marginRight: "6px" }} />
          Sicronizar contatos
        </Button>
      </Menu>

      {!!clientes.length > 0 && (
        <Tabela>
          <Corpo>
            {clientes.map((item) => {
              return (
                <tr key={item.codigo}>
                  <TdPadr max_w={999} font_w={600}>
                    {item.nome}
                  </TdPadr>
                  <TdDesc max_w={999} descricao="Registro ID">
                    {item.nmr_whatsapp}-{item.nmr_whatsapp}-{item.nmr_whatsapp}-
                    {item.nmr_whatsapp}
                  </TdDesc>

                  {!item.desativado && (
                    <TdPadr
                      alinharX="center"
                      max_w={120}
                      corFont="#4EE1B2"
                      fundoCor="#b3f7e2"
                    >
                      <div>Conectado</div>
                    </TdPadr>
                  )}
                  {!!item.desativado && (
                    <TdPadr
                      alinharX="center"
                      max_w={120}
                      corFont="#FD729A"
                      fundoCor="#FFC1D4"
                    >
                      <div>Desconectado</div>
                    </TdPadr>
                  )}
                  <TdPadr alinharX="center" max_w={20}>
                    <button onClick={() => console.log("oi")}>
                      <ThreeDotsVertical />
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
      {!clientes.length > 0 && <h1>Vazio</h1>}
    </>
  );
}
