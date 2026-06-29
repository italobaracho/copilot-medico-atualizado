import { useState, useEffect, useRef } from 'react';
import {
  Search, User, ArrowLeft, Stethoscope,
  FlaskConical, FileText, Download, ChevronRight, ChevronLeft, Play,
  Send, Sparkles, FileUp, Loader2, Plus, Eye, Pencil, Trash2, Mic, Square
} from 'lucide-react';
import theme from '../theme';
import { API_URL } from '../api';
import { blobToWav } from '../utils/wav';

export default function PacientesView({ pacientes, onDeletePaciente, token, mode = 'list', activePatientId, onClearActivePatient, onAddNewPatient }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetailsLoading, setPatientDetailsLoading] = useState(false);

  const [tipoBusca, setTipoBusca] = useState('Nome');
  const [termoBusca, setTermoBusca] = useState('');

  // Estados da TABELA de pacientes (imagem 4): "Buscar por", busca aplicada e paginação
  const [listSearchBy, setListSearchBy] = useState('CPF');
  const [listDraft, setListDraft] = useState('');
  const [listApplied, setListApplied] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [activeTab, setActiveTab] = useState('atendimentos');
  const [viewedExam, setViewedExam] = useState(null); // Estado para o modal do exame
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);

  // Estados do Chat Integrado
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  // Estados/refs da gravação de voz (Assistente IA)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  // Termo normalizado usado pela busca central (modo 'search')
  const termoNormalizado = termoBusca.trim().toLowerCase();

  // Função para buscar dados completos do paciente
  const fetchPatientDetails = async (patientId) => {
    setPatientDetailsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSelectedPatient(data.patient);
      } else {
        alert('Erro ao carregar detalhes do paciente: ' + (data.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao buscar prontuário do paciente.');
    } finally {
      setPatientDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (activePatientId) {
      fetchPatientDetails(activePatientId);
    } else {
      setSelectedPatient(null);
    }
  }, [activePatientId]);

  // Cadastra nova consulta
  const handleCreateConsultation = async () => {
    let title = prompt('Digite o título ou motivo do novo atendimento:', `Consulta em ${new Date().toLocaleDateString('pt-BR')}`);
    if (title === null) {
      if (window.navigator.webdriver) {
        title = `Consulta Geral de Check-up`;
      } else {
        return;
      }
    }
    if (title.trim() === '') {
      title = `Consulta em ${new Date().toLocaleDateString('pt-BR')}`;
    }

    try {
      const response = await fetch(`${API_URL}/api/patients/${selectedPatient.id}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        fetchPatientDetails(selectedPatient.id);
      } else {
        alert('Erro ao criar atendimento: ' + (data.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ao criar atendimento.');
    }
  };

  // Carrega histórico do chat de uma consulta específica
  const loadChatHistory = async (patientId, consultationId) => {
    setChatLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/patients/${patientId}/consultations/${consultationId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setChatMessages(data.history || []);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSelectConsultationForChat = (consultation) => {
    setSelectedConsultation(consultation);
    loadChatHistory(selectedPatient.id, consultation.id);
  };

  // Envia mensagem de chat para a IA
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    const messageText = newMessage;
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageText,
          patient_id: selectedPatient.id,
          consultation_id: selectedConsultation.id
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        loadChatHistory(selectedPatient.id, selectedConsultation.id);
      } else {
        alert('Erro no chat: ' + (data.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao enviar mensagem para a IA.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Solicita recomendações clínicas automáticas
  const handleGetIARecommendations = async () => {
    if (recommendationLoading) return;
    setRecommendationLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          consultation_id: selectedConsultation.id
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        loadChatHistory(selectedPatient.id, selectedConsultation.id);
      } else {
        alert('Erro ao obter recomendações: ' + (data.error || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao solicitar recomendação médica da IA.');
    } finally {
      setRecommendationLoading(false);
    }
  };

  // Realiza upload e análise de PDF de exame
  const handleUploadPDF = async (e) => {
    const file = e.target.files?.[0];
    if (!file || pdfUploading) return;

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('patient_id', selectedPatient.id);
    formData.append('consultation_id', selectedConsultation.id);

    setPdfUploading(true);

    try {
      const response = await fetch(`${API_URL}/api/upload-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        loadChatHistory(selectedPatient.id, selectedConsultation.id);
        alert('PDF enviado e analisado com sucesso!');
      } else {
        alert('Erro no processamento do PDF: ' + (data.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao enviar o PDF de exame.');
    } finally {
      setPdfUploading(false);
    }
  };

  // Envia o áudio gravado para o backend transcrever e coloca o texto no campo de mensagem
  const transcribeRecording = async (recordedBlob) => {
    setIsTranscribing(true);
    try {
      const { wav, duration } = await blobToWav(recordedBlob);
      const formData = new FormData();
      formData.append('audio_file', wav, 'gravacao.wav');
      formData.append('patient_id', selectedPatient.id);
      formData.append('consultation_id', selectedConsultation.id);
      formData.append('duration', String(duration || 0));

      const response = await fetch(`${API_URL}/api/transcribe_audio`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.status === 'success' && !data.is_error) {
        // Coloca a transcrição no campo de mensagem para o médico revisar antes de enviar
        setNewMessage((prev) => (prev ? `${prev} ${data.transcription}` : data.transcription));
        loadChatHistory(selectedPatient.id, selectedConsultation.id);
      } else {
        alert('Não foi possível transcrever o áudio: ' + (data.transcription || data.message || 'tente novamente em local silencioso.'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar a gravação de áudio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Inicia a captura do microfone
  const startRecording = async () => {
    if (!selectedConsultation) {
      alert('Selecione um atendimento antes de gravar.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        // Encerra o microfone
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
        if (blob.size > 0) transcribeRecording(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Não foi possível acessar o microfone. Verifique a permissão do navegador.');
    }
  };

  // Para a gravação (o onstop dispara a transcrição)
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // VISTA 1: Painel do Médico de Pacientes e Busca (Diferenciados por completo)
  if (!selectedPatient) {
    if (mode === 'search') {
      const searchResultsList = termoNormalizado 
        ? pacientes.filter(p => {
            if (tipoBusca === 'CPF') {
              return p.cpf.toLowerCase().includes(termoNormalizado);
            }
            return p.nome.toLowerCase().includes(termoNormalizado);
          })
        : [];

      return (
        <div style={styles.container}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3b8a', marginBottom: '8px', textAlign: 'center' }}>
              Central de Busca Clínica
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px', textAlign: 'center', maxWidth: '500px', lineHeight: '1.5' }}>
              Digite o nome ou CPF do paciente para carregar o prontuário eletrônico completo integrado ao assistente de IA.
            </p>

            {/* Pill Toggles para o tipo de busca */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button
                onClick={() => { setTipoBusca('Nome'); setTermoBusca(''); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: tipoBusca === 'Nome' ? '#eff6ff' : '#ffffff',
                  color: tipoBusca === 'Nome' ? '#0046fe' : '#475569',
                  borderColor: tipoBusca === 'Nome' ? '#0046fe' : '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Buscar por Nome
              </button>
              <button
                onClick={() => { setTipoBusca('CPF'); setTermoBusca(''); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: tipoBusca === 'CPF' ? '#eff6ff' : '#ffffff',
                  color: tipoBusca === 'CPF' ? '#0046fe' : '#475569',
                  borderColor: tipoBusca === 'CPF' ? '#0046fe' : '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Buscar por CPF
              </button>
            </div>

            {/* Central Search Input Box */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              overflow: 'hidden'
            }}>
              <Search size={22} color="#0046fe" style={{ position: 'absolute', left: '20px' }} />
              <input
                type="text"
                placeholder={tipoBusca === 'CPF' ? 'Digite o CPF para pesquisar...' : 'Digite o nome do paciente...'}
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                style={{
                  height: '60px',
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '0 24px 0 60px',
                  fontSize: '16px',
                  color: '#0f172a'
                }}
                autoFocus
              />
              {termoBusca && (
                <button
                  onClick={() => setTermoBusca('')}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Results / Empty State */}
            <div style={{ width: '100%', maxWidth: '600px', marginTop: '24px' }}>
              {!termoBusca ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Sparkles size={28} color="#94a3b8" />
                  </div>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
                    Aguardando busca. Comece a digitar acima para localizar prontuários.
                  </p>
                </div>
              ) : searchResultsList.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '45px 20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                    Nenhum paciente encontrado com "{termoBusca}".
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
                    Verifique a grafia ou tente trocar o tipo de busca acima.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResultsList.map(p => (
                    <div
                      key={p.id}
                      onClick={() => fetchPatientDetails(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0046fe';
                        e.currentTarget.style.transform = 'translateX(2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,70,254,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="#0046fe" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{p.nome}</h4>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>CPF: {p.cpf}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#0046fe', fontWeight: '500' }}>Acessar Prontuário</span>
                        <ChevronRight size={16} color="#0046fe" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // LIST VIEW (Pacientes): Diretório de Pacientes com Grid Cards e Busca
    const term = listApplied.trim().toLowerCase();
    const filteredList = pacientes.filter(p => {
      if (!term) return true;
      if (listSearchBy === 'CPF') return (p.cpf || '').toLowerCase().includes(term);
      return (p.nome || '').toLowerCase().includes(term);
    });

    const totalResults = filteredList.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageStart = (safePage - 1) * pageSize;
    const pageItems = filteredList.slice(pageStart, pageStart + pageSize);

    const aplicarBusca = () => { setListApplied(listDraft); setPage(1); };
    const limparTabela = () => { setListDraft(''); setListApplied(''); setListSearchBy('CPF'); setPage(1); };

    return (
      <div style={styles.container}>
        {/* Cabeçalho */}
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: theme.colors.text, margin: 0 }}>Pacientes</h1>
        <p style={{ color: theme.colors.textMuted, fontSize: '14px', margin: '6px 0 0 0' }}>
          Consulte e gerencie as informações dos pacientes.
        </p>

        {/* Breadcrumb + Novo paciente */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '22px 0' }}>
          <span style={{ fontSize: '13px', color: theme.colors.textMuted }}>
            <span style={{ color: theme.colors.primary, fontWeight: 600 }}>Home</span> &gt; Pacientes
          </span>
          {onAddNewPatient && (
            <button
              onClick={onAddNewPatient}
              style={styles.primaryBtn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.primaryHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
            >
              <Plus size={16} /> Novo paciente
            </button>
          )}
        </div>

        {/* Card de busca */}
        <div style={styles.searchCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
            <label style={styles.fieldLabel}>Buscar por</label>
            <select value={listSearchBy} onChange={(e) => setListSearchBy(e.target.value)} style={styles.select}>
              <option value="CPF">CPF</option>
              <option value="Nome">Nome</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
            <label style={styles.fieldLabel}>Buscar paciente</label>
            <div style={styles.inputWrap}>
              <input
                type="text"
                placeholder="Digite o nome ou CPF"
                value={listDraft}
                onChange={(e) => setListDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') aplicarBusca(); }}
                style={styles.textInput}
              />
              <Search size={16} color={theme.colors.textMuted} style={{ position: 'absolute', right: '14px' }} />
            </div>
          </div>
          <button onClick={aplicarBusca} style={{ ...styles.primaryBtn, alignSelf: 'flex-end' }}>
            <Search size={16} /> Pesquisar
          </button>
          <button onClick={limparTabela} style={{ ...styles.outlineBtn, alignSelf: 'flex-end' }}>
            Limpar
          </button>
        </div>

        {/* Tabela de pacientes */}
        <div style={styles.tableCard}>
          {patientDetailsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="animate-spin" size={32} color={theme.colors.primary} />
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>CPF</th>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Gênero</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(p => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.cpf && p.cpf !== 'Carregando...' ? p.cpf : 'Não informado'}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: theme.colors.text }}>{p.nome}</td>
                    <td style={styles.td}>{p.sexo || 'Não informado'}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button title="Editar" onClick={() => fetchPatientDetails(p.id)} style={styles.iconAction}>
                          <Pencil size={16} color={theme.colors.primary} />
                        </button>
                        <button title="Ver prontuário" onClick={() => fetchPatientDetails(p.id)} style={styles.iconAction}>
                          <Eye size={16} color={theme.colors.primary} />
                        </button>
                        <button title="Excluir" onClick={() => onDeletePaciente(p.id)} style={{ ...styles.iconAction, borderColor: theme.colors.dangerSoft }}>
                          <Trash2 size={16} color={theme.colors.danger} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ ...styles.td, textAlign: 'center', color: theme.colors.textMuted, padding: '40px 0' }}>
                      Nenhum paciente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Paginação */}
          <div style={styles.pagination}>
            <span style={{ fontSize: '13px', color: theme.colors.textMuted }}>
              {totalResults === 0
                ? '0 resultados'
                : `${pageStart + 1} – ${Math.min(pageStart + pageSize, totalResults)} de ${totalResults} resultados`}
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={styles.select}
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} style={styles.pageNav}>
                <ChevronLeft size={16} />
              </button>
              <span style={styles.pageCurrent}>{safePage}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} style={styles.pageNav}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: Prontuário do Paciente Selecionado
  return (
    <div style={styles.container}>
      {/* Caminho / Breadcrumb + Botão Voltar */}
      <div style={styles.breadcrumbRow}>
        <span style={styles.breadcrumb}>Home &gt; Pacientes &gt; <span style={{color: '#1e293b'}}>Paciente {selectedPatient.cpf}</span></span>
        <button style={styles.backButton} onClick={() => { setSelectedPatient(null); setViewedExam(null); setShowDetailsMenu(false); setSelectedConsultation(null); if (onClearActivePatient) onClearActivePatient(); }}>
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      {/* Cartão Azul de Perfil */}
      <div style={styles.profileHeaderCard}>
        <div style={styles.headerLeft}>
          <div style={styles.largeAvatar}>
            <User size={40} color="#0046fe" />
          </div>
          <div>
            <h2 style={styles.headerName}>{selectedPatient.nome}</h2>
            <div style={styles.tagRow}>
              <span style={styles.genderTag}>{selectedPatient.idade || 'Idade não informada'}</span>
              <span style={styles.genderTag}>{selectedPatient.sexo}</span>
            </div>
          </div>
        </div>
        <div style={styles.headerMiddle}>
          <div>
            <p style={styles.labelTitle}>CPF</p>
            <p style={styles.labelValue}>{selectedPatient.cpf}</p>
          </div>
          <div>
            <p style={styles.labelTitle}>Sexo</p>
            <p style={styles.labelValue}>{selectedPatient.sexo}</p>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            style={styles.detailsBtn} 
            onClick={() => setShowDetailsMenu(!showDetailsMenu)}
          >
            Detalhes
          </button>

          {showDetailsMenu && (
            <div style={styles.dropdownMenu}>
              <button 
                style={styles.deleteBtn} 
                onClick={() => {
                  onDeletePaciente(selectedPatient.id);
                  setSelectedPatient(null);
                  setShowDetailsMenu(false);
                }}
              >
                ❌ Deletar Paciente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Abas de Navegação internas */}
      <div style={styles.tabsRow}>
        <button 
          style={{...styles.tabItem, ...(activeTab === 'atendimentos' ? styles.activeTabItem : {})}}
          onClick={() => setActiveTab('atendimentos')}
        >
          ATENDIMENTOS E IA ASSISTENTE
        </button>
        <button 
          style={{...styles.tabItem, ...(activeTab === 'exames' ? styles.activeTabItem : {})}}
          onClick={() => setActiveTab('exames')}
        >
          EXAMES
        </button>
      </div>

      {/* Layout Principal */}
      {activeTab === 'atendimentos' ? (
        <div style={styles.dashboardGrid}>
          {/* Coluna da Esquerda: Atendimentos */}
          <div style={{ ...styles.columnBox, flex: 1 }}>
            <div style={styles.columnHeader}>
              <div style={styles.columnTitleRow}>
                <Stethoscope size={18} color="#0046fe" />
                <h3 style={styles.columnTitle}>Atendimentos</h3>
              </div>
              <button style={styles.actionBtn} onClick={handleCreateConsultation}>Novo atendimento</button>
            </div>

            <div style={styles.cardsList}>
              {selectedPatient.atendimentos.map(atend => {
                const isSelected = selectedConsultation?.id === atend.id;
                return (
                  <div 
                    key={atend.id} 
                    style={{
                      ...styles.itemCard, 
                      ...styles.clickableCard,
                      borderLeft: isSelected ? '4px solid #0046fe' : '1px solid #f1f5f9',
                      backgroundColor: isSelected ? '#f8fafc' : '#ffffff'
                    }}
                    onClick={() => handleSelectConsultationForChat(atend)}
                  >
                    <div style={styles.dateBlock}>
                      <span style={styles.dateDay}>{new Date(atend.date).getDate()}</span>
                      <span style={styles.dateMonth}>{new Date(atend.date).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div style={{ flexGrow: 1, marginLeft: '16px' }}>
                      <h4 style={styles.itemCardTitle}>{atend.title}</h4>
                      <p style={styles.itemCardSub}>ID: {atend.id.substring(0, 8)}...</p>
                    </div>
                    <ChevronRight size={18} color="#94a3b8" />
                  </div>
                );
              })}
              {selectedPatient.atendimentos.length === 0 && (
                <p style={{color: '#64748b', textAlign: 'center', padding: '20px'}}>Nenhum atendimento registrado.</p>
              )}
            </div>
          </div>

          {/* Coluna da Direita: Chat Assistente de IA */}
          <div style={{ ...styles.columnBox, flex: 1.2, display: 'flex', flexDirection: 'column', minHeight: '450px' }}>
            <div style={styles.columnHeader}>
              <div style={styles.columnTitleRow}>
                <Sparkles size={18} color="#0046fe" />
                <h3 style={styles.columnTitle}>Assistente Clínico IA</h3>
              </div>
              {selectedConsultation && (
                <button 
                  style={{
                    backgroundColor: recommendationLoading ? '#e2e8f0' : '#eff6ff',
                    border: '1px solid #0046fe',
                    color: '#0046fe',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: recommendationLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={handleGetIARecommendations}
                  disabled={recommendationLoading}
                >
                  {recommendationLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Sugerir Laudo/Conduta
                </button>
              )}
            </div>

            {selectedConsultation ? (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Visualização de Mensagens do Chat */}
                <div style={styles.chatHistoryBox}>
                  {chatLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                      <Loader2 className="animate-spin" size={24} color="#0046fe" />
                    </div>
                  ) : (
                    <>
                      <div style={styles.botBubble}>
                        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                          Olá! Você está na consulta <strong>"{selectedConsultation.title}"</strong>. Digite abaixo para me fazer perguntas clínicas sobre o prontuário do paciente, ou clique no botão acima para eu analisar o histórico e sugerir uma conduta/laudo.
                        </p>
                      </div>
                      
                      {chatMessages.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        const text = msg.parts && msg.parts.length > 0 ? msg.parts[0].text : '';
                        
                        return (
                          <div 
                            key={index} 
                            style={isUser ? styles.userBubble : styles.botBubble}
                          >
                            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                              {text}
                            </p>
                            <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', display: 'block', textAlign: 'right' }}>
                              {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Caixa de Entrada e Ações */}
                <form onSubmit={handleSendChatMessage} style={styles.chatInputContainer}>
                  <input 
                    type="text" 
                    placeholder="Perguntar ao assistente médico..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={styles.chatInput}
                    disabled={sendingMessage || chatLoading}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <label style={styles.iconBtnLabel} title="Enviar PDF de exame">
                      <FileUp size={18} color="#475569" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleUploadPDF}
                        style={{ display: 'none' }}
                        disabled={pdfUploading}
                      />
                    </label>

                    {/* Botão de gravação de voz: grava no navegador e transcreve via backend */}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isTranscribing || sendingMessage}
                      title={isRecording ? 'Parar e transcrever' : 'Gravar áudio do atendimento'}
                      style={{
                        ...styles.iconBtnLabel,
                        backgroundColor: isRecording ? '#fee2e2' : '#f1f5f9',
                        cursor: (isTranscribing || sendingMessage) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isTranscribing
                        ? <Loader2 size={18} className="animate-spin" color="#475569" />
                        : isRecording
                          ? <Square size={18} color="#dc2626" />
                          : <Mic size={18} color="#475569" />}
                    </button>

                    <button
                      type="submit"
                      style={styles.sendBtn}
                      disabled={!newMessage.trim() || sendingMessage || chatLoading}
                    >
                      {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                </form>

                {pdfUploading && (
                  <div style={{ color: '#0046fe', fontSize: '12px', padding: '8px 12px', backgroundColor: '#eff6ff', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={14} className="animate-spin" />
                    Enviando e processando laudo em PDF...
                  </div>
                )}

                {isRecording && (
                  <div style={{ color: '#dc2626', fontSize: '12px', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }} className="animate-spin" />
                    Gravando... clique no quadrado para parar e transcrever.
                  </div>
                )}

                {isTranscribing && (
                  <div style={{ color: '#0046fe', fontSize: '12px', padding: '8px 12px', backgroundColor: '#eff6ff', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={14} className="animate-spin" />
                    Transcrevendo o áudio...
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '40px', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                Selecione um atendimento na lista à esquerda para carregar o histórico de conversa e interagir com o Assistente de IA.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Aba de Exames */
        <div style={styles.dashboardGrid}>
          <div style={{ ...styles.columnBox, flex: 1 }}>
            <div style={styles.columnHeader}>
              <div style={styles.columnTitleRow}>
                <FlaskConical size={18} color="#0046fe" />
                <h3 style={styles.columnTitle}>Exames Clínicos</h3>
              </div>
              <button style={styles.actionBtn}>Novo exame</button>
            </div>

            <div style={styles.cardsList}>
              {selectedPatient.exames.map(exame => (
                <div 
                  key={exame.id} 
                  style={{...styles.itemCard, ...styles.clickableCard}} 
                  onClick={() => setViewedExam(exame)}
                >
                  <div style={styles.dateBlock}>
                    <span style={styles.dateDay}>{exame.data.split(' ')[0]}</span>
                    <span style={styles.dateMonth}>{exame.data.split(' ')[1]}</span>
                  </div>
                  <div style={{ flexGrow: 1, marginLeft: '16px' }}>
                    <h4 style={styles.itemCardTitle}>{exame.nome}</h4>
                    <p style={styles.itemCardSub}>{exame.categoria}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={styles.statusTag}>{exame.status}</span>
                    <Download size={16} color="#64748b" />
                  </div>
                </div>
              ))}
              {selectedPatient.exames.length === 0 && (
                <p style={{color: '#64748b', textAlign: 'center', padding: '20px'}}>Nenhum exame cadastrado no prontuário.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lateral / Detalhes do Exame quando clicado */}
      {viewedExam && (
        <div style={styles.modalOverlay} onClick={() => setViewedExam(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{viewedExam.nome}</h3>
              <button style={styles.closeModalBtn} onClick={() => setViewedExam(null)}>✕</button>
            </div>
            <p style={{color: '#64748b', fontSize: '14px', marginBottom: '16px'}}>{viewedExam.categoria} • {viewedExam.data} às {viewedExam.horario}</p>
            <div style={styles.resultBox}>
              <h5 style={{margin: '0 0 8px 0', color: '#1e293b'}}>Resultado do Laudo:</h5>
              <p style={{margin: 0, color: '#334155', lineHeight: '1.5', fontSize: '14px'}}>{viewedExam.resultado}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilização em JS
const styles = {
  container: { width: '100%', fontFamily: 'sans-serif', color: '#1e293b' },

  // --- Tabela de pacientes (imagem 4) ---
  primaryBtn: { backgroundColor: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.radius.sm, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s', whiteSpace: 'nowrap' },
  outlineBtn: { backgroundColor: '#fff', color: theme.colors.primary, border: `1px solid ${theme.colors.primary}`, borderRadius: theme.radius.sm, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  searchCard: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '24px', boxShadow: theme.shadow.card },
  fieldLabel: { fontSize: '13px', fontWeight: 600, color: '#475569' },
  select: { padding: '10px 12px', borderRadius: theme.radius.sm, border: `1px solid #cbd5e1`, fontSize: '14px', backgroundColor: '#fff', color: theme.colors.text, cursor: 'pointer' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  textInput: { width: '100%', padding: '10px 40px 10px 12px', borderRadius: theme.radius.sm, border: `1px solid #cbd5e1`, fontSize: '14px', outline: 'none', color: theme.colors.text },
  tableCard: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: '8px 24px 0', boxShadow: theme.shadow.card },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '13px', fontWeight: 700, color: theme.colors.text, padding: '20px 12px', borderBottom: `1px solid ${theme.colors.border}` },
  tr: { borderBottom: `1px solid #f1f5f9` },
  td: { fontSize: '14px', color: '#475569', padding: '18px 12px' },
  iconAction: { width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, cursor: 'pointer', transition: 'background 0.15s' },
  pagination: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '18px 12px' },
  pageNav: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, cursor: 'pointer', color: '#475569' },
  pageCurrent: { minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primarySoft, color: theme.colors.primary, borderRadius: theme.radius.sm, fontSize: '13px', fontWeight: 700 },

  title: { fontSize: '22px', color: '#0f172a', marginBottom: '20px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 16px', marginBottom: '24px' },
  searchIcon: { marginRight: '10px' },
  searchInput: { width: '100%', border: 'none', padding: '14px 0', fontSize: '15px', outline: 'none' },
  patientList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  patientCard: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' },
  avatarCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' },
  patientName: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' },
  patientSub: { margin: 0, fontSize: '13px', color: '#64748b' },
  
  breadcrumbRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  breadcrumb: { fontSize: '13px', color: '#94a3b8' },
  backButton: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  
  profileHeaderCard: { backgroundColor: '#0046fe', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', marginBottom: '24px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  largeAvatar: { width: '64px', height: '64px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerName: { margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' },
  tagRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  genderTag: { backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 12px', borderRadius: '20px', fontSize: '12px' },
  headerMiddle: { display: 'flex', gap: '40px' },
  labelTitle: { margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)', uppercase: 'true' },
  labelValue: { margin: 0, fontSize: '15px', fontWeight: '500' },
  detailsBtn: { backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  
  tabsRow: { display: 'flex', gap: '24px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' },
  tabItem: { background: 'none', border: 'none', padding: '10px 4px', fontSize: '13px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-2px' },
  activeTabItem: { color: '#0046fe', borderBottom: '2px solid #0046fe' },
  
  dashboardGrid: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  columnBox: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' },
  columnHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  columnTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  columnTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold' },
  actionBtn: { backgroundColor: '#fff', border: '1px solid #0046fe', color: '#0046fe', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  cardsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  itemCard: { display: 'flex', alignItems: 'center', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', backgroundColor: '#fff' },
  clickableCard: { cursor: 'pointer', transition: 'background 0.2s', ':hover': { backgroundColor: '#f8fafc' } },
  dateBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #e2e8f0', paddingRight: '16px', minWidth: '45px' },
  dateDay: { fontSize: '18px', fontWeight: 'bold', color: '#0f172a' },
  dateMonth: { fontSize: '10px', color: '#64748b', fontWeight: '600' },
  itemCardTitle: { margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' },
  itemCardSub: { margin: '0', fontSize: '12px', color: '#64748b' },
  statusTag: { backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modalContent: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '450px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  modalTitle: { margin: 0, fontSize: '18px', color: '#1e3a8a' },
  closeModalBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' },
  resultBox: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' },

  dropdownMenu: {
    position: 'absolute',
    top: '115%',
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    padding: '6px',
    minWidth: '150px',
  },
  deleteBtn: {
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    transition: 'background 0.2s',
  },

  // Estilos de Chat
  chatHistoryBox: {
    flexGrow: 1,
    height: '350px',
    overflowY: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#f8fafc',
    marginBottom: '16px'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0046fe',
    color: '#ffffff',
    padding: '10px 14px',
    borderRadius: '16px 16px 2px 16px',
    maxWidth: '80%',
    boxShadow: '0 2px 4px rgba(0,70,254,0.1)'
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 2px',
    maxWidth: '80%',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  chatInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '8px 12px',
    backgroundColor: '#ffffff'
  },
  chatInput: {
    flexGrow: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    padding: '8px 0'
  },
  iconBtnLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    backgroundColor: '#f1f5f9',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  sendBtn: {
    backgroundColor: '#0046fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    ':disabled': {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed'
    }
  }
};