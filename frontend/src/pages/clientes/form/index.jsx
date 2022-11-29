import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Field, Formik } from "formik";
import { Download, Reply, PlusSquareDotted } from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';

import { ModalConfirmSave } from "../../../components/modal";
import { showSucesso, showError } from "../../../global";
import { store as save, scheme } from "../../../adapters/clientes";
import PageTitle from "../../../components/pageTitle";
import { Tmenu } from "../../../components/table";
import { FormC, GroupC, GroupSelect } from "../../../components/form";
import { masks } from "../../../components/form/masks";
import axios from "axios";

export default function FormClientes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const formRef = useRef();
  const [show, setShow] = useState(false);

  const handleSubmitForm = () => {
    if (formRef.current) {
      if (!formRef.current.isValid) {
        /* Exibe as mensagens de rejeição retornada do bacckend */
        Object.keys(formRef.current.errors).forEach((item) => {
          toast.error(`${formRef.current.errors[item]}`);
        });
      }
      formRef.current.handleSubmit();
    }
  };
  const handleResetForm = () => {
    if (formRef.current && formRef.current.dirty) {
      setShow(true)
      return
    }
    resetForm()
  }
  function resetForm() {
    setShow(false)
    formRef.current.handleReset();
  }
  useEffect(() => {
    if (id) {
      axios.get(`http://10.0.0.200:3030/clientes?_id=${id}`)
        .then(res => {
          if (res.data.id) {
            formRef.current.setValues({ ...res.data })
          } else {
            navigate("/clientes")
          }
        })
        .catch(showError)
    }
  }, [])
  return (
    <>
      <PageTitle
        title="Cadastro de clientes"
        src="c_clientes.jpg"
        description="Cadastre aqui os seus clientes que irão receber as informações das campanhas."
      />

      <Modal centered show={show} onHide={() => setShow(false)}>
        <ModalConfirmSave>
          <button data-btn='continuar' type="button" onClick={() => resetForm()}>
            Sim, continuar.
          </button>
          <button data-btn='voltar' type="button" onClick={() => setShow(false)}>
            Não, voltar.
          </button>
        </ModalConfirmSave>

      </Modal>

      <Tmenu>
        <div data-title="link">
          <Link to="/clientes">
            <Reply />
          </Link>
        </div>

        <div>
          <button type="button" onClick={handleResetForm}>
            <PlusSquareDotted />
            Novo cadastro
          </button>
          <button type="submit" onClick={handleSubmitForm}>
            <Download />
            Salvar cadastro
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
          await save(values, values.id)
            .then(() => {
              showSucesso('Cliente cadastro com sucesso!.');
              navigate("/clientes");
            })
            .catch(showError);
        }}
      >
        {() => (
          <FormC>
            {/*  <Field as="select" name="sexo">
              <option value="Selecione">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Field> */}
            <GroupC
              label="Nome*"
              name="nome"
            />
            <GroupC
              label="Número de contato*"
              name="nmr_contato"
              mask={masks.phone}
            />
            <GroupC
              label="E-mail"
              name="email"
            />
            <GroupC
              label="CPF/CNPJ"
              name="cpf_cnpj"
            />
            <GroupC
              label="Dispositivo"
              name="id_dispositivo"
            />
            <GroupSelect
              label="Sexo"
              name="sexo"
            />
            <GroupC
              label="Data de nascimento"
              name="nascimento"
              mask={masks.date}
            />
            <GroupC
              label="Categoria"
              name="id_categoria"
            />
          </FormC>
        )}
      </Formik>
    </>
  );
}
