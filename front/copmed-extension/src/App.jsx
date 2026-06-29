import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import NovoPaciente from "./pages/NovoPaciente";
import Agendamentos from "./pages/Agendamentos";

function App() {
  const [paginaAtual, setPaginaAtual] = useState("dashboard");

  const usuarioLogado = {
    nome: "Dr. Rafael Menezes",
    clinica: "Clínica Exemplo",
  };

  if (paginaAtual === "pacientes") {
    return <Pacientes setPaginaAtual={setPaginaAtual} usuarioLogado={usuarioLogado} />;
  }

  if (paginaAtual === "novoPaciente") {
    return <NovoPaciente setPaginaAtual={setPaginaAtual} usuarioLogado={usuarioLogado} />;
  }

  if (paginaAtual === "agendamentos") {
    return <Agendamentos setPaginaAtual={setPaginaAtual} usuarioLogado={usuarioLogado} />;
  }

  return <Dashboard setPaginaAtual={setPaginaAtual} usuarioLogado={usuarioLogado} />;
}

export default App;