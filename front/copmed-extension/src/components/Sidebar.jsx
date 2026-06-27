import { useState } from "react";

import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

import { BsClockHistory } from "react-icons/bs";

function Sidebar({ paginaAtual, setPaginaAtual }) {
  const [menuFechado, setMenuFechado] = useState(false);

  const itensMenu = [
    { id: "dashboard", texto: "Dashboard", icone: <FiHome /> },
    { id: "pacientes", texto: "Pacientes", icone: <FiUsers /> },
    { id: "agendamentos", texto: "Agendamentos", icone: <FiCalendar /> },
    { id: "analiseIA", texto: "Análise com IA", icone: <BsClockHistory /> },
    { id: "atendimentos", texto: "Atendimentos", icone: <FiClipboard /> },
    { id: "prontuarios", texto: "Prontuários", icone: <FiFolder /> },
    { id: "relatorios", texto: "Relatórios", icone: <FiBarChart2 /> },
    { id: "configuracoes", texto: "Configurações", icone: <FiSettings /> },
  ];

  return (
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
            {itensMenu.map((item) => (
              <li
                key={item.id}
                className={paginaAtual === item.id ? "active" : ""}
                onClick={() => setPaginaAtual(item.id)}
              >
                {item.icone}
                {!menuFechado && item.texto}
              </li>
            ))}
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
  );
}

export default Sidebar;