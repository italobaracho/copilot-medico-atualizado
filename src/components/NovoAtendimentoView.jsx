import { useState, useRef, useEffect } from 'react';

function Waveform({ isRecording }) {
  return (
    <div style={waveStyles.container}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          style={{
            ...waveStyles.bar,
            animationDelay: `${(i * 0.07) % 0.8}s`,
            height: isRecording ? `${12 + Math.sin(i) * 10}px` : '6px',
            backgroundColor: isRecording ? '#3b82f6' : '#cbd5e1',
            animation: isRecording ? 'wave 0.8s ease-in-out infinite alternate' : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { transform: scaleY(1); }
          to   { transform: scaleY(2.5); }
        }
      `}</style>
    </div>
  );
}

const waveStyles = {
  container: { display: 'flex', alignItems: 'center', gap: '3px', height: '40px' },
  bar: { width: '4px', borderRadius: '2px', transition: 'height 0.3s' },
};

function TranscricaoBlock({ texto }) {
  return (
    <div style={tsStyles.wrapper}>
      <p style={tsStyles.header}>Transcrição em tempo real</p>
      <div style={tsStyles.scroll}>
        {!texto ? (
          <p style={tsStyles.placeholder}>Aguardando início da gravação...</p>
        ) : (
          <p style={tsStyles.texto}>{texto}</p>
        )}
      </div>
      {texto && (
        <p style={tsStyles.aviso}>A transcrição é gerada por IA e pode conter imprecisões.</p>
      )}
    </div>
  );
}

const tsStyles = {
  wrapper: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  header: { fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '10px' },
  scroll: { flex: 1, overflowY: 'auto', maxHeight: '220px' },
  placeholder: { color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' },
  texto: { fontSize: '14px', color: '#1e293b', lineHeight: '1.6' },
  aviso: { fontSize: '12px', color: '#94a3b8', marginTop: '10px', fontStyle: 'italic' },
};

function NovoAtendimentoView({ patientId, pacientes = [], onVoltar, token, onAddNewPatient }) {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  const [sugestoes, setSugestoes] = useState([]);

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcricao, setTranscricao] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (patientId && pacientes.length > 0) {
      const found = pacientes.find((p) => p.id === patientId);
      if (found) selecionarPaciente(found);
    }
  }, [patientId, pacientes]);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `00:${m}:${ss}`;
  };

  const handleBusca = (v) => {
    setBusca(v);
    if (!v.trim()) { setSugestoes([]); return; }
    setSugestoes(
      pacientes.filter((p) =>
        p.nome.toLowerCase().includes(v.toLowerCase()) ||
        (p.cpf && p.cpf.includes(v))
      ).slice(0, 5)
    );
  };

  const selecionarPaciente = (p) => {
    setPacienteSelecionado(p);
    setBusca('');
    setSugestoes([]);
  };

  const iniciarGravacao = async () => {
    setShowConfirm(false);
    setTimer(0);
    setTranscricao('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
    } catch (err) {
      console.warn('Microfone não disponível:', err);
    }
    setIsRecording(true);
  };

  const pararGravacao = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    setIsRecording(false);

    mediaRecorderRef.current.ondataavailable = async (event) => {
      const audioBlob = event.data;
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'consulta.wav');
      formData.append('patient_id', pacienteSelecionado?.id || patientId || '');
      formData.append('consultation_id', 'consulta_temp_001');
      formData.append('duration', timer.toString());

      try {
        const response = await fetch('http://localhost:3001/api/transcribe_audio', {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (response.ok) {
          setTranscricao(data.transcription);
        } else {
          setTranscricao('Erro na transcrição: ' + data.message);
        }
      } catch {
        setTranscricao('Erro ao conectar ao servidor.');
      }
    };

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Atendimentos</h1>
      <p style={s.subtitle}>Realize e gerencie os atendimentos com transcrição de áudio.</p>

      <div style={s.breadcrumb}>
        <span style={s.breadLink} onClick={onVoltar}>Home</span>
        <span style={s.breadSep}>›</span>
        <span style={s.breadLink} onClick={onVoltar}>Atendimentos</span>
        <span style={s.breadSep}>›</span>
        <span style={s.breadCurrent}>Novo atendimento</span>
      </div>

      {/* Card 1: Selecionar paciente */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>1. Selecionar paciente</h2>
        {pacienteSelecionado ? (
          <div style={s.pacienteSelected}>
            <div style={s.pacienteInfo}>
              <span style={s.pacienteNome}>{pacienteSelecionado.nome}</span>
              {pacienteSelecionado.cpf && pacienteSelecionado.cpf !== 'Carregando...' && (
                <span style={s.pacienteCpf}> — {pacienteSelecionado.cpf}</span>
              )}
              <button onClick={() => setPacienteSelecionado(null)} style={s.clearBtn}>✕</button>
            </div>
            <div style={s.pacienteMeta}>
              {pacienteSelecionado.sexo && (
                <span style={s.metaTag}>
                  {pacienteSelecionado.sexo === 'M' ? '♂ Masculino' : '♀ Feminino'}
                </span>
              )}
              {pacienteSelecionado.idade && (
                <span style={s.metaTag}>📅 {pacienteSelecionado.idade}</span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={s.searchRow}>
              <input
                style={s.input}
                placeholder="Buscar paciente por nome ou CPF..."
                value={busca}
                onChange={(e) => handleBusca(e.target.value)}
              />
              <button style={s.btnNovo} onClick={onAddNewPatient}>
                + Novo paciente
              </button>
            </div>
            {sugestoes.length > 0 && (
              <div style={s.dropdown}>
                {sugestoes.map((p) => (
                  <div key={p.id} style={s.dropdownItem} onClick={() => selecionarPaciente(p)}>
                    <strong>{p.nome}</strong>
                    {p.cpf && p.cpf !== 'Carregando...' && (
                      <span style={{ color: '#64748b', marginLeft: 8 }}>{p.cpf}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card 2: Gravação */}
      <div style={{
        ...s.card,
        opacity: pacienteSelecionado ? 1 : 0.5,
        pointerEvents: pacienteSelecionado ? 'auto' : 'none'
      }}>
        <h2 style={s.cardTitle}>2. Iniciar atendimento</h2>
        <div style={s.gravacaoRow}>
          <div style={s.gravacaoLeft}>
            {isRecording && (
              <div style={s.recordingDot}>
                <span style={s.dot} /> Gravando...
              </div>
            )}
            <div style={s.timerDisplay}>{formatTime(timer)}</div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 16px' }}>Tempo de gravação</p>
            <Waveform isRecording={isRecording} />
            <button
              style={isRecording ? s.btnFinalizar : s.btnIniciar}
              onClick={isRecording ? pararGravacao : () => setShowConfirm(true)}
            >
              {isRecording ? '■ Finalizar gravação' : '▶ Iniciar gravação'}
            </button>
          </div>
          <TranscricaoBlock texto={transcricao} />
        </div>
      </div>

      {/* Card LGPD */}
      <div style={s.lgpdCard}>
        <span style={s.lgpdIcon}>🛡</span>
        <div>
          <p style={s.lgpdTitle}>Seus dados estão seguros</p>
          <p style={s.lgpdText}>A gravação e transcrição são criptografadas e armazenadas de acordo com a LGPD.</p>
        </div>
      </div>

      {/* Modal */}
      {showConfirm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalIcon}>🎙</div>
            <h3 style={s.modalTitle}>Iniciar gravação de áudio?</h3>
            <p style={s.modalText}>A gravação será utilizada para transcrição em tempo real do atendimento.</p>
            <div style={s.modalBtns}>
              <button style={s.btnCancelar} onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button style={s.btnConfirmar} onClick={iniciarGravacao}>Iniciar gravação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { fontFamily: "'Inter', sans-serif", maxWidth: '860px' },
  title: { fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '15px', margin: '0 0 12px' },
  breadcrumb: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '24px', fontSize: '14px' },
  breadLink: { color: '#3b82f6', cursor: 'pointer' },
  breadSep: { color: '#94a3b8' },
  breadCurrent: { color: '#475569' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'opacity 0.3s' },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 18px' },
  pacienteSelected: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', background: '#f8fafc' },
  pacienteInfo: { display: 'flex', alignItems: 'center', gap: '4px' },
  pacienteNome: { fontWeight: 600, color: '#0f172a', fontSize: '15px' },
  pacienteCpf: { color: '#64748b', fontSize: '14px' },
  clearBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' },
  pacienteMeta: { display: 'flex', gap: '16px', marginTop: '8px' },
  metaTag: { fontSize: '13px', color: '#64748b' },
  searchRow: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1e293b' },
  btnNovo: { padding: '10px 18px', border: '1px solid #3b82f6', borderRadius: '8px', background: '#fff', color: '#3b82f6', fontWeight: 600, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' },
  dropdownItem: { padding: '10px 16px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f1f5f9' },
  gravacaoRow: { display: 'flex', gap: '32px', alignItems: 'flex-start' },
  gravacaoLeft: { minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  recordingDot: { display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600, fontSize: '14px', marginBottom: '8px' },
  dot: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' },
  timerDisplay: { fontFamily: 'monospace', fontSize: '36px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px' },
  btnIniciar: { marginTop: '20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', width: '100%' },
  btnFinalizar: { marginTop: '20px', background: '#fff', color: '#ef4444', border: '1.5px solid #ef4444', borderRadius: '8px', padding: '10px 22px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', width: '100%' },
  lgpdCard: { display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '18px 20px' },
  lgpdIcon: { fontSize: '22px' },
  lgpdTitle: { fontWeight: 600, color: '#0369a1', margin: '0 0 4px', fontSize: '14px' },
  lgpdText: { color: '#0c4a6e', fontSize: '13px', margin: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  modalIcon: { fontSize: '40px', marginBottom: '12px' },
  modalTitle: { fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' },
  modalText: { color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px' },
  modalBtns: { display: 'flex', gap: '12px', justifyContent: 'center' },
  btnCancelar: { flex: 1, padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '14px' },
  btnConfirmar: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' },
};

export default NovoAtendimentoView;




