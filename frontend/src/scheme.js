import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

const msgRequired = "Preenchimento obrigatório.";
const msgMin = "Deve ter pelo menos 5 caracteres.";

export default Yup.object().shape({
  nome: Yup.string().required().label("Nome"),
  nmr_contato: Yup.string()
    .length(14, "Número de contato deve ter exatamente 10 caracteres")
    .required()
    .label("Número de contato"),
  email: Yup.string().email().label("E-mail"),
});
