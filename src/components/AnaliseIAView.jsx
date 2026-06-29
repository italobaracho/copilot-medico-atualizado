import { useState, useEffect } from 'react';
import {
  Sparkles, Loader2, Printer, FlaskConical, FileText,
  CheckCircle2, AlertTriangle, XCircle, Stethoscope
} from 'lucide-react';
import theme from '../theme';
import { API_URL } from '../api';

// ============================================================
// Tela "Análise com IA" (imagens 8 a 11) — DINÂMICA via Groq
// ------------------------------------------------------------
// Fluxo: escolher paciente -> escolher atendimento (ou colar o
// resultado do exame) -> "Gerar análise" -> o backend chama o
// Groq (llama-3.3-70b) e devolve o laudo estruturado em JSON,
// que renderizamos nos 5 blocos.
// ============================================================

const STATUS_STYLE = {
  'Normal':  { color: theme.colors.success, bg: theme.colors.successSoft, Icon: CheckCircle2 },
  'Atenção': { color: theme.colors.warning, bg: theme.colors.warningSoft, Icon: AlertTriangle },
  'Crítico': { color: theme.colors.danger,  bg: theme.colors.dangerSoft,  Icon: XCircle },
};

export default function AnaliseIAView({ pacientes, token }) {
  const [patientId, setPatientId] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [consultationId, setConsultationId] = useState('');
  const [examText, setExamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Carrega os atendimentos do paciente escolhido
  useEffect(() => {
    if (!patientId) { setConsultations([]); setConsultationId(''); return; }
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/patients/${patientId}/consultations`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await r.json();
        if (r.ok && data.status === 'success') {
          setConsultations(data.consultations || []);
        } else {
          setConsultations([]);
        }
      } catch {
        setConsultations([]);
      }
    })();
  }, [patientId, token]);

  const gerarAnalise = async () => {
    setError('');
    if (!patientId && !examText.trim()) {
      setError('Selecione um paciente/atendimento ou cole o resultado do exame.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`${API_URL}/api/analise-ia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          patient_id: patientId || null,
          consultation_id: consultationId || null,
          exam_text: examText || null,
        }),
      });
      const data = await r.json();
      if (r.ok && data.status === 'success') {
        setResult(data);
      } else {
        setError(data.message || 'Não foi possível gerar a análise.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão ao gerar a análise com IA.');
    } finally {
      setLoading(false);
    }
  };

  const analise = result?.analise;
  const ident = result?.identificacao;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Análise com IA</h1>
      <p style={styles.subtitle}>Gere um laudo laboratorial interpretado pela IA a partir de um atendimento ou de resultados de exame.</p>
      <p style={styles.breadcrumb}>
        <span style={{ color: theme.colors.primary, fontWeight: 600 }}>Home</span> &gt; Análise com IA
      </p>

      {/* Painel de controle (entrada) */}
      <div style={styles.controlCard}>
        <div style={styles.controlRow}>
          <div style={styles.field}>
            <label style={styles.label}>Paciente</label>
            <select style={styles.select} value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">Selecione um paciente</option>
              {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Atendimento (opcional)</label>
            <select style={styles.select} value={consultationId} onChange={(e) => setConsultationId(e.target.value)} disabled={!patientId}>
              <option value="">Usar histórico mais recente / nenhum</option>
              {consultations.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ou cole os resultados do exame (opcional)</label>
          <textarea
            style={styles.textarea}
            placeholder="Ex.: Hemoglobina 13,2 g/dL; Leucócitos 12.800/mm³; PCR 8,6 mg/L..."
            value={examText}
            onChange={(e) => setExamText(e.target.value)}
          />
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <button style={styles.generateBtn} onClick={gerarAnalise} disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Gerando análise...' : 'Gerar análise com IA'}
        </button>
      </div>

      {/* Resultado */}
      {analise && (
        <div style={styles.report}>
          <div style={styles.reportHeader}>
            <h2 style={styles.reportTitle}>Laudo Laboratorial</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={styles.finalizadoTag}>Gerado por IA</span>
              <button style={styles.printBtn} onClick={() => window.print()}>
                <Printer size={16} /> Imprimir / PDF
              </button>
            </div>
          </div>

          {/* Bloco 1 - Identificação */}
          <Block n={1} title="Identificação do paciente">
            <div style={styles.identGrid}>
              <div>
                <p style={styles.identName}>{ident?.nome || 'Paciente'}</p>
                <p style={styles.identLine}>CPF: {ident?.cpf || '—'}</p>
                <p style={styles.identLine}>{ident?.sexo || '—'} · {ident?.idade || '—'}</p>
              </div>
              <div style={styles.identRight}>
                <Info label="Nº do laudo" value={analise.laudo?.numero || '—'} />
                <Info label="Laboratório" value={analise.laudo?.laboratorio || '—'} />
                <Info label="Data de emissão" value={analise.laudo?.data_emissao || new Date().toLocaleDateString('pt-BR')} />
              </div>
            </div>
          </Block>

          {/* Bloco 2 - Resultados */}
          <Block n={2} title="Resultados dos exames">
            {(!analise.resultados || analise.resultados.length === 0) ? (
              <p style={styles.muted}>Nenhum resultado laboratorial estruturado foi identificado nos dados fornecidos.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Exame</th>
                    <th style={styles.th}>Resultado</th>
                    <th style={styles.th}>Unidade</th>
                    <th style={styles.th}>Referência</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analise.resultados.map((grupo, gi) => (
                    <Grupo key={gi} grupo={grupo} />
                  ))}
                </tbody>
              </table>
            )}
          </Block>

          {/* Bloco 3 - Descritivo */}
          <Block n={3} title="Descritivo do resultado">
            <p style={styles.descritivo}>{analise.descritivo || '—'}</p>
          </Block>

          {/* Bloco 4 - Hipóteses */}
          <Block n={4} title="Possíveis hipóteses de diagnóstico (IA)" badge>
            {(!analise.hipoteses || analise.hipoteses.length === 0) ? (
              <p style={styles.muted}>Sem hipóteses geradas para os dados fornecidos.</p>
            ) : (
              <div style={styles.hipGrid}>
                {analise.hipoteses.map((h, i) => (
                  <div key={i} style={styles.hipCard}>
                    <div style={styles.hipHead}>
                      <span style={styles.hipNum}>{i + 1}</span>
                      <h4 style={styles.hipTitle}>{h.titulo}</h4>
                      {h.mais_provavel && <span style={styles.hipTag}>Mais provável</span>}
                    </div>
                    <p style={styles.hipDesc}>{h.descricao}</p>
                    <div style={styles.hipBarRow}>
                      <span style={styles.hipBarLabel}>Probabilidade estimada</span>
                      <span style={styles.hipPct}>{h.probabilidade}%</span>
                    </div>
                    <div style={styles.hipBarTrack}>
                      <div style={{ ...styles.hipBarFill, width: `${Math.max(0, Math.min(100, h.probabilidade))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p style={styles.disclaimer}>As hipóteses apresentadas não substituem o julgamento clínico e devem ser interpretadas pelo médico responsável.</p>
          </Block>

          {/* Bloco 5 - Orientações */}
          <Block n={5} title="Orientações médicas (IA)" badge>
            <div style={styles.orientList}>
              {(analise.orientacoes || []).map((o, i) => (
                <div key={i} style={styles.orientItem}>
                  <Stethoscope size={16} color={theme.colors.primary} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </Block>
        </div>
      )}
    </div>
  );
}

function Grupo({ grupo }) {
  return (
    <>
      <tr>
        <td colSpan={5} style={styles.grupoRow}>
          <FlaskConical size={14} color={theme.colors.primary} /> {grupo.grupo}
        </td>
      </tr>
      {(grupo.itens || []).map((it, i) => {
        const st = STATUS_STYLE[it.status] || STATUS_STYLE['Normal'];
        const Icon = st.Icon;
        return (
          <tr key={i} style={styles.tr}>
            <td style={styles.td}>{it.exame}</td>
            <td style={{ ...styles.td, fontWeight: 600 }}>{it.resultado}</td>
            <td style={styles.td}>{it.unidade}</td>
            <td style={styles.td}>{it.referencia}</td>
            <td style={styles.td}>
              <span style={{ ...styles.statusPill, color: st.color, backgroundColor: st.bg }}>
                <Icon size={13} /> {it.status}
              </span>
            </td>
          </tr>
        );
      })}
    </>
  );
}

function Block({ n, title, badge, children }) {
  return (
    <div style={styles.block}>
      <div style={styles.blockHead}>
        <span style={styles.blockNum}>{n}</span>
        <h3 style={styles.blockTitle}>{title}</h3>
        {badge && <span style={styles.iaBadge}><Sparkles size={12} /> Gerado por IA</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

const card = { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadow.card };

const styles = {
  container: { fontFamily: 'system-ui, sans-serif', maxWidth: '1000px' },
  title: { fontSize: '28px', fontWeight: 800, color: theme.colors.text, margin: 0 },
  subtitle: { color: theme.colors.textMuted, fontSize: '14px', margin: '6px 0 0 0' },
  breadcrumb: { fontSize: '13px', color: theme.colors.textMuted, margin: '18px 0' },

  controlCard: { ...card, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' },
  controlRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1, minWidth: '240px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#334155' },
  select: { padding: '10px 12px', borderRadius: theme.radius.sm, border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff', color: theme.colors.text },
  textarea: { padding: '11px 12px', borderRadius: theme.radius.sm, border: '1px solid #cbd5e1', fontSize: '14px', minHeight: '90px', resize: 'vertical', fontFamily: 'inherit', color: theme.colors.text },
  errorBox: { color: theme.colors.danger, backgroundColor: theme.colors.dangerSoft, padding: '10px 14px', borderRadius: theme.radius.sm, fontSize: '13px', fontWeight: 500 },
  generateBtn: { alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.radius.sm, padding: '12px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },

  report: { ...card, padding: '0', overflow: 'hidden' },
  reportHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 24px', borderBottom: `1px solid ${theme.colors.border}`, flexWrap: 'wrap', gap: '12px' },
  reportTitle: { fontSize: '20px', fontWeight: 800, color: theme.colors.text, margin: 0 },
  finalizadoTag: { backgroundColor: theme.colors.purpleSoft, color: theme.colors.purple, fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: theme.radius.pill, display: 'flex', alignItems: 'center' },
  printBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', color: '#475569', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },

  block: { padding: '22px 24px', borderBottom: `1px solid ${theme.colors.border}` },
  blockHead: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  blockNum: { width: '24px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.primary, color: '#fff', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  blockTitle: { fontSize: '16px', fontWeight: 700, color: theme.colors.text, margin: 0 },
  iaBadge: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: theme.colors.purpleSoft, color: theme.colors.purple, fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: theme.radius.pill },

  identGrid: { display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' },
  identName: { fontSize: '17px', fontWeight: 700, color: theme.colors.text, margin: 0 },
  identLine: { fontSize: '13px', color: theme.colors.textMuted, margin: '4px 0 0 0' },
  identRight: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '260px' },
  infoLabel: { fontSize: '13px', color: theme.colors.textMuted },
  infoValue: { fontSize: '13px', color: theme.colors.text, fontWeight: 600, textAlign: 'right' },

  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '12px', fontWeight: 700, color: theme.colors.textMuted, padding: '10px 12px', borderBottom: `1px solid ${theme.colors.border}` },
  grupoRow: { padding: '14px 12px 8px', fontSize: '13px', fontWeight: 700, color: theme.colors.text },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { fontSize: '14px', color: '#334155', padding: '12px' },
  statusPill: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: theme.radius.pill },

  descritivo: { fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' },
  muted: { fontSize: '14px', color: theme.colors.textMuted, margin: 0 },

  hipGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' },
  hipCard: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: '16px' },
  hipHead: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' },
  hipNum: { width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${theme.colors.purple}`, color: theme.colors.purple, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hipTitle: { fontSize: '14px', fontWeight: 700, color: theme.colors.text, margin: 0, flexGrow: 1 },
  hipTag: { backgroundColor: theme.colors.purpleSoft, color: theme.colors.purple, fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: theme.radius.pill },
  hipDesc: { fontSize: '13px', color: theme.colors.textMuted, lineHeight: 1.5, margin: '0 0 12px 0' },
  hipBarRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' },
  hipBarLabel: { color: theme.colors.textMuted },
  hipPct: { fontWeight: 700, color: theme.colors.text },
  hipBarTrack: { height: '6px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' },
  hipBarFill: { height: '100%', backgroundColor: theme.colors.purple, borderRadius: '999px' },
  disclaimer: { fontSize: '12px', color: theme.colors.textMuted, marginTop: '16px', fontStyle: 'italic' },

  orientList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  orientItem: { display: 'flex', gap: '10px', fontSize: '14px', color: '#334155', lineHeight: 1.5, backgroundColor: theme.colors.bg, padding: '12px 14px', borderRadius: theme.radius.sm },
};
