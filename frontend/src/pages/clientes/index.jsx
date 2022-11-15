import { useEffect, useState } from "react";
import apiUrl from "../../global";
import axios from "axios";

import { theme } from "../../styles/theme";

import Titulo from "../../components/titulo";
import Menu from "../../components/tabela/Menu";
import { Button, InputSearc } from "../../components/button";
import {
  Tabela,
  Corpo,
  Rodape,
  TdPadr,
  TdDesc,
} from "../../components/tabela/Tabela";

import {
  PersonCircle,
  CloudDownload,
  VinylFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

export default function Clientes() {
  const [mode, setMode] = useState(null);
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

  function adicionarCLiente(mode = null) {
    setMode(mode);
  }
  return (
    <>
      <Titulo
        src="c_clientes.jpg"
        titulo="Cadastro de clientes"
        descricao="Cadastre aqui os seus clientes que irão receber as informações das campanhas."
      />

      {!mode && (
        <Menu title="Clientes">
          <InputSearc></InputSearc>
          <Button onClick={() => adicionarCLiente("save")}>
            <PersonCircle size={19} /> Novo cliente
          </Button>
          <Button>
            <CloudDownload size={19} />
            Importar contatos
          </Button>
          <Button
            backgroundColor={theme.colors.black}
            color={theme.colors.white}
          >
            <VinylFill size={19} />
            Sicronizar contatos
          </Button>
        </Menu>
      )}

      {!!clientes.length > 0 && (
        <Tabela>
          <Corpo>
            {clientes.map((item) => {
              return (
                <tr key={item.codigo}>
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
