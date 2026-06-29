import {
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiTrendingUp,
} from "react-icons/fi";

import { BsClockHistory } from "react-icons/bs";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

function Dashboard({ setPaginaAtual, usuarioLogado }) {
  const nomeUsuario = usuarioLogado?.nome || "Usuário";

  const pacientes = [
    { id: 1, nome: "Maria Silva", ativo: true, novoMes: true },
    { id: 2, nome: "João Oliveira", ativo: true, novoMes: true },
    { id: 3, nome: "Ana Costa", ativo: true, novoMes: false },
    { id: 4, nome: "Pedro Carvalho", ativo: true, novoMes: false },
    { id: 5, nome: "Larissa Santos", ativo: true, novoMes: false },
    { id: 6, nome: "Carlos Mendes", ativo: false, novoMes: false },
  ];

  const consultas = [
    {
      id: 1,
      horario: "08:00",
      paciente: "Maria Silva",
      tipo: "Retorno",
      especialidade: "Cardiologia",
      status: "Confirmado",
      hoje: true,
    },
    {
      id: 2,
      horario: "09:30",
      paciente: "João Oliveira",
      tipo: "Consulta",
      especialidade: "Clínica Geral",
      status: "Confirmado",
      hoje: true,
    },
    {
      id: 3,
      horario: "11:00",
      paciente: "Ana Costa",
      tipo: "Retorno",
      especialidade: "Endocrinologia",
      status: "Em andamento",
      hoje: true,
    },
  ];

  const atendimentos = [
    { id: 1, especialidade: "Clínica Geral" },
    { id: 2, especialidade: "Clínica Geral" },
    { id: 3, especialidade: "Cardiologia" },
    { id: 4, especialidade: "Endocrinologia" },
  ];

  const analisesIA = [
    { id: 1, paciente: "Maria Silva" },
    { id: 2, paciente: "João Oliveira" },
    { id: 3, paciente: "Ana Costa" },
  ];

  const atividades = [
    {
      id: 1,
      titulo: "Análise com IA concluída",
      paciente: "Maria Silva",
      horario: "10:15",
      icone: "ia",
    },
    {
      id: 2,
      titulo: "Atendimento registrado",
      paciente: "João Oliveira",
      horario: "09:45",
      icone: "atendimento",
    },
    {
      id: 3,
      titulo: "Prontuário atualizado",
      paciente: "Ana Costa",
      horario: "09:20",
      icone: "prontuario",
    },
  ];

  const notificacoes = atividades.map((atividade) => ({
    id: atividade.id,
    titulo: atividade.titulo,
    descricao: `Paciente: ${atividade.paciente}`,
    data: atividade.horario,
  }));

  const consultasHoje = consultas.filter((consulta) => consulta.hoje);

  const consultasConfirmadas = consultasHoje.filter(
    (consulta) => consulta.status === "Confirmado"
  );

  const consultasEmAndamento = consultasHoje.filter(
    (consulta) => consulta.status === "Em andamento"
  );

  const pacientesAtivos = pacientes.filter((paciente) => paciente.ativo);
  const pacientesNovosMes = pacientes.filter((paciente) => paciente.novoMes);

  const resumoAtendimentos = atendimentos.reduce((resumo, atendimento) => {
    resumo[atendimento.especialidade] =
      (resumo[atendimento.especialidade] || 0) + 1;

    return resumo;
  }, {});

  const totalAtendimentos = atendimentos.length;

  function buscarIconeAtividade(tipo) {
    if (tipo === "ia") return <FiTrendingUp />;
    if (tipo === "atendimento") return <FiClipboard />;
    return <FiFolder />;
  }

  return (
    <div className="page-container">
      <Sidebar paginaAtual="dashboard" setPaginaAtual={setPaginaAtual} />

      <main className="content">
        <TopHeader
          titulo={`Olá, ${nomeUsuario} 👋`}
          descricao="Aqui está um resumo do que acontece na sua clínica hoje."
          usuarioLogado={usuarioLogado}
          notificacoes={notificacoes}
        />

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <FiCalendar className="card-icon blue" />
            <p>Consultas hoje</p>
            <h2>{consultasHoje.length}</h2>
            <span>
              {consultasConfirmadas.length} confirmadas •{" "}
              {consultasEmAndamento.length} em andamento
            </span>
          </div>

          <div className="dashboard-card">
            <FiUsers className="card-icon green" />
            <p>Pacientes ativos</p>
            <h2>{pacientesAtivos.length}</h2>
            <span>+{pacientesNovosMes.length} novos este mês</span>
          </div>

          <div className="dashboard-card">
            <FiClipboard className="card-icon purple" />
            <p>Atendimentos este mês</p>
            <h2>{totalAtendimentos}</h2>
            <span>Calculado a partir dos registros</span>
          </div>

          <div className="dashboard-card">
            <BsClockHistory className="card-icon yellow" />
            <p>Análises com IA</p>
            <h2>{analisesIA.length}</h2>
            <span>{analisesIA.length} análises concluídas</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-box">
            <h3>Agenda de hoje</h3>

            {consultasHoje.map((consulta) => (
              <div className="agenda-item" key={consulta.id}>
                <strong>{consulta.horario}</strong>

                <div>
                  <h4>{consulta.paciente}</h4>
                  <p>
                    {consulta.tipo} • {consulta.especialidade}
                  </p>
                </div>

                <span
                  className={`status ${
                    consulta.status === "Confirmado"
                      ? "confirmado"
                      : "andamento"
                  }`}
                >
                  {consulta.status}
                </span>
              </div>
            ))}
          </section>

          <section className="dashboard-box">
            <h3>Atividades recentes</h3>

            {atividades.map((atividade) => (
              <div className="atividade-item" key={atividade.id}>
                {buscarIconeAtividade(atividade.icone)}

                <div>
                  <h4>{atividade.titulo}</h4>
                  <p>Paciente: {atividade.paciente}</p>
                </div>

                <span>{atividade.horario}</span>
              </div>
            ))}
          </section>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-box">
            <h3>Resumo de atendimentos</h3>

            <div className="resumo-atendimentos">
              <div className="circle-total">
                {totalAtendimentos}
                <br />
                <span>total</span>
              </div>

              <ul>
                {Object.entries(resumoAtendimentos).map(
                  ([especialidade, quantidade]) => (
                    <li key={especialidade}>
                      {especialidade} — {quantidade}
                    </li>
                  )
                )}
              </ul>
            </div>
          </section>

          <section className="dashboard-box">
            <h3>Insights com IA</h3>

            <div className="insight-card">
              <h4>
                {pacientesNovosMes.length > 0
                  ? `Você recebeu ${pacientesNovosMes.length} novos pacientes este mês.`
                  : "Nenhum novo paciente registrado este mês."}
              </h4>

              <p>
                O painel está calculando os dados com base nos registros
                cadastrados no código.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;