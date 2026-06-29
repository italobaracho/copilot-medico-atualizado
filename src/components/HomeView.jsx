import {
  Calendar, Users, ClipboardList, Sparkles, Clock,
  FolderClosed, BarChart3, TrendingUp, ChevronRight
} from 'lucide-react';
import theme from '../theme';

// ============================================================
// DASHBOARD (tela inicial do médico) - imagens 2 e 3
// ------------------------------------------------------------
// OBS PARA O TIME: os números, agenda, atividades e insights
// abaixo são DADOS DE DEMONSTRAÇÃO (mock). Quando o backend
// expuser os endpoints (/api/dashboard/...), basta trocar estas
// constantes por dados vindos de fetch. Os pontos a ligar estão
// marcados com  // TODO BACKEND.
// ============================================================

// TODO BACKEND: substituir por GET /api/dashboard/stats
// "target" = para qual tela o card navega ao ser clicado.
const stats = [
  { label: 'Consultas hoje',       value: '12',  sub: '4 confirmadas · 2 em andamento', icon: Calendar,      color: theme.colors.primary, bg: theme.colors.primarySoft, target: 'agendamentos' },
  { label: 'Pacientes ativos',     value: '842', sub: '+18 novos este mês',             icon: Users,         color: '#15803d',            bg: '#f0fdf4', target: 'pacientes' },
  { label: 'Atendimentos este mês', value: '156', sub: '+12% vs mês anterior',          icon: ClipboardList, color: '#7e22ce',            bg: '#faf5ff', target: 'pacientes' },
  { label: 'Análises com IA',      value: '48',  sub: '+30% vs mês anterior',           icon: Sparkles,      color: '#c2410c',            bg: '#fff7ed', target: 'analise-ia' },
];

// TODO BACKEND: substituir por GET /api/agenda?date=hoje
const agenda = [
  { hora: '08:00', nome: 'Maria Silva',    tipo: 'Retorno · Cardiologia',    status: 'Confirmado',   iniciais: 'MS' },
  { hora: '09:30', nome: 'João Oliveira',  tipo: 'Consulta · Clínica Geral', status: 'Confirmado',   iniciais: 'JO' },
  { hora: '11:00', nome: 'Ana Costa',      tipo: 'Retorno · Endocrinologia', status: 'Em andamento', iniciais: 'AC' },
  { hora: '14:00', nome: 'Pedro Carvalho', tipo: 'Consulta · Ortopedia',     status: 'Confirmado',   iniciais: 'PC' },
  { hora: '15:30', nome: 'Larissa Santos', tipo: 'Retorno · Dermatologia',   status: 'Confirmado',   iniciais: 'LS' },
];

// TODO BACKEND: substituir por GET /api/atividades/recentes
const atividades = [
  { titulo: 'Análise com IA concluída', sub: 'Paciente: Maria Silva',   hora: '10:15',       icon: Sparkles,      color: '#7e22ce' },
  { titulo: 'Atendimento registrado',   sub: 'Paciente: João Oliveira', hora: '09:45',       icon: ClipboardList, color: theme.colors.primary },
  { titulo: 'Prontuário atualizado',    sub: 'Paciente: Ana Costa',     hora: '09:20',       icon: FolderClosed,  color: '#0891b2' },
  { titulo: 'Novo agendamento',         sub: 'Paciente: Pedro Carvalho', hora: 'Ontem, 16:30', icon: Calendar,    color: '#dc2626' },
  { titulo: 'Relatório gerado',         sub: 'Resumo de atendimentos - Abril/2025', hora: 'Ontem, 14:10', icon: BarChart3, color: '#15803d' },
];

// TODO BACKEND: substituir por GET /api/atendimentos/resumo
const resumo = [
  { label: 'Clínica Geral',   qtd: 62, pct: 40, color: theme.colors.primary },
  { label: 'Cardiologia',     qtd: 38, pct: 24, color: '#22c55e' },
  { label: 'Endocrinologia',  qtd: 28, pct: 18, color: '#f59e0b' },
  { label: 'Outros',          qtd: 28, pct: 18, color: '#a78bfa' },
];

