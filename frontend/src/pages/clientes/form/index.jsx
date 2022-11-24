import { Formik } from "formik";
import scheme from "../../../scheme";

import PageTitle from "../../../components/pageTitle";
import { Tmenu } from "../../../components/table";
import { ButtonC } from "../../../components/button";
import LinkRouter from "../../../components/link";

import { Files, Download, Repeat, Reply } from "react-bootstrap-icons";

import { FormC, GroupC } from "../../../components/form";
import { masks } from "../../../components/form/masks";

export default function FormClientes() {
  const btnVoltar = (
    <LinkRouter to="/clientes" css={{ backgroundColor: "transparent" }}>
      <Reply />
    </LinkRouter>
  );
  function onSubmit(values, actions) {
    console.log(values);
    console.log(actions);
  }

  return (
    <>
      <PageTitle
        src="c_clientes.jpg"
        title="Cadastro de clientes"
        description="Cadastre aqui os seus clientes que irão receber as informações das campanhas."
      />
      <Tmenu title={btnVoltar}>
        <ButtonC>
          <Files />
          Clonar cadatro
        </ButtonC>
        <ButtonC>
          <Download />
          Salvar cadastro
        </ButtonC>
        <ButtonC>
          <Repeat />
          Atualizar página
        </ButtonC>
      </Tmenu>
      <button type="submit">Enviar</button>
      <Formik
        onSubmit={onSubmit}
        validationSchema={scheme}
        initialValues={{
          nome: "",
          nmr_contato: "",
          email: "",
          cpf_cnpj: "",
          dispositivo: "",
          sexo: "",
          data_nascimento: "",
          categoria: "",
        }}
      >
        {() => (
          <FormC>
            <GroupC label="Nome*" name="nome" />

            <GroupC
              label="Número de contato*"
              name="nmr_contato"
              mask={masks.phone}
            />

            <GroupC label="E-mail" name="email" />

            <GroupC label="CPF/CNPJ" name="cpf_cnpj" />

            <GroupC label="Dispositivo" name="dispositivo" />

            <GroupC label="Sexo" name="sexo" />

            <GroupC
              label="Data de nascimento"
              name="data_nascimento"
              mask={masks.date}
            />

            <GroupC label="Categoria" name="categoria" />
            <button type="submit">Enviar</button>
          </FormC>
        )}
      </Formik>
    </>
  );
}
