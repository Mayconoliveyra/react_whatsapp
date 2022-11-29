
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Download, Reply, PlusSquareDotted } from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';

import { store as save, get as getByID, scheme } from "../../../adapters/clientes";
import { ModalConfirmSave } from "../../../components/modal";
import { showSucesso, showError } from "../../../global";
import PageTitle from "../../../components/pageTitle";
import { Tmenu } from "../../../components/table";
import { FormC, GroupC, GroupSelect } from "../../../components/form";
import { masks } from "../../../components/form/masks";

export default function FormClientes() {
  const { id } = useParams()
  const formRef = useRef();
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const prefixUrl = "/clientes";
  const initialValues = {
    id: undefined,
    nome: undefined,
    nmr_contato: undefined,
    email: undefined,
    cpf_cnpj: undefined,
    sexo: "Selecione",
    nascimento: undefined,
    id_dispositivo: undefined,
    id_categoria: undefined,
  }

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
      setShowModal(true)
      return
    }
    resetForm()
  }
  function resetForm() {
    setShowModal(false)
    formRef.current.handleReset();
    navigate(`${prefixUrl}/novo`)
  }
  useEffect(() => {
    if (id) {
      getByID({ id: id })
        .then((res) => {
          if (res.data.id) {
            formRef.current.setValues({ ...res.data })
            setTimeout(() => {
              formRef.current.dirty = false;
            }, 50);
          } else {
            navigate(prefixUrl)
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

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <ModalConfirmSave>
          <button data-btn='continuar' type="button" onClick={() => resetForm()}>
            Sim, continuar.
          </button>
          <button data-btn='voltar' type="button" onClick={() => setShowModal(false)}>
            Não, voltar.
          </button>
        </ModalConfirmSave>

      </Modal>

      <Tmenu>
        <div data-title="link">
          <Link to={prefixUrl}>
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
        initialValues={initialValues}
        onSubmit={async (values) => {
          await save(values, values.id)
            .then(() => {
              const msgShow = !values.id ? 'realizado' : "alterado";
              showSucesso(`Cadastro ${msgShow} com sucesso!.`)
              navigate(prefixUrl);
            })
            .catch(showError);
        }}
      >
        {() => (
          <FormC>
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
              data={[
                { value: "Selecione", name: "Selecione" },
                { value: "Masculino", name: "Masculino" },
                { value: "Feminino", name: "Feminino" },
              ]}
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
