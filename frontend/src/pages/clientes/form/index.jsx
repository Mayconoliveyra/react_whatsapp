import { Link } from "react-router-dom";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Files, Download, Repeat, Reply } from "react-bootstrap-icons";

import { store as saveClientes, scheme } from "../../../adapters/clientes";
import PageTitle from "../../../components/pageTitle";
import { Tmenu } from "../../../components/table";
import { FormC, GroupC } from "../../../components/form";
import { masks } from "../../../components/form/masks";

export default function FormClientes() {
  const formRef = useRef();
  const buttonSaveRef = useRef();

  const handleSubmitForm = () => {
    buttonSaveRef.current.disabled = true;
    setTimeout(() => {
      buttonSaveRef.current.disabled = false;
    }, 1500);
    if (formRef.current) {
      if (!formRef.current.isValid) {
        Object.keys(formRef.current.errors).forEach((item) => {
          toast.error(`${formRef.current.errors[item]}`);
        });
      }
      formRef.current.handleSubmit();
    }
  };
  return (
    <>
      <PageTitle
        src="c_clientes.jpg"
        description="Cadastre aqui os seus clientes que irão receber as informações das campanhas."
      />
      <Tmenu>
        <div data-link>
          <Link to="/clientes">
            <Reply />
          </Link>
        </div>
        <div>
          <button type="button">
            <Files />
            Clonar cadatro
          </button>
          <button type="submit" ref={buttonSaveRef} onClick={handleSubmitForm}>
            <Download />
            Salvar cadastro
          </button>
          <button type="button">
            <Repeat />
            Atualizar página
          </button>
        </div>
      </Tmenu>

      <Formik
        innerRef={formRef}
        validateOnMount
        validationSchema={scheme}
        initialValues={{
          id: undefined,
          nome: undefined,
          nmr_contato: undefined,
          email: undefined,
          cpf_cnpj: undefined,
          sexo: "Selecione",
          nascimento: undefined,
          id_dispositivo: undefined,
          id_categoria: undefined,
        }}
        onSubmit={async (values) => {
          await saveClientes(values, values.id)
            .then(() => {
              toast.success("Operação realizada com sucesso!.");
            })
            .catch((error) => {
              toast.error(`${error.response.data}`);
            });
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
            <GroupC label="Dispositivo" name="id_dispositivo" />
            <GroupC label="Sexo" name="sexo" />
            <GroupC
              label="Data de nascimento"
              name="nascimento"
              mask={masks.date}
            />
            <GroupC label="Categoria" name="id_categoria" />
          </FormC>
        )}
      </Formik>
    </>
  );
}
