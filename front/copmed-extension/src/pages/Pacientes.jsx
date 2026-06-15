import { useState } from "react";

import {
  FiSearch,
  FiBell,
  FiEdit,
  FiEye,
  FiTrash2,
  FiHome,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

import { BsClockHistory } from "react-icons/bs";

function Pacientes() {
  const [menuFechado, setMenuFechado] = useState(false);

  return (
    <div className="page-container">
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
              <li>
                <FiHome />
                {!menuFechado && "Dashboard"}
              </li>

              <li className="active">
                <FiUsers />
                {!menuFechado && "Pacientes"}
              </li>

              <li>
                <FiCalendar />
                {!menuFechado && "Agendamentos"}
              </li>

              <li>
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

      <main className="content">
        <div className="top-header">
          <div>
            <h1>Pacientes</h1>
            <p>Consulte e gerencie as informações dos pacientes.</p>
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

        <div className="breadcrumb">
          Home &gt; Pacientes
        </div>

        <div className="search-card">
          <div className="campo">
            <label>Buscar por</label>

            <select>
              <option>CPF</option>
            </select>
          </div>

          <div className="campo flex">
            <label>Buscar paciente</label>

            <input
              type="text"
              placeholder="Digite o nome ou CPF"
            />
          </div>

          <button className="btn-pesquisar">
            <FiSearch />
            Pesquisar
          </button>

          <button className="btn-limpar">
            Limpar
          </button>
        </div>

        <div className="novo-paciente-container">
          <button className="btn-novo">
            + Novo paciente
          </button>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Gênero</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>123.456.789-00</td>
                <td>Maria Silva</td>
                <td>Feminino</td>

                <td className="acoes">
                  <FiEye title="Visualizar paciente" />
                  <FiEdit title="Editar paciente" />
                  <FiTrash2 title="Excluir paciente" />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pagination">
            <span>1 - 1 de 1 resultados</span>

            <div>
              <span>10 por página</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Pacientes;