import api from "../API";

import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

export const scheme = Yup.object().shape({
  nome: Yup.string().required().label("Nome"),
  nmr_contato: Yup.string()
    .required()
    .length(14, "O número de contato é inválido.")
    .label("Número de contato"),
  email: Yup.string().email().label("E-mail").nullable(),
});

const prefix = "/clientes";

export const get = async ({ page = 1, limit = 150, id = null }) => {
  const _id = id ? `&_id=${id}` : ''
  return await api.get(`${prefix}?_page=${page}&_limit=${limit}${_id}`);
};

export const store = async (data, id = null) => {
  if (id) {
    return await api.put(`${prefix}/${id}`, data);
  }
  return await api.post(`${prefix}`, data);
};

export const destroy = async (id) => {
  return await api.delete(`${prefix}/${id}`);
};
