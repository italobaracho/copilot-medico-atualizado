import { useState } from "react";

import {
  FiBell,
  FiHome,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiArrowLeft,
  FiSave,
} from "react-icons/fi";

import { BsClockHistory } from "react-icons/bs";

function NovoPaciente({ setPaginaAtual }) {
  const [menuFechado, setMenuFechado] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: "",
    cpf: "",
    genero: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    observacoes: "",
  });

  const [pacienteSalvo, setPacienteSalvo] = useState(false);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  function salvarPaciente(evento) {
    evento.preventDefault();

    if (!formulario.nome || !formulario.cpf || !formulario.genero) {
      alert("Preencha pelo menos nome, CPF e gênero.");
      return;
    }

    setPacienteSalvo(true);
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
            <h1>Novo paciente</h1>
            <p>Cadastre as informações principais do paciente.</p>
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
          Home &gt; Pacientes &gt; Novo paciente
        </div>

        <div className="form-card">
          <button
            type="button"
            className="btn-voltar"
            onClick={() => setPaginaAtual("pacientes")}
          >
            <FiArrowLeft />
            Voltar para pacientes
          </button>

          {pacienteSalvo && (
            <div className="alerta-sucesso">
              Paciente cadastrado com sucesso! Volte para a tela de pacientes
              para consultar a listagem.
            </div>
          )}

          <form onSubmit={salvarPaciente}>
            <div className="form-grid">
              <div className="campo">
                <label>Nome completo *</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite o nome completo"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="campo">
                <label>CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formulario.cpf}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="campo">
                <label>Gênero *</label>
                <select
                  name="genero"
                  value={formulario.genero}
                  onChange={atualizarCampo}
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="campo">
                <label>Data de nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formulario.dataNascimento}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="campo">
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formulario.telefone}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="campo">
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@exemplo.com"
                  value={formulario.email}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="campo campo-full">
                <label>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  placeholder="Rua, número, bairro, cidade"
                  value={formulario.endereco}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="campo campo-full">
                <label>Observações</label>
                <textarea
                  name="observacoes"
                  placeholder="Digite observações importantes sobre o paciente"
                  value={formulario.observacoes}
                  onChange={atualizarCampo}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-limpar"
                onClick={() => setPaginaAtual("pacientes")}
              >
                Cancelar
              </button>

              <button type="submit" className="btn-pesquisar">
                <FiSave />
                Salvar paciente
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default NovoPaciente;