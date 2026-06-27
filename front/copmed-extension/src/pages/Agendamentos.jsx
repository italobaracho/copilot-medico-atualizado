import { useState } from "react";

import {
  FiBell,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiSettings,
  FiX,
  FiSave,
  FiTrash2,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";

function Agendamentos({ setPaginaAtual }) {
  const [visualizacao, setVisualizacao] = useState("Semana");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfigAgenda, setMostrarConfigAgenda] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const pacientesCadastrados = [
    { cpf: "123.456.789-00", nome: "Maria Silva" },
    { cpf: "987.654.321-00", nome: "João Santos" },
    { cpf: "111.222.333-44", nome: "Ana Beatriz" },
  ];

  const [configAgenda, setConfigAgenda] = useState({
    inicio: "07:00",
    fim: "18:00",
    duracaoConsulta: "45",
    intervaloPadrao: "15",
    diasAtendimento: ["Seg", "Ter", "Qua", "Qui", "Sex"],
  });

  const [novoAgendamento, setNovoAgendamento] = useState({
    dia: 14,
    hora: "08:00",
    fim: "08:45",
    paciente: "",
    tipo: "Consulta",
  });

  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      dia: 12,
      hora: "08:00",
      fim: "08:45",
      paciente: "Maria Silva",
      tipo: "Consulta",
    },
    {
      id: 2,
      dia: 13,
      hora: "09:00",
      fim: "09:45",
      paciente: "João Santos",
      tipo: "Retorno",
    },
    {
      id: 3,
      dia: 14,
      hora: "10:00",
      fim: "10:45",
      paciente: "Ana Beatriz",
      tipo: "Consulta",
    },
    {
      id: 4,
      dia: 14,
      hora: "13:00",
      fim: "14:00",
      paciente: "Intervalo",
      tipo: "Intervalo",
    },
  ]);

  const horarios = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const diasBase = [
    { dia: "Seg", numero: 12 },
    { dia: "Ter", numero: 13 },
    { dia: "Qua", numero: 14 },
    { dia: "Qui", numero: 15 },
    { dia: "Sex", numero: 16 },
    { dia: "Sáb", numero: 17 },
    { dia: "Dom", numero: 18 },
  ];

  const diasSemana = diasBase.map((dia) => ({
    ...dia,
    numero: dia.numero + semanaOffset * 7,
  }));

  const primeiroDia = diasSemana[0].numero;
  const ultimoDia = diasSemana[6].numero;
  const diaAtual = 14 + semanaOffset * 7;

  const agendamentosDaSemana = agendamentos.filter(
    (item) => item.dia >= primeiroDia && item.dia <= ultimoDia
  );

  const agendamentosFiltrados =
    tipoFiltro === "Todos"
      ? agendamentosDaSemana
      : agendamentosDaSemana.filter((item) => item.tipo === tipoFiltro);

  const agendamentosDoDia = agendamentosFiltrados.filter(
    (item) => item.dia === diaAtual
  );

  const totalConsultas = agendamentosDaSemana.filter(
    (item) => item.tipo === "Consulta"
  ).length;

  const totalRetornos = agendamentosDaSemana.filter(
    (item) => item.tipo === "Retorno"
  ).length;

  const totalIntervalos = agendamentosDaSemana.filter(
    (item) => item.tipo === "Intervalo"
  ).length;

  function buscarAgendamento(dia, hora) {
    return agendamentosFiltrados.find(
      (item) => item.dia === dia && item.hora === hora
    );
  }

  function classePorTipo(tipo) {
    if (tipo === "Consulta") return "consulta";
    if (tipo === "Retorno") return "retorno";
    return "intervalo";
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setNovoAgendamento({
      ...novoAgendamento,
      [name]: name === "dia" ? Number(value) : value,
    });
  }

  function atualizarConfig(evento) {
    const { name, value } = evento.target;

    setConfigAgenda({
      ...configAgenda,
      [name]: value,
    });
  }

  function alternarDiaAtendimento(dia) {
    const jaExiste = configAgenda.diasAtendimento.includes(dia);

    setConfigAgenda({
      ...configAgenda,
      diasAtendimento: jaExiste
        ? configAgenda.diasAtendimento.filter((item) => item !== dia)
        : [...configAgenda.diasAtendimento, dia],
    });
  }

  function salvarConfiguracaoAgenda(evento) {
    evento.preventDefault();

    if (!configAgenda.inicio || !configAgenda.fim) {
      alert("Informe o horário inicial e final da agenda.");
      return;
    }

    if (configAgenda.diasAtendimento.length === 0) {
      alert("Selecione pelo menos um dia de atendimento.");
      return;
    }

    setMostrarConfigAgenda(false);
    alert("Configuração da agenda salva com sucesso.");
  }

  function salvarAgendamento(evento) {
    evento.preventDefault();

    if (!novoAgendamento.paciente) {
      alert("Selecione um paciente cadastrado.");
      return;
    }

    const pacienteExiste = pacientesCadastrados.some(
      (paciente) => paciente.nome === novoAgendamento.paciente
    );

    if (!pacienteExiste && novoAgendamento.tipo !== "Intervalo") {
      alert("Paciente não encontrado na lista de pacientes cadastrados.");
      return;
    }

    const horarioOcupado = agendamentos.some(
      (item) =>
        item.dia === novoAgendamento.dia && item.hora === novoAgendamento.hora
    );

    if (horarioOcupado) {
      alert("Já existe um agendamento nesse dia e horário.");
      return;
    }

    setAgendamentos([
      ...agendamentos,
      {
        id: Date.now(),
        ...novoAgendamento,
      },
    ]);

    setNovoAgendamento({
      dia: 14 + semanaOffset * 7,
      hora: "08:00",
      fim: "08:45",
      paciente: "",
      tipo: "Consulta",
    });

    setMostrarFormulario(false);
  }

  function excluirAgendamento(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este agendamento?"
    );

    if (!confirmar) return;

    setAgendamentos(agendamentos.filter((item) => item.id !== id));
  }

  return (
    <div className="page-container">
      <Sidebar paginaAtual="agendamentos" setPaginaAtual={setPaginaAtual} />

      <main className="content">
        <div className="top-header">
          <div>
            <h1>Agendamentos</h1>
            <p>Visualize e gerencie sua agenda de consultas.</p>
          </div>

          <div className="user-area">
            <div className="notification-box">
              <FiBell size={20} />
              <span className="notification-badge">
                {agendamentosDaSemana.length}
              </span>
            </div>

            <div>
              <strong>Dr. Rafael Menezes</strong>
              <p>Clínica Exemplo</p>
            </div>
          </div>
        </div>

        <div className="breadcrumb">Home &gt; Agendamentos</div>

        <div className="novo-paciente-container">
          <button
            className="btn-novo"
            onClick={() => setMostrarFormulario(true)}
          >
            <FiPlus />
            Novo agendamento
          </button>
        </div>

        {mostrarFormulario && (
          <div className="form-card agenda-form-card">
            <div className="form-header">
              <h3>Novo agendamento</h3>

              <button
                className="btn-fechar-form"
                onClick={() => setMostrarFormulario(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={salvarAgendamento}>
              <div className="form-grid">
                <div className="campo">
                  <label>Paciente *</label>
                  <select
                    name="paciente"
                    value={novoAgendamento.paciente}
                    onChange={atualizarCampo}
                  >
                    <option value="">Selecione um paciente cadastrado</option>

                    {pacientesCadastrados.map((paciente) => (
                      <option key={paciente.cpf} value={paciente.nome}>
                        {paciente.nome} - {paciente.cpf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Tipo</label>
                  <select
                    name="tipo"
                    value={novoAgendamento.tipo}
                    onChange={atualizarCampo}
                  >
                    <option value="Consulta">Consulta</option>
                    <option value="Retorno">Retorno</option>
                  </select>
                </div>

                <div className="campo">
                  <label>Dia</label>
                  <select
                    name="dia"
                    value={novoAgendamento.dia}
                    onChange={atualizarCampo}
                  >
                    {diasSemana.map((dia) => (
                      <option key={dia.numero} value={dia.numero}>
                        {dia.dia} {dia.numero}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Horário inicial</label>
                  <select
                    name="hora"
                    value={novoAgendamento.hora}
                    onChange={atualizarCampo}
                  >
                    {horarios.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Horário final</label>
                  <input
                    type="time"
                    name="fim"
                    value={novoAgendamento.fim}
                    onChange={atualizarCampo}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-limpar"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-pesquisar">
                  <FiSave />
                  Salvar agendamento
                </button>
              </div>
            </form>
          </div>
        )}

        <section className="agenda-card">
          <div className="agenda-toolbar">
            <div className="agenda-toolbar-left">
              <button className="agenda-btn" onClick={() => setSemanaOffset(0)}>
                Hoje
              </button>

              <button
                className="agenda-icon-btn"
                onClick={() => setSemanaOffset(semanaOffset - 1)}
              >
                <FiChevronLeft />
              </button>

              <button
                className="agenda-icon-btn"
                onClick={() => setSemanaOffset(semanaOffset + 1)}
              >
                <FiChevronRight />
              </button>

              <button className="agenda-icon-btn">
                <FiCalendar />
              </button>

              <h3>
                {visualizacao === "Dia"
                  ? `Dia ${diaAtual} de maio de 2025`
                  : `${primeiroDia} – ${ultimoDia} de maio de 2025`}
              </h3>
            </div>

            <div className="agenda-toolbar-right">
              <div className="view-toggle">
                {["Dia", "Semana", "Mês"].map((item) => (
                  <button
                    key={item}
                    className={visualizacao === item ? "active" : ""}
                    onClick={() => setVisualizacao(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <select
                className="agenda-filter"
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Consulta">Consultas</option>
                <option value="Retorno">Retornos</option>
                <option value="Intervalo">Intervalos</option>
              </select>

              <button
                className="agenda-btn"
                onClick={() => setMostrarFiltros(true)}
              >
                <FiFilter />
                Filtros
              </button>
            </div>
          </div>

          {visualizacao === "Semana" && (
            <div className="calendar-grid">
              <div className="timezone">GMT-03</div>

              {diasSemana.map((dia) => (
                <div
                  key={dia.numero}
                  className={`day-header ${dia.numero === 14 ? "today" : ""}`}
                >
                  <span>{dia.dia}</span>
                  <strong>{dia.numero}</strong>
                </div>
              ))}

              {horarios.map((hora) => (
                <div className="calendar-row" key={hora}>
                  <div className="hour-cell">{hora}</div>

                  {diasSemana.map((dia) => {
                    const agendamento = buscarAgendamento(dia.numero, hora);

                    return (
                      <div
                        className={`calendar-cell ${
                          dia.numero === 14 ? "today-column" : ""
                        }`}
                        key={`${dia.numero}-${hora}`}
                      >
                        {agendamento && (
                          <div
                            className={`appointment ${classePorTipo(
                              agendamento.tipo
                            )}`}
                          >
                            <button
                              className="delete-appointment"
                              onClick={() => excluirAgendamento(agendamento.id)}
                              title="Excluir agendamento"
                            >
                              <FiTrash2 />
                            </button>

                            <span>
                              {agendamento.hora} – {agendamento.fim}
                            </span>

                            <strong>{agendamento.paciente}</strong>
                            <p>{agendamento.tipo}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {visualizacao === "Dia" && (
            <div className="day-view">
              {horarios.map((hora) => {
                const agendamento = agendamentosDoDia.find(
                  (item) => item.hora === hora
                );

                return (
                  <div className="day-view-row" key={hora}>
                    <div className="day-view-hour">{hora}</div>

                    <div className="day-view-content">
                      {agendamento ? (
                        <div
                          className={`appointment day-appointment ${classePorTipo(
                            agendamento.tipo
                          )}`}
                        >
                          <button
                            className="delete-appointment"
                            onClick={() => excluirAgendamento(agendamento.id)}
                            title="Excluir agendamento"
                          >
                            <FiTrash2 />
                          </button>

                          <span>
                            {agendamento.hora} – {agendamento.fim}
                          </span>

                          <strong>{agendamento.paciente}</strong>
                          <p>{agendamento.tipo}</p>
                        </div>
                      ) : (
                        <span className="horario-livre">Horário livre</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {visualizacao === "Mês" && (
            <div className="month-view">
              {Array.from({ length: 31 }, (_, index) => index + 1).map((dia) => {
                const agendamentosDoMesDia = agendamentosFiltrados.filter(
                  (item) => item.dia === dia
                );

                return (
                  <div
                    className={`month-day ${dia === 14 ? "month-today" : ""}`}
                    key={dia}
                  >
                    <strong>{dia}</strong>

                    {agendamentosDoMesDia.length > 0 ? (
                      agendamentosDoMesDia.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className={`month-event ${classePorTipo(item.tipo)}`}
                        >
                          {item.hora} {item.paciente}
                        </span>
                      ))
                    ) : (
                      <p>Sem agenda</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="agenda-footer">
            <div className="agenda-stats">
              <span className="stat consulta-stat">
                {totalConsultas} Consultas
              </span>

              <span className="stat retorno-stat">
                {totalRetornos} Retornos
              </span>

              <span className="stat intervalo-stat">
                {totalIntervalos} Intervalos
              </span>
            </div>

            <button
              className="config-agenda"
              onClick={() => setMostrarConfigAgenda(true)}
            >
              <FiSettings />
              Configurar agenda
            </button>
          </div>
        </section>

        {mostrarFiltros && (
          <div className="modal-overlay">
            <div className="modal-card modal-menor">
              <div className="modal-header">
                <div>
                  <h3>Filtros</h3>
                  <p>Escolha quais tipos de agendamento deseja visualizar.</p>
                </div>

                <button
                  className="btn-fechar-form"
                  onClick={() => setMostrarFiltros(false)}
                >
                  <FiX />
                </button>
              </div>

              <div className="filtro-opcoes">
                {["Todos", "Consulta", "Retorno", "Intervalo"].map((tipo) => (
                  <button
                    key={tipo}
                    className={
                      tipoFiltro === tipo ? "filtro-opcao ativo" : "filtro-opcao"
                    }
                    onClick={() => setTipoFiltro(tipo)}
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              <div className="form-actions">
                <button
                  className="btn-pesquisar"
                  onClick={() => setMostrarFiltros(false)}
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarConfigAgenda && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>Configurar agenda</h3>
                  <p>Defina os horários e dias de atendimento do médico.</p>
                </div>

                <button
                  className="btn-fechar-form"
                  onClick={() => setMostrarConfigAgenda(false)}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={salvarConfiguracaoAgenda}>
                <div className="form-grid">
                  <div className="campo">
                    <label>Horário inicial</label>
                    <input
                      type="time"
                      name="inicio"
                      value={configAgenda.inicio}
                      onChange={atualizarConfig}
                    />
                  </div>

                  <div className="campo">
                    <label>Horário final</label>
                    <input
                      type="time"
                      name="fim"
                      value={configAgenda.fim}
                      onChange={atualizarConfig}
                    />
                  </div>

                  <div className="campo">
                    <label>Duração da consulta</label>
                    <select
                      name="duracaoConsulta"
                      value={configAgenda.duracaoConsulta}
                      onChange={atualizarConfig}
                    >
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">60 minutos</option>
                    </select>
                  </div>

                  <div className="campo">
                    <label>Intervalo padrão</label>
                    <select
                      name="intervaloPadrao"
                      value={configAgenda.intervaloPadrao}
                      onChange={atualizarConfig}
                    >
                      <option value="0">Sem intervalo</option>
                      <option value="10">10 minutos</option>
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                    </select>
                  </div>
                </div>

                <div className="dias-config">
                  <label>Dias de atendimento</label>

                  <div className="dias-opcoes">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                      (dia) => (
                        <button
                          type="button"
                          key={dia}
                          className={
                            configAgenda.diasAtendimento.includes(dia)
                              ? "dia-opcao ativo"
                              : "dia-opcao"
                          }
                          onClick={() => alternarDiaAtendimento(dia)}
                        >
                          {dia}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="modal-resumo">
                  <strong>Resumo:</strong> atendimento de {configAgenda.inicio}{" "}
                  até {configAgenda.fim}, com consultas de{" "}
                  {configAgenda.duracaoConsulta} minutos.
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-limpar"
                    onClick={() => setMostrarConfigAgenda(false)}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn-pesquisar">
                    <FiSave />
                    Salvar configuração
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Agendamentos;