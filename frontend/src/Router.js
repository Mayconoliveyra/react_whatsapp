import { Routes, Route } from "react-router-dom";

import Clientes from "./pages/clientes";
import FormClientes from "./pages/clientes/form";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Clientes />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/clientes/novo" element={<FormClientes />} />
      <Route path="/clientes/alterar/:id" element={<FormClientes />} />
    </Routes>
  );
}
