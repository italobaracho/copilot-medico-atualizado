import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import NovoPaciente from "./pages/NovoPaciente";

function App() {
  const [paginaAtual, setPaginaAtual] = useState("dashboard");

  if (paginaAtual === "pacientes") {
    return <Pacientes setPaginaAtual={setPaginaAtual} />;
  }

  if (paginaAtual === "novoPaciente") {
    return <NovoPaciente setPaginaAtual={setPaginaAtual} />;
  }

  return <Dashboard setPaginaAtual={setPaginaAtual} />;
}

export default App;