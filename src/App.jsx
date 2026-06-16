import { useState } from "react";
import "./App.css";

// Importando a sua tela
import AnaliseIA from "./AnaliseIA";

// Ícones do menu e cabeçalho
import {
  FiBell,
  FiHome,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";

function App() {
  const [menuFechado, setMenuFechado] = useState(false);
  const [telaAtual, setTelaAtual] = useState("analise"); // Inicia direto na sua tela

  return (
    <div className="page-container">
      
      {/* =========================================
          MENU LATERAL
          ========================================= */}
      <aside className={`sidebar ${menuFechado ? "collapsed" : ""}`}>
        <div>
          <div className="logo">
            <div className="logo-icon">
              <FiUsers />
            </div>
            {!menuFechado && <h2>Copilot Médico</h2>}
          </div>

          <nav>
            <ul>
              <li 
                className={telaAtual === "dashboard" ? "active" : ""}
                onClick={() => setTelaAtual("dashboard")}
              >
                <FiHome />
                {!menuFechado && "Dashboard"}
              </li>

              <li 
                className={telaAtual === "pacientes" ? "active" : ""}
                onClick={() => setTelaAtual("pacientes")}
              >
                <FiUsers />
                {!menuFechado && "Pacientes"}
              </li>

              <li>
                <FiCalendar />
                {!menuFechado && "Agendamentos"}
              </li>

              <li 
                className={telaAtual === "analise" ? "active" : ""}
                onClick={() => setTelaAtual("analise")}
              >
                <BsClockHistory />
                {!menuFechado && "Análise com IA"}
              </li>

              <li>
                <FiClipboard />
                {!menuFechado && "Atendimentos"}
              </li>

              <li>
                <FiFolder />
                {!menuFechado && "Prontuários"}
              </li>

              <li>
                <FiBarChart2 />
                {!menuFechado && "Relatórios"}
              </li>

              <li>
                <FiSettings />
                {!menuFechado && "Configurações"}
              </li>
            </ul>
          </nav>
        </div>

        <button
          className="recolher-menu"
          onClick={() => setMenuFechado(!menuFechado)}
        >
          <span>{menuFechado ? ">" : "<"}</span>
          {!menuFechado && "Recolher menu"}
        </button>
      </aside>

      {/* =========================================
          CONTEÚDO PRINCIPAL (CABEÇALHO + LAUDO)
          ========================================= */}
      <main className="content">
        
        {/* Cabeçalho do Dr. Rafael */}
        <div className="top-header">
          <div>
            <h1>{telaAtual === "analise" ? "Análise com IA" : "Pacientes"}</h1>
            <p>
              {telaAtual === "analise" 
                ? "Visualize os resultados laboratoriais e insights da IA." 
                : "Consulte e gerencie as informações dos pacientes."}
            </p>
          </div>

          <div className="user-area">
            <div className="notification-box">
              <FiBell size={20} />
              <span className="notification-badge">3</span>
            </div>
            <div>
              <strong>Dr. Rafael Menezes</strong>
              <p>Clínica Exemplo</p>
            </div>
          </div>
        </div>

        {/* Caminho da página */}
        <div className="breadcrumb">
          Home &gt; {telaAtual === "analise" ? "Análise com IA" : "Pacientes"}
        </div>

        {/* Área onde a sua tela de IA é renderizada */}
        <div className="conteudo-dinamico">
          {telaAtual === "analise" && <AnaliseIA />}
        </div>

      </main>
    </div>
  );
}

export default App;