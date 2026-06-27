import { useState } from "react";

import { FiBell, FiArrowLeft, FiSave } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

function NovoPaciente({ setPaginaAtual }) {
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
      <Sidebar paginaAtual="pacientes" setPaginaAtual={setPaginaAtual} />

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
              Paciente cadastrado com sucesso!
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
                  placeholder="Digite observações importantes"
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