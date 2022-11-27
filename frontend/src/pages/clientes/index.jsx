import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PersonCircle,
  CloudDownload,
  VinylFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

import { all } from "../../adapters/clientes";
import { theme } from "../../styles/theme";
import PageTitle from "../../components/pageTitle";
import { ButtonC, InputSearch } from "../../components/button";

import {
  Tmenu,
  Table,
  TBody,
  TdDefault,
  TdDescription,
  Tfoot,
} from "../../components/table";

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

  const getClientes = async () => {
    await all(nextPage, limitPage)
      .then(async (res) => {
        const data = res.data;
        setClientes({
          clientes: [...clientes, ...data.dados],
          total: data.total,
          ativos: data.ativos,
          inativos: data.inativos,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error(
          "Ops... Não possível realizar a operação. Por favor tente novamente."
        );
        return Promise.resolve([]);
      });
  };

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

      <Tmenu>
        <div data-title>
          <h2>Clientes</h2>
        </div>

        <div>
          <InputSearch></InputSearch>
          <Link to="/clientes/novo">
            <PersonCircle /> Novo cliente
          </Link>
          <ButtonC>
            <CloudDownload />
            Importar contatos
          </ButtonC>
          <ButtonC
            css={{
              backgroundColor: theme.colors.secondaryColor,
              color: theme.colors.primaryColor,
            }}
          >
            <VinylFill />
            Sicronizar contatos
          </ButtonC>
        </div>
      </Tmenu>

      {!!clientes.length > 0 && (
        <Table>
          <TBody>
            {clientes.map((item) => {
              return (
                <tr key={item.id}>
                  <TdDefault css={cssTdDefault}>{item.nome}</TdDefault>
                  <TdDescription css={{ maxWidth: 150 }} descricao="Numero">
                    {item.nmr_contato}
                  </TdDescription>
                  <TdDescription css={{ maxWidth: 150 }} descricao="Categoria">
                    {item.nmr_contato}
                  </TdDescription>
                  <TdDescription
                    css={{ maxWidth: 150 }}
                    descricao="Dispositivo"
                  >
                    {item.nmr_contato}
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
              }}
            >
              <b>Quantidade:</b> {total}
            </TdDefault>
            <TdDefault
              css={{
                maxWidth: 200,
                color: theme.colors.greeColor,
                justifyContent: "space-between",
              }}
            >
              <b>Ativos:</b> {ativos}
            </TdDefault>
            <TdDefault
              css={{
                maxWidth: 200,
                color: theme.colors.redColor,
                justifyContent: "space-between",
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
