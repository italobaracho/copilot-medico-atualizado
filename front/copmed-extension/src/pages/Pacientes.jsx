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

function Pacientes({ setPaginaAtual }) {
  const [menuFechado, setMenuFechado] = useState(false);
  const [tipoBusca, setTipoBusca] = useState("CPF");
  const [termoBusca, setTermoBusca] = useState("");
  const [buscou, setBuscou] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacienteEditando, setPacienteEditando] = useState(null);

  const [pacientes, setPacientes] = useState([
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
  ]);

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
    setPacienteSelecionado(null);
    setPacienteEditando(null);
  }

  function limparBusca() {
    setTermoBusca("");
    setTipoBusca("CPF");
    setBuscou(false);
    setPacienteSelecionado(null);
    setPacienteEditando(null);
  }

  function visualizarPaciente(paciente) {
    setPacienteSelecionado(paciente);
    setPacienteEditando(null);
  }

  function editarPaciente(paciente) {
    setPacienteEditando({ ...paciente });
    setPacienteSelecionado(null);
  }

  function salvarEdicao() {
    if (!pacienteEditando.nome || !pacienteEditando.genero) {
      alert("Preencha nome e gênero antes de salvar.");
      return;
    }

    setPacientes(
      pacientes.map((paciente) =>
        paciente.cpf === pacienteEditando.cpf ? pacienteEditando : paciente
      )
    );

    setPacienteEditando(null);
    setBuscou(true);
  }

  function excluirPaciente(cpf) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este paciente?"
    );

    if (!confirmar) {
      return;
    }

    setPacientes(pacientes.filter((paciente) => paciente.cpf !== cpf));
    setPacienteSelecionado(null);
    setPacienteEditando(null);
    setBuscou(true);
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
              <li onClick={() => setPaginaAtual("dashboard")}>
                <FiHome />
                {!menuFechado && "Dashboard"}
              </li>

              <li className="active" onClick={() => setPaginaAtual("pacientes")}>
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
                setPacienteSelecionado(null);
                setPacienteEditando(null);
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
                setPacienteSelecionado(null);
                setPacienteEditando(null);
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
          <button
            className="btn-novo"
            onClick={() => setPaginaAtual("novoPaciente")}
          >
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
                      <FiEye
                        title="Visualizar paciente"
                        onClick={() => visualizarPaciente(paciente)}
                      />

                      <FiEdit
                        title="Editar paciente"
                        onClick={() => editarPaciente(paciente)}
                      />

                      <FiTrash2
                        title="Excluir paciente"
                        onClick={() => excluirPaciente(paciente.cpf)}
                      />
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

        {pacienteSelecionado && (
          <div className="details-card">
            <h3>Dados do paciente</h3>

            <p>
              <strong>CPF:</strong> {pacienteSelecionado.cpf}
            </p>

            <p>
              <strong>Nome:</strong> {pacienteSelecionado.nome}
            </p>

            <p>
              <strong>Gênero:</strong> {pacienteSelecionado.genero}
            </p>

            <button
              className="btn-limpar"
              onClick={() => setPacienteSelecionado(null)}
            >
              Fechar
            </button>
          </div>
        )}

        {pacienteEditando && (
          <div className="details-card">
            <h3>Editar paciente</h3>

            <div className="form-grid">
              <div className="campo">
                <label>CPF</label>
                <input type="text" value={pacienteEditando.cpf} disabled />
              </div>

              <div className="campo">
                <label>Nome</label>
                <input
                  type="text"
                  value={pacienteEditando.nome}
                  onChange={(e) =>
                    setPacienteEditando({
                      ...pacienteEditando,
                      nome: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo">
                <label>Gênero</label>
                <select
                  value={pacienteEditando.genero}
                  onChange={(e) =>
                    setPacienteEditando({
                      ...pacienteEditando,
                      genero: e.target.value,
                    })
                  }
                >
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-limpar"
                onClick={() => setPacienteEditando(null)}
              >
                Cancelar
              </button>

              <button className="btn-pesquisar" onClick={salvarEdicao}>
                Salvar alterações
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Pacientes;