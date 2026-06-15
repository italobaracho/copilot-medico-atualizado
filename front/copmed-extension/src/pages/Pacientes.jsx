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
  const [tipoBusca, setTipoBusca] = useState("CPF");
  const [termoBusca, setTermoBusca] = useState("");
  const [buscou, setBuscou] = useState(false);

  const pacientes = [
    {
      cpf: "123.456.789-00",
      nome: "Maria Silva",
      genero: "Feminino",
    },
    {
      cpf: "987.654.321-00",
      nome: "João Santos",
      genero: "Masculino",
    },
    {
      cpf: "111.222.333-44",
      nome: "Ana Beatriz",
      genero: "Feminino",
    },
  ];

  const termoNormalizado = termoBusca.trim().toLowerCase();

  const pacientesFiltrados = buscou
    ? pacientes.filter((paciente) => {
        if (tipoBusca === "CPF") {
          return paciente.cpf.toLowerCase().includes(termoNormalizado);
        }

        return paciente.nome.toLowerCase().includes(termoNormalizado);
      })
    : [];

  function pesquisarPaciente() {
    setBuscou(true);
  }

  function limparBusca() {
    setTermoBusca("");
    setTipoBusca("CPF");
    setBuscou(false);
  }

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

        <div className="breadcrumb">Home &gt; Pacientes</div>

        <div className="search-card">
          <div className="campo">
            <label>Buscar por</label>

            <select
              value={tipoBusca}
              onChange={(e) => {
                setTipoBusca(e.target.value);
                setTermoBusca("");
                setBuscou(false);
              }}
            >
              <option value="CPF">CPF</option>
              <option value="Nome">Nome</option>
            </select>
          </div>

          <div className="campo flex">
            <label>Buscar paciente</label>

            <input
              type="text"
              placeholder={
                tipoBusca === "CPF"
                  ? "Digite o CPF do paciente"
                  : "Digite o nome do paciente"
              }
              value={termoBusca}
              onChange={(e) => {
                setTermoBusca(e.target.value);
                setBuscou(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pesquisarPaciente();
                }
              }}
            />
          </div>

          <button className="btn-pesquisar" onClick={pesquisarPaciente}>
            <FiSearch />
            Pesquisar
          </button>

          <button className="btn-limpar" onClick={limparBusca}>
            Limpar
          </button>
        </div>

        <div className="novo-paciente-container">
          <button className="btn-novo">+ Novo paciente</button>
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
              {!buscou ? (
                <tr>
                  <td colSpan="4" className="sem-resultados">
                    Digite um CPF ou nome e clique em pesquisar.
                  </td>
                </tr>
              ) : pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.cpf}>
                    <td>{paciente.cpf}</td>
                    <td>{paciente.nome}</td>
                    <td>{paciente.genero}</td>

                    <td className="acoes">
                      <FiEye title="Visualizar paciente" />
                      <FiEdit title="Editar paciente" />
                      <FiTrash2 title="Excluir paciente" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="sem-resultados">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <span>
              {buscou
                ? `${pacientesFiltrados.length} resultado${
                    pacientesFiltrados.length !== 1 ? "s" : ""
                  } encontrado${pacientesFiltrados.length !== 1 ? "s" : ""}`
                : "0 resultados encontrados"}
            </span>

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