import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings, X, Calendar as CalIcon } from 'lucide-react';
import theme from '../theme';

// ============================================================
// Tela AGENDAMENTOS (imagem 2) — calendário semanal interativo
// ------------------------------------------------------------
// Navegação por semana/dia/mês, blocos posicionados pelo horário,
// e "Novo agendamento" que adiciona de verdade (estado em memória).
// OBS PARA O TIME: a persistência é em memória (some ao recarregar).
// Para salvar de verdade, criar endpoints /api/agendamentos no backend.
// ============================================================

const HOUR_START = 7;
const HOUR_END = 18;
const ROW_H = 56;
const DAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const TYPE_STYLE = {
  'Consulta':  { color: '#15803d', bg: '#dcfce7', bar: '#16a34a' },
  'Retorno':   { color: '#1d4ed8', bg: '#eff6ff', bar: '#2563eb' },
  'Intervalo': { color: '#64748b', bg: '#f1f5f9', bar: '#94a3b8' },
};

const NOMES = ['João Silva', 'Ana Clara', 'Gabriel Dias', 'Simone Oliveira', 'Renato Cardoso', 'Maria Souza', 'Roberto Martins', 'Patrícia Mendes', 'Eduardo Lima', 'Tatiana Silva', 'Carlos Lima', 'Beatriz Oliveira', 'Ricardo Nunes', 'Aline Costa', 'Paulo Henrique', 'Lucas Pereira', 'Mariana Rocha', 'Felipe Carvalho', 'Clara Bezerra', 'Rafael Gomes'];

const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = (d) => { const x = new Date(d); const dow = (x.getDay() + 6) % 7; return addDays(x, -dow); }; // segunda
const toDecimal = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h + m / 60; };
const isSameDay = (a, b) => toKey(a) === toKey(b);

// Gera agendamentos de exemplo para a semana exibida (seg-sex)
function seedWeek(monday) {
  const appts = [];
  let n = 0;
  for (let dia = 0; dia < 5; dia++) {
    const date = toKey(addDays(monday, dia));
    const horarios = [['08:00', '08:45'], ['09:00', '09:45'], ['10:00', '10:45'], ['14:00', '14:45'], ['15:00', '15:45'], ['16:00', '16:45']];
    horarios.forEach(([start, end], i) => {
      const tipo = i % 2 === 0 ? 'Consulta' : 'Retorno';
      appts.push({ id: `${date}-${start}`, date, start, end, title: NOMES[n % NOMES.length], type: tipo });
      n++;
    });
    appts.push({ id: `${date}-12`, date, start: '11:00', end: '11:45', title: 'Intervalo', type: 'Intervalo' });
  }
  return appts;
}

export default function AgendamentosView() {
  const [view, setView] = useState('Semana');
  const [ref, setRef] = useState(new Date());
  const [appts, setAppts] = useState(() => seedWeek(startOfWeek(new Date())));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: toKey(new Date()), start: '08:00', end: '08:45', title: '', type: 'Consulta' });

  const monday = useMemo(() => startOfWeek(ref), [ref]);
  const today = new Date();

  const days = view === 'Dia' ? [ref] : Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

  const visibleAppts = appts.filter((a) => days.some((d) => toKey(d) === a.date));
  const counts = {
    Consulta: visibleAppts.filter((a) => a.type === 'Consulta').length,
    Retorno: visibleAppts.filter((a) => a.type === 'Retorno').length,
    Intervalo: visibleAppts.filter((a) => a.type === 'Intervalo').length,
  };

  const rangeLabel = () => {
    if (view === 'Dia') return `${ref.getDate()} de ${MONTHS_PT[ref.getMonth()]} de ${ref.getFullYear()}`;
    const end = addDays(monday, 6);
    return `${monday.getDate()} – ${end.getDate()} de ${MONTHS_PT[end.getMonth()]} de ${end.getFullYear()}`;
  };

  const navega = (dir) => {
    if (view === 'Dia') setRef((d) => addDays(d, dir));
    else if (view === 'Mês') setRef((d) => { const x = new Date(d); x.setMonth(x.getMonth() + dir); return x; });
    else setRef((d) => addDays(d, dir * 7));
  };

  const salvarAgendamento = () => {
    if (!form.title.trim()) { alert('Informe o nome do paciente.'); return; }
    setAppts((prev) => [...prev, { ...form, id: `${form.date}-${form.start}-${Date.now()}` }]);
    setModal(false);
    setForm({ date: toKey(ref), start: '08:00', end: '08:45', title: '', type: 'Consulta' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Agendamentos</h1>
          <p style={styles.subtitle}>Visualize e gerencie sua agenda de consultas.</p>
        </div>
        <button style={styles.primaryBtn} onClick={() => { setForm((f) => ({ ...f, date: toKey(ref) })); setModal(true); }}>
          <Plus size={16} /> Novo agendamento
        </button>
      </div>
      <p style={styles.breadcrumb}><span style={{ color: theme.colors.primary, fontWeight: 600 }}>Home</span> &gt; Agendamentos</p>

      <div style={styles.card}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolLeft}>
            <button style={styles.todayBtn} onClick={() => setRef(new Date())}>Hoje</button>
            <button style={styles.navBtn} onClick={() => navega(-1)}><ChevronLeft size={16} /></button>
            <button style={styles.navBtn} onClick={() => navega(1)}><ChevronRight size={16} /></button>
            <CalIcon size={16} color={theme.colors.textMuted} />
            <span style={styles.rangeLabel}>{rangeLabel()}</span>
          </div>
          <div style={styles.toggle}>
            {['Dia', 'Semana', 'Mês'].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ ...styles.toggleBtn, ...(view === v ? styles.toggleActive : {}) }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Grade */}
        {view === 'Mês' ? (
          <MonthGrid ref_={ref} appts={appts} onPickDay={(d) => { setRef(d); setView('Dia'); }} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ ...styles.grid, gridTemplateColumns: `60px repeat(${days.length}, minmax(130px, 1fr))` }}>
              {/* Cabeçalho dos dias */}
              <div style={styles.corner} />
              {days.map((d, i) => {
                const hoje = isSameDay(d, today);
                return (
                  <div key={i} style={styles.dayHead}>
                    <span style={styles.dayName}>{DAYS_PT[(d.getDay() + 6) % 7]}</span>
                    <span style={{ ...styles.dayNum, ...(hoje ? styles.dayNumToday : {}) }}>{d.getDate()}</span>
                  </div>
                );
              })}

              {/* Coluna de horas + colunas dos dias */}
              <div style={styles.timeCol}>
                {hours.map((h) => <div key={h} style={styles.timeCell}>{String(h).padStart(2, '0')}:00</div>)}
              </div>
              {days.map((d, di) => {
                const dayAppts = appts.filter((a) => a.date === toKey(d));
                return (
                  <div key={di} style={{ ...styles.dayCol, height: `${hours.length * ROW_H}px` }}>
                    {hours.map((h) => <div key={h} style={styles.slot} />)}
                    {dayAppts.map((a) => {
                      const top = (toDecimal(a.start) - HOUR_START) * ROW_H;
                      const h = Math.max(22, (toDecimal(a.end) - toDecimal(a.start)) * ROW_H - 4);
                      const st = TYPE_STYLE[a.type] || TYPE_STYLE['Consulta'];
                      return (
                        <div key={a.id} title={`${a.start}–${a.end} ${a.title} (${a.type})`}
                          style={{ ...styles.appt, top: `${top}px`, height: `${h}px`, background: st.bg, borderLeft: `3px solid ${st.bar}` }}>
                          <span style={{ ...styles.apptTime, color: st.color }}>{a.start} – {a.end}</span>
                          <span style={styles.apptTitle}>{a.title}</span>
                          <span style={styles.apptType}>{a.type}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div style={styles.footer}>
          <div style={styles.legend}>
            <Legend color={TYPE_STYLE.Consulta.bar} label={`${counts.Consulta} Consultas`} />
            <Legend color={TYPE_STYLE.Retorno.bar} label={`${counts.Retorno} Retornos`} />
            <Legend color={TYPE_STYLE.Intervalo.bar} label={`${counts.Intervalo} Intervalos`} />
          </div>
          <button style={styles.configBtn}><Settings size={15} /> Configurar agenda</button>
        </div>
      </div>

      {/* Modal Novo agendamento */}
      {modal && (
        <div style={styles.overlay} onClick={() => setModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHead}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Novo agendamento</h3>
              <button style={styles.modalClose} onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <Field label="Paciente"><input style={styles.input} value={form.title} placeholder="Nome do paciente" onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Data"><input type="date" style={styles.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Field label="Início"><input type="time" style={styles.input} value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
              <Field label="Fim"><input type="time" style={styles.input} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></Field>
            </div>
            <Field label="Tipo">
              <select style={styles.input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Consulta</option><option>Retorno</option><option>Intervalo</option>
              </select>
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button style={styles.outlineBtn} onClick={() => setModal(false)}>Cancelar</button>
              <button style={styles.primaryBtn} onClick={salvarAgendamento}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MonthGrid({ ref_, appts, onPickDay }) {
  const first = new Date(ref_.getFullYear(), ref_.getMonth(), 1);
  const start = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const today = new Date();
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAYS_PT.map((d) => <div key={d} style={styles.monthHead}>{d}</div>)}
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === ref_.getMonth();
          const dayAppts = appts.filter((a) => a.date === toKey(d));
          const hoje = isSameDay(d, today);
          return (
            <div key={i} style={{ ...styles.monthCell, opacity: inMonth ? 1 : 0.4, background: hoje ? theme.colors.primarySoft : '#fff' }} onClick={() => onPickDay(d)}>
              <span style={{ ...styles.monthNum, ...(hoje ? { color: theme.colors.primary, fontWeight: 700 } : {}) }}>{d.getDate()}</span>
              {dayAppts.slice(0, 3).map((a) => {
                const st = TYPE_STYLE[a.type] || TYPE_STYLE.Consulta;
                return <div key={a.id} style={{ ...styles.monthDot, background: st.bg, color: st.color }}>{a.start} {a.title}</div>;
              })}
              {dayAppts.length > 3 && <span style={styles.monthMore}>+{dayAppts.length - 3}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Legend = ({ color, label }) => (
  <span style={styles.legendItem}><span style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} /> {label}</span>
);
const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', flexGrow: 1 }}>
    <label style={styles.label}>{label}</label>{children}
  </div>
);

const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' },
  title: { fontSize: '28px', fontWeight: 800, color: theme.colors.text, margin: 0 },
  subtitle: { color: theme.colors.textMuted, fontSize: '14px', margin: '6px 0 0 0' },
  breadcrumb: { fontSize: '13px', color: theme.colors.textMuted, margin: '16px 0' },
  card: { background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadow.card, padding: '16px' },

  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' },
  toolLeft: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  todayBtn: { background: '#fff', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, padding: '7px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: theme.colors.text },
  navBtn: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, cursor: 'pointer', color: '#475569' },
  rangeLabel: { fontSize: '14px', fontWeight: 600, color: theme.colors.text },
  toggle: { display: 'flex', background: '#f1f5f9', borderRadius: theme.radius.sm, padding: '3px' },
  toggleBtn: { border: 'none', background: 'none', padding: '6px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: theme.colors.textMuted, borderRadius: '6px' },
  toggleActive: { background: '#fff', color: theme.colors.primary, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' },

  grid: { display: 'grid', minWidth: '760px' },
  corner: { borderBottom: `1px solid ${theme.colors.border}` },
  dayHead: { textAlign: 'center', padding: '8px 4px', borderBottom: `1px solid ${theme.colors.border}`, borderLeft: `1px solid ${theme.colors.border}`, display: 'flex', flexDirection: 'column', gap: '4px' },
  dayName: { fontSize: '12px', color: theme.colors.textMuted, fontWeight: 600 },
  dayNum: { fontSize: '15px', fontWeight: 700, color: theme.colors.text },
  dayNumToday: { background: theme.colors.primary, color: '#fff', borderRadius: '50%', width: '26px', height: '26px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
  timeCol: { display: 'flex', flexDirection: 'column' },
  timeCell: { height: `${ROW_H}px`, fontSize: '11px', color: theme.colors.textSoft, textAlign: 'right', paddingRight: '8px', transform: 'translateY(-6px)' },
  dayCol: { position: 'relative', borderLeft: `1px solid ${theme.colors.border}` },
  slot: { height: `${ROW_H}px`, borderBottom: `1px solid #f1f5f9` },
  appt: { position: 'absolute', left: '3px', right: '3px', borderRadius: '6px', padding: '4px 6px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' },
  apptTime: { fontSize: '10px', fontWeight: 700 },
  apptTitle: { fontSize: '12px', fontWeight: 600, color: theme.colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  apptType: { fontSize: '10px', color: theme.colors.textMuted },

  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${theme.colors.border}`, flexWrap: 'wrap', gap: '12px' },
  legend: { display: 'flex', gap: '18px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' },
  configBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: theme.colors.primary, fontSize: '13px', fontWeight: 600, cursor: 'pointer' },

  // mês
  monthHead: { textAlign: 'center', fontSize: '12px', fontWeight: 600, color: theme.colors.textMuted, padding: '8px' },
  monthCell: { minHeight: '92px', border: `1px solid ${theme.colors.border}`, padding: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '3px' },
  monthNum: { fontSize: '13px', color: theme.colors.text },
  monthDot: { fontSize: '10px', borderRadius: '4px', padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  monthMore: { fontSize: '10px', color: theme.colors.textMuted },

  primaryBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.radius.sm, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  outlineBtn: { background: '#fff', color: '#475569', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { background: '#fff', borderRadius: theme.radius.lg, padding: '24px', width: '420px', maxWidth: '92vw', boxShadow: theme.shadow.pop },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  modalClose: { background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.textMuted },
  label: { fontSize: '13px', fontWeight: 600, color: '#334155' },
  input: { padding: '10px 12px', borderRadius: theme.radius.sm, border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', color: theme.colors.text, background: '#fff' },
};