const statusColors = {
  'Confirmado':   { bg: '#dcfce7', color: '#15803d' },
  'Em andamento': { bg: theme.colors.primarySoft, color: theme.colors.primary },
};

export default function HomeView({ user, onViewChange }) {
  const nome = user?.name || 'Dr. Rafael Menezes';

  // Monta o gradiente cônico do donut a partir das porcentagens
  let acc = 0;
  const segments = resumo.map((r) => {
    const start = acc;
    acc += r.pct;
    return `${r.color} ${start}% ${acc}%`;
  });
  const donutGradient = `conic-gradient(${segments.join(', ')})`;

  return (
    <div style={styles.container}>
      {/* Saudação */}
      <div style={styles.header}>
        <h1 style={styles.title}>Olá, {nome} 👋</h1>
        <p style={styles.subtitle}>Aqui está um resumo do que acontece na sua clínica hoje.</p>
      </div>

      {/* Cards de métricas */}
      <div style={styles.statsGrid}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{ ...styles.statCard, cursor: 'pointer' }}
              onClick={() => onViewChange && onViewChange(s.target)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = theme.shadow.cardHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = theme.shadow.card; }}
            >
              <div style={{ ...styles.statIcon, backgroundColor: s.bg }}>
                <Icon size={22} color={s.color} />
              </div>
              <p style={styles.statLabel}>{s.label}</p>
              <h3 style={styles.statValue}>{s.value}</h3>
              <p style={styles.statSub}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Agenda + Atividades */}
      <div style={styles.twoCol}>
        {/* Agenda de hoje */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitleRow}>
              <Calendar size={18} color={theme.colors.primary} />
              <h3 style={styles.panelTitle}>Agenda de hoje</h3>
            </div>
            <button style={styles.linkBtn} onClick={() => onViewChange && onViewChange('agendamentos')}>
              Ver agenda completa <ChevronRight size={14} />
            </button>
          </div>

          <div style={styles.list}>
            {agenda.map((a, i) => {
              const st = statusColors[a.status] || statusColors['Confirmado'];
              return (
                <div key={i} style={styles.agendaRow}>
                  <span style={styles.agendaHora}>{a.hora}</span>
                  <div style={styles.agendaAvatar}>{a.iniciais}</div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={styles.agendaNome}>{a.nome}</p>
                    <p style={styles.agendaTipo}>{a.tipo}</p>
                  </div>
                  <span style={{ ...styles.statusTag, backgroundColor: st.bg, color: st.color }}>{a.status}</span>
                </div>
              );
            })}
          </div>
          <button style={styles.footerLink} onClick={() => onViewChange && onViewChange('agendamentos')}>
            Ver todos os agendamentos
          </button>
        </div>

        {/* Atividades recentes */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitleRow}>
              <Clock size={18} color={theme.colors.primary} />
              <h3 style={styles.panelTitle}>Atividades recentes</h3>
            </div>
          </div>

          <div style={styles.list}>
            {atividades.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} style={styles.atividadeRow}>
                  <div style={{ ...styles.atividadeIcon, backgroundColor: '#f1f5f9' }}>
                    <Icon size={16} color={a.color} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={styles.agendaNome}>{a.titulo}</p>
                    <p style={styles.agendaTipo}>{a.sub}</p>
                  </div>
                  <span style={styles.atividadeHora}>{a.hora}</span>
                </div>
              );
            })}
          </div>
          <button style={styles.footerLink}>Ver todas as atividades</button>
        </div>
      </div>

      {/* Resumo (donut) + Insights */}
      <div style={styles.twoCol}>
        <div style={styles.panel}>
          <h3 style={{ ...styles.panelTitle, marginBottom: '20px' }}>
            Resumo de atendimentos <span style={styles.muted}>(este mês)</span>
          </h3>
          <div style={styles.donutWrap}>
            <div style={{ ...styles.donut, background: donutGradient }}>
              <div style={styles.donutHole}>
                <span style={styles.donutTotal}>156</span>
                <span style={styles.donutLabel}>total</span>
              </div>
            </div>
            <div style={styles.legend}>
              {resumo.map((r) => (
                <div key={r.label} style={styles.legendRow}>
                  <span style={{ ...styles.legendDot, backgroundColor: r.color }} />
                  <span style={styles.legendLabel}>{r.label}</span>
                  <span style={styles.legendVal}>{r.qtd} ({r.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...styles.panel, backgroundColor: theme.colors.purpleSoft, border: '1px solid #e9d5ff' }}>
          <div style={styles.panelTitleRow}>
            <Sparkles size={18} color={theme.colors.purple} />
            <h3 style={styles.panelTitle}>Insights com IA</h3>
          </div>
          <div style={styles.insightBox}>
            <p style={styles.insightStrong}>
              A taxa de retorno dos pacientes aumentou 12% em relação ao mês anterior.
            </p>
            <p style={styles.insightText}>
              Continue assim! Seu acompanhamento está gerando resultados positivos.
            </p>
            <TrendingUp size={28} color={theme.colors.purple} style={{ alignSelf: 'flex-end' }} />
          </div>
          <button style={{ ...styles.footerLink, color: theme.colors.purple }}>Ver mais insights</button>
        </div>
      </div>
    </div>
  );
}

const card = {
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.card,
};

const styles = {
  container: { fontFamily: 'system-ui, -apple-system, sans-serif' },
  header: { marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: 800, color: theme.colors.text, margin: 0 },
  subtitle: { fontSize: '14px', color: theme.colors.textMuted, margin: '6px 0 0 0' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' },
  statCard: { ...card, padding: '20px' },
  statIcon: { width: '44px', height: '44px', borderRadius: theme.radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' },
  statLabel: { fontSize: '13px', color: theme.colors.textMuted, margin: 0 },
  statValue: { fontSize: '30px', fontWeight: 800, color: theme.colors.text, margin: '4px 0' },
  statSub: { fontSize: '12px', color: theme.colors.textMuted, margin: 0 },

  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' },
  panel: { ...card, padding: '22px', display: 'flex', flexDirection: 'column' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  panelTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  panelTitle: { fontSize: '16px', fontWeight: 700, color: theme.colors.text, margin: 0 },
  muted: { fontSize: '13px', fontWeight: 400, color: theme.colors.textMuted },
  linkBtn: { display: 'flex', alignItems: 'center', gap: '2px', background: 'none', border: 'none', color: theme.colors.primary, fontSize: '13px', fontWeight: 600, cursor: 'pointer' },

  list: { display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 },
  agendaRow: { display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 8px', borderRadius: theme.radius.md },
  agendaHora: { fontSize: '13px', fontWeight: 700, color: theme.colors.primary, minWidth: '42px' },
  agendaAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: theme.colors.primarySoft, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 },
  agendaNome: { fontSize: '14px', fontWeight: 600, color: theme.colors.text, margin: 0 },
  agendaTipo: { fontSize: '12px', color: theme.colors.textMuted, margin: '2px 0 0 0' },
  statusTag: { fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: theme.radius.pill },

  atividadeRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' },
  atividadeIcon: { width: '34px', height: '34px', borderRadius: theme.radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  atividadeHora: { fontSize: '12px', color: theme.colors.textMuted, whiteSpace: 'nowrap' },

  footerLink: { marginTop: '14px', background: 'none', border: 'none', color: theme.colors.primary, fontSize: '13px', fontWeight: 600, cursor: 'pointer', alignSelf: 'center' },

  donutWrap: { display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' },
  donut: { width: '150px', height: '150px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  donutHole: { width: '96px', height: '96px', borderRadius: '50%', backgroundColor: theme.colors.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  donutTotal: { fontSize: '24px', fontWeight: 800, color: theme.colors.text },
  donutLabel: { fontSize: '12px', color: theme.colors.textMuted },
  legend: { display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 },
  legendRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  legendDot: { width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0 },
  legendLabel: { fontSize: '14px', color: '#334155', flexGrow: 1 },
  legendVal: { fontSize: '14px', fontWeight: 600, color: theme.colors.text },

  insightBox: { display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: theme.radius.md, padding: '16px', margin: '12px 0' },
  insightStrong: { fontSize: '14px', fontWeight: 700, color: theme.colors.text, margin: 0 },
  insightText: { fontSize: '13px', color: theme.colors.textMuted, margin: 0 },
};
