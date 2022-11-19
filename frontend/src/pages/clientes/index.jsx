import { useEffect, useState } from "react";
import apiUrl from "../../global";
import axios from "axios";

import { theme } from "../../styles/theme";

import PageTitle from "../../components/pageTitle";
import { Button, InputSearch } from "../../components/button";
import LinkRouter from "../../components/link";
import {
  Tmenu,
  Table,
  TBody,
  TdDefault,
  TdDescription,
  Tfoot,
} from "../../components/table";

import {
  PersonCircle,
  CloudDownload,
  VinylFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

export default function Clientes() {
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

  const cssTdDefault = {
    maxWidth: 999,
    fontWeight: "bold",
  };
  return (
    <>
      <PageTitle
        src="c_clientes.jpg"
        title="Cadastro de clientes"
        description="Cadastre aqui os seus clientes que irão receber as informações das campanhas."
      />

      <Tmenu title="Clientes">
        <InputSearch></InputSearch>
        <LinkRouter to="/clientes/novo">
          <PersonCircle /> Novo cliente
        </LinkRouter>
        <Button>
          <CloudDownload />
          Importar contatos
        </Button>
        <Button
          css={{
            backgroundColor: theme.colors.secondaryColor,
            color: theme.colors.primaryColor,
          }}
        >
          <VinylFill />
          Sicronizar contatos
        </Button>
      </Tmenu>

      {!!clientes.length > 0 && (
        <Table>
          <TBody>
            {clientes.map((item) => {
              return (
                <tr key={item.codigo}>
                  <TdDefault css={cssTdDefault}>{item.nome}</TdDefault>
                  <TdDescription css={{ maxWidth: 150 }} descricao="Numero">
                    {item.nmr_whatsapp}
                  </TdDescription>
                  <TdDescription css={{ maxWidth: 150 }} descricao="Categoria">
                    {item.nmr_whatsapp}
                  </TdDescription>
                  <TdDescription
                    css={{ maxWidth: 150 }}
                    descricao="Dispositivo"
                  >
                    {item.nmr_whatsapp}
                  </TdDescription>
                  {!item.desativado && (
                    <TdDefault
                      dataStatus
                      css={{
                        maxWidth: 120,
                        color: theme.colors.greeColor,
                        backgroundColor: "#b3f7e2",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <div>Ativo</div>
                    </TdDefault>
                  )}
                  {!!item.desativado && (
                    <TdDefault
                      dataStatus
                      css={{
                        maxWidth: 120,
                        color: theme.colors.redColor,
                        backgroundColor: "#FFC1D4",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <div>Inativo</div>
                    </TdDefault>
                  )}
                  <TdDefault css={{ maxWidth: 20, justifyContent: "center" }}>
                    <button onClick={() => console.log("oi")}>
                      <ThreeDotsVertical />
                    </button>
                  </TdDefault>
                </tr>
              );
            })}
          </TBody>

          <Tfoot>
            <TdDefault
              css={{
                maxWidth: 200,
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <b>Quantidade:</b> {total}
            </TdDefault>
            <TdDefault
              css={{
                maxWidth: 200,
                color: theme.colors.greeColor,
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <b>Ativos:</b> {ativos}
            </TdDefault>
            <TdDefault
              css={{
                maxWidth: 200,
                color: theme.colors.redColor,
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <b>Inativos:</b> {inativos}
            </TdDefault>
          </Tfoot>
        </Table>
      )}
      {!clientes.length > 0 && <h1>Vazio</h1>}
    </>
  );
}
