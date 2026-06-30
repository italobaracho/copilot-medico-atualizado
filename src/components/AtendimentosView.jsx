import { useState, useRef, useEffect } from 'react';
import {
  Mic, Square, Search, Plus, ShieldCheck, Sparkles, Loader2,
  Save, X, User, CheckCircle2, AlertTriangle, XCircle, FlaskConical, Stethoscope
} from 'lucide-react';
import theme from '../theme';
import { API_URL } from '../api';

// ============================================================
// Tela ATENDIMENTOS (imagem 1) — gravação + transcrição AO VIVO
// ------------------------------------------------------------
// A transcrição em tempo real usa a Web Speech API do navegador
// (Chrome/Edge): funciona de verdade, sem precisar de servidor.
// Ao finalizar, dá para "Analisar com IA" (Groq) e "Salvar no
// prontuário" (cria a consulta e grava a transcrição no backend).
// ============================================================

const STATUS_STYLE = {
  'Normal':  { color: theme.colors.success, bg: theme.colors.successSoft, Icon: CheckCircle2 },
  'Atenção': { color: theme.colors.warning, bg: theme.colors.warningSoft, Icon: AlertTriangle },
  'Crítico': { color: theme.colors.danger,  bg: theme.colors.dangerSoft,  Icon: XCircle },
};

const SpeechRecognition = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function AtendimentosView({ pacientes, token, onAddNewPatient }) {
  const [patientId, setPatientId] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [segments, setSegments] = useState([]);   // [{t: '00:00:05', text}]
  const [interim, setInterim] = useState('');
  const [analise, setAnalise] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTsRef = useRef(0);
  const transcriptEndRef = useRef(null);
  const recordingRef = useRef(false); // espelho de `recording` para o onend saber se deve reiniciar
  useEffect(() => { recordingRef.current = recording; }, [recording]);

  const paciente = pacientes.find((p) => p.id === patientId);
  const fullTranscript = segments.map((s) => s.text).join(' ').trim();

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [segments, interim]);

  // Limpa tudo ao desmontar
  useEffect(() => () => stopEngine(), []);

  const stopEngine = () => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const elapsedLabel = () => {
    const s = Math.floor((Date.now() - startTsRef.current) / 1000);
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const beginRecording = () => {
    setConfirming(false);
    setSegments([]);
    setInterim('');
    setAnalise(null);
    setSavedMsg('');
    setElapsed(0);

    if (!SpeechRecognition) {
      alert('Seu navegador não suporta transcrição em tempo real. Use o Chrome ou o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interinoLocal = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const txt = res[0].transcript;
        if (res.isFinal) {
          const carimbo = elapsedLabel();
          setSegments((prev) => [...prev, { t: carimbo, text: txt.trim() }]);
          interinoLocal = '';
        } else {
          interinoLocal += txt;
        }
      }
      setInterim(interinoLocal);
    };

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        alert('Permissão de microfone negada. Libere o microfone no navegador e tente de novo.');
        finishRecording();
      }
    };

    // Reinicia automaticamente se o navegador encerrar sozinho enquanto gravamos
    recognition.onend = () => {
      if (recordingRef.current) {
        try { recognition.start(); } catch { /* noop */ }
      }
    };

    recognitionRef.current = recognition;
    recordingRef.current = true;
    startTsRef.current = Date.now();
    try {
      recognition.start();
    } catch {
      // já iniciado
    }
    setRecording(true);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTsRef.current) / 1000));
    }, 1000);
  };

  const finishRecording = () => {
    recordingRef.current = false;
    setRecording(false);
    stopEngine();
    setInterim('');
  };

  const analisarComIA = async () => {
    if (!fullTranscript) return;
    setAnalyzing(true);
    setAnalise(null);
    try {
      const r = await fetch(`${API_URL}/api/analise-ia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ patient_id: patientId || null, exam_text: fullTranscript }),
      });
      const data = await r.json();
      if (r.ok && data.status === 'success') setAnalise(data.analise);
      else alert(data.message || 'Não foi possível analisar.');
    } catch {
      alert('Erro de conexão ao analisar com IA.');
    } finally {
      setAnalyzing(false);
    }
  };

  const salvarProntuario = async () => {
    if (!patientId) { alert('Selecione um paciente para salvar.'); return; }
    if (!fullTranscript) { alert('Não há transcrição para salvar.'); return; }
    setSaving(true);
    try {
      const r = await fetch(`${API_URL}/api/patients/${patientId}/atendimento-transcricao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: fullTranscript, duration: elapsed }),
      });
      const data = await r.json();
      if (r.ok && data.status === 'success') setSavedMsg('Atendimento salvo no prontuário do paciente. ✔');
      else alert(data.message || 'Não foi possível salvar.');
    } catch {
      alert('Erro de conexão ao salvar atendimento.');
    } finally {
      setSaving(false);
    }
  };

  const podeGravar = !!patientId;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Atendimentos</h1>
      <p style={styles.subtitle}>Realize e gerencie os atendimentos com transcrição de áudio.</p>
      <p style={styles.breadcrumb}>
        <span style={{ color: theme.colors.primary, fontWeight: 600 }}>Home</span> &gt; Atendimentos &gt; Novo atendimento
      </p>

      <div style={styles.layout}>
        <div style={styles.main}>
          {/* 1. Selecionar paciente */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><span style={styles.stepNum}>1</span> Selecionar paciente</h3>
            <div style={styles.selectRow}>
              <div style={styles.selectWrap}>
                <Search size={16} color={theme.colors.textMuted} style={{ position: 'absolute', left: '12px' }} />
                <select style={styles.patientSelect} value={patientId} onChange={(e) => setPatientId(e.target.value)} disabled={recording}>
                  <option value="">Selecione um paciente...</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}{p.cpf && p.cpf !== 'Não informado' ? ` - ${p.cpf}` : ''}</option>
                  ))}
                </select>
              </div>
              <button style={styles.outlineBtn} onClick={onAddNewPatient}><Plus size={16} /> Novo paciente</button>
            </div>
            {paciente && (
              <div style={styles.patientMeta}>
                <span><User size={14} /> {paciente.sexo || 'Não informado'}</span>
                {paciente.idade && <span>{paciente.idade}</span>}
              </div>
            )}
          </div>

          {/* 2. Iniciar atendimento */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><span style={styles.stepNum}>2</span> Iniciar atendimento</h3>
            <div style={styles.recRow}>
              {/* Controle de gravação */}
              <div style={styles.recControl}>
                {recording ? (
                  <>
                    <div style={styles.recDot}><span style={styles.pulse} className="rec-pulse" /> Gravando...</div>
                    <div style={styles.timer}>{fmtTime(elapsed)}</div>
                    <div style={styles.subLabel}>Tempo de gravação</div>
                    <Waveform />
                    <button style={styles.stopBtn} onClick={finishRecording}><Square size={14} /> Finalizar gravação</button>
                  </>
                ) : (
                  <>
                    <div style={styles.micBig}><Mic size={28} color={theme.colors.primary} /></div>
                    <div style={styles.subLabel}>{fullTranscript ? 'Gravação finalizada' : 'Pronto para gravar'}</div>
                    <button
                      style={{ ...styles.startBtn, opacity: podeGravar ? 1 : 0.5, cursor: podeGravar ? 'pointer' : 'not-allowed' }}
                      onClick={() => podeGravar && setConfirming(true)}
                      disabled={!podeGravar}
                    >
                      <Mic size={16} /> {fullTranscript ? 'Gravar novamente' : 'Iniciar gravação'}
                    </button>
                    {!podeGravar && <div style={styles.hint}>Selecione um paciente primeiro.</div>}
                  </>
                )}
              </div>

              {/* Transcrição em tempo real */}
              <div style={styles.transcriptBox}>
                <div style={styles.transcriptHead}>Transcrição em tempo real</div>
                <div style={styles.transcriptScroll}>
                  {segments.length === 0 && !interim && (
                    <p style={styles.muted}>A transcrição aparece aqui enquanto você fala...</p>
                  )}
                  {segments.map((s, i) => (
                    <div key={i} style={styles.line}>
                      <span style={styles.lineTime}>{s.t}</span>
                      <span>{s.text}</span>
                    </div>
                  ))}
                  {interim && (
                    <div style={{ ...styles.line, opacity: 0.55 }}>
                      <span style={styles.lineTime}>...</span>
                      <span>{interim}</span>
                    </div>
                  )}
                  <div ref={transcriptEndRef} />
                </div>
                <div style={styles.transcriptFoot}>A transcrição é gerada por IA e pode conter imprecisões.</div>
              </div>
            </div>

            {/* Ações após gravar */}
            {fullTranscript && !recording && (
              <div style={styles.actionsRow}>
                <button style={styles.iaBtn} onClick={analisarComIA} disabled={analyzing}>
                  {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Analisar com IA
                </button>
                <button style={styles.saveBtn} onClick={salvarProntuario} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Salvar no prontuário
                </button>
                {savedMsg && <span style={styles.savedMsg}>{savedMsg}</span>}
              </div>
            )}
          </div>

          {/* Resultado da IA */}
          {analise && <AnaliseResumo analise={analise} />}

          {/* LGPD */}
          <div style={styles.lgpd}>
            <ShieldCheck size={20} color={theme.colors.success} />
            <div>
              <strong>Seus dados estão seguros</strong>
              <p style={styles.muted}>A gravação e a transcrição são tratadas de acordo com a LGPD.</p>
            </div>
          </div>
        </div>

      </div>

      {!SpeechRecognition && (
        <div style={{ ...styles.lgpd, borderColor: theme.colors.warning, marginTop: '12px' }}>
          <AlertTriangle size={20} color={theme.colors.warning} />
          <div>
            <strong>Navegador incompatível</strong>
            <p style={styles.muted}>Transcrição em tempo real disponível no Chrome ou Edge.</p>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {confirming && (
        <div style={styles.overlay} onClick={() => setConfirming(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setConfirming(false)}><X size={18} /></button>
            <div style={styles.micBig}><Mic size={28} color={theme.colors.primary} /></div>
            <h3 style={{ margin: '12px 0 4px', fontSize: '18px' }}>Iniciar gravação de áudio?</h3>
            <p style={{ ...styles.muted, textAlign: 'center' }}>A gravação será utilizada para transcrição em tempo real do atendimento.</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={styles.outlineBtn} onClick={() => setConfirming(false)}>Cancelar</button>
              <button style={styles.startBtn} onClick={beginRecording}><Mic size={16} /> Iniciar gravação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Waveform() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '32px', margin: '8px 0' }}>
      {Array.from({ length: 22 }).map((_, i) => (
        <span key={i} className="wf-bar" style={{ animationDelay: `${(i % 7) * 0.1}s` }} />
      ))}
    </div>
  );
}

function AnaliseResumo({ analise }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}><Sparkles size={16} color={theme.colors.purple} /> Análise com IA</h3>

      {analise.resultados?.length > 0 && (
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Exame</th><th style={styles.th}>Resultado</th><th style={styles.th}>Ref.</th><th style={styles.th}>Status</th></tr></thead>
          <tbody>
            {analise.resultados.map((g, gi) => (
              <>
                <tr key={`g${gi}`}><td colSpan={4} style={styles.grupoRow}><FlaskConical size={13} color={theme.colors.primary} /> {g.grupo}</td></tr>
                {(g.itens || []).map((it, i) => {
                  const st = STATUS_STYLE[it.status] || STATUS_STYLE['Normal'];
                  const Icon = st.Icon;
                  return (
                    <tr key={`g${gi}i${i}`}>
                      <td style={styles.td}>{it.exame}</td>
                      <td style={styles.td}>{it.resultado} {it.unidade}</td>
                      <td style={styles.td}>{it.referencia}</td>
                      <td style={styles.td}><span style={{ ...styles.pill, color: st.color, background: st.bg }}><Icon size={12} /> {it.status}</span></td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      )}

      {analise.descritivo && <p style={{ ...styles.descritivo }}>{analise.descritivo}</p>}

      {analise.hipoteses?.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <strong style={{ fontSize: '13px' }}>Hipóteses (IA):</strong>
          {analise.hipoteses.map((h, i) => (
            <div key={i} style={styles.hipRow}>
              <span>{h.titulo} {h.mais_provavel && <span style={styles.maisProvavel}>mais provável</span>}</span>
              <strong>{h.probabilidade}%</strong>
            </div>
          ))}
        </div>
      )}

      {analise.orientacoes?.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <strong style={{ fontSize: '13px' }}>Orientações (IA):</strong>
          {analise.orientacoes.map((o, i) => (
            <div key={i} style={styles.orient}><Stethoscope size={14} color={theme.colors.primary} /> {o}</div>
          ))}
        </div>
      )}
      <p style={styles.disclaimer}>As hipóteses não substituem o julgamento clínico.</p>
    </div>
  );
}

const card = { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadow.card, padding: '20px' };

const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  title: { fontSize: '28px', fontWeight: 800, color: theme.colors.text, margin: 0 },
  subtitle: { color: theme.colors.textMuted, fontSize: '14px', margin: '6px 0 0 0' },
  breadcrumb: { fontSize: '13px', color: theme.colors.textMuted, margin: '18px 0' },
  layout: { display: 'flex', flexDirection: 'column', gap: '20px' },
  main: { display: 'flex', flexDirection: 'column', gap: '20px' },

  card,
  cardTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: theme.colors.text, margin: '0 0 16px 0' },
  stepNum: { width: '22px', height: '22px', borderRadius: '6px', background: theme.colors.primary, color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  selectRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  selectWrap: { position: 'relative', display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: '220px' },
  patientSelect: { width: '100%', padding: '11px 12px 11px 36px', borderRadius: theme.radius.sm, border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', color: theme.colors.text },
  outlineBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: theme.colors.primary, border: `1px solid ${theme.colors.primary}`, borderRadius: theme.radius.sm, padding: '10px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  patientMeta: { display: 'flex', gap: '18px', marginTop: '12px', fontSize: '13px', color: theme.colors.textMuted },

  recRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  recControl: { flex: '0 0 230px', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '6px', minHeight: '200px' },
  recDot: { display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.danger, fontWeight: 600, fontSize: '14px' },
  pulse: { width: '10px', height: '10px', borderRadius: '50%', background: theme.colors.danger, display: 'inline-block' },
  timer: { fontSize: '34px', fontWeight: 800, color: theme.colors.text, fontVariantNumeric: 'tabular-nums' },
  subLabel: { fontSize: '12px', color: theme.colors.textMuted },
  micBig: { width: '56px', height: '56px', borderRadius: '50%', background: theme.colors.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  startBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.radius.sm, padding: '11px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' },
  stopBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: theme.colors.danger, border: `1px solid ${theme.colors.danger}`, borderRadius: theme.radius.sm, padding: '11px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' },
  hint: { fontSize: '11px', color: theme.colors.textMuted },

  transcriptBox: { flex: '1 1 300px', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, display: 'flex', flexDirection: 'column', minHeight: '200px', minWidth: '260px' },
  transcriptHead: { fontSize: '13px', fontWeight: 700, color: theme.colors.text, padding: '12px 14px', borderBottom: `1px solid ${theme.colors.border}` },
  transcriptScroll: { flexGrow: 1, maxHeight: '220px', overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' },
  line: { display: 'flex', gap: '10px', fontSize: '13px', color: '#334155', lineHeight: 1.5 },
  lineTime: { color: theme.colors.textSoft, fontSize: '11px', fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginTop: '2px' },
  transcriptFoot: { fontSize: '11px', color: theme.colors.textSoft, padding: '8px 14px', borderTop: `1px solid ${theme.colors.border}` },

  actionsRow: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '18px', flexWrap: 'wrap' },
  iaBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: theme.colors.purpleSoft, color: theme.colors.purple, border: `1px solid ${theme.colors.purple}`, borderRadius: theme.radius.sm, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.radius.sm, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  savedMsg: { color: theme.colors.success, fontSize: '13px', fontWeight: 600 },

  lgpd: { ...card, display: 'flex', gap: '12px', alignItems: 'center' },
  muted: { fontSize: '13px', color: theme.colors.textMuted, margin: '2px 0 0 0' },

  sideCard: { ...card, padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  sideIcon: { width: '36px', height: '36px', borderRadius: theme.radius.sm, background: theme.colors.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { position: 'relative', background: '#fff', borderRadius: theme.radius.lg, padding: '28px', width: '380px', maxWidth: '90vw', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: theme.shadow.pop },
  modalClose: { position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.textMuted },

  // tabela da análise
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '4px' },
  th: { textAlign: 'left', fontSize: '11px', fontWeight: 700, color: theme.colors.textMuted, padding: '8px 8px', borderBottom: `1px solid ${theme.colors.border}` },
  grupoRow: { padding: '10px 8px 6px', fontSize: '12px', fontWeight: 700, color: theme.colors.text },
  td: { fontSize: '13px', color: '#334155', padding: '8px', borderBottom: '1px solid #f1f5f9' },
  pill: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: theme.radius.pill },
  descritivo: { fontSize: '13px', color: '#334155', lineHeight: 1.6, marginTop: '12px' },
  hipRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' },
  maisProvavel: { fontSize: '10px', color: theme.colors.purple, background: theme.colors.purpleSoft, padding: '2px 6px', borderRadius: theme.radius.pill, marginLeft: '6px' },
  orient: { display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: '#334155', padding: '6px 0' },
  disclaimer: { fontSize: '11px', color: theme.colors.textMuted, fontStyle: 'italic', marginTop: '10px' },
};
