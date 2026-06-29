import { useState, useEffect } from 'react';
import { 
  Search, User, ArrowLeft, Stethoscope, 
  FlaskConical, FileText, Download, ChevronRight, Play,
  Send, Sparkles, FileUp, Loader2, Plus, Eye, Pencil, Trash2
} from 'lucide-react';

export default function PacientesView({ pacientes, onDeletePaciente, token, mode = 'list', activePatientId, onClearActivePatient, onAddNewPatient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetailsLoading, setPatientDetailsLoading] = useState(false);

  const [tipoBusca, setTipoBusca] = useState('CPF');
  const [termoBusca, setTermoBusca] = useState('');
  const [buscou, setBuscou] = useState(false);

  const pesquisarPaciente = () => {
    setBuscou(true);
  };

  const limparBusca = () => {
    setTermoBusca('');
    setTipoBusca('CPF');
    setBuscou(false);
  };

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

  // Filtra os pacientes pela barra de busca e tipo selecionado
  const termoNormalizado = termoBusca.trim().toLowerCase();
  
  const filteredPatients = pacientes.filter(p => {
    // Se ainda não buscou e estamos na tela de busca por prontuário, não mostra nada por padrão
    if (!buscou && mode === 'search') return false;
    
    // Se o termo estiver em branco e não clicou explicitamente em pesquisar
    if (!termoNormalizado) {
      return !buscou ? (mode === 'list') : true;
    }
    
    if (tipoBusca === 'CPF') {
      return p.cpf.toLowerCase().includes(termoNormalizado);
    }
    return p.nome.toLowerCase().includes(termoNormalizado);
  });

  // Função para buscar dados completos do paciente
  const fetchPatientDetails = async (patientId) => {
    setPatientDetailsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/patients/${patientId}`, {
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
    const title = prompt('Digite o título ou motivo do novo atendimento:', `Consulta em ${new Date().toLocaleDateString('pt-BR')}`);
    if (!title) return;

    try {
      const response = await fetch(`http://localhost:3001/api/patients/${selectedPatient.id}/consultations`, {
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
      const response = await fetch(`http://localhost:3001/api/patients/${patientId}/consultations/${consultationId}/history`, {
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
      const response = await fetch('http://localhost:3001/api/chat', {
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
      const response = await fetch('http://localhost:3001/api/recommendations', {
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
      const response = await fetch('http://localhost:3001/api/upload-pdf', {
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

  // VISTA 1: Painel do Médico de Pacientes e Busca (Inspirado no layout da equipe)
  if (!selectedPatient) {
    return (
      <div style={styles.container}>
        {/* Cabeçalho superior: Título, Descrição e Ações */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              {mode === 'search' ? 'Busca de Prontuários' : 'Pacientes'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
              Consulte e gerencie as informações e histórico médico dos pacientes.
            </p>
            <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>
              Home &gt; {mode === 'search' ? 'Busca' : 'Pacientes'}
            </div>
          </div>
          {mode === 'list' && onAddNewPatient && (
            <button 
              onClick={onAddNewPatient}
              style={{
                backgroundColor: '#0046fe',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,70,254,0.1)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003cd0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0046fe'}
            >
              <Plus size={16} /> Novo paciente
            </button>
          )}
        </div>

        {/* Card de Pesquisa Avançada */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-end',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Buscar por</label>
            <select
              value={tipoBusca}
              onChange={(e) => {
                setTipoBusca(e.target.value);
                setTermoBusca('');
                setBuscou(false);
              }}
              style={{
                height: '48px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0 16px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="CPF">CPF</option>
              <option value="Nome">Nome</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Buscar paciente</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={tipoBusca === 'CPF' ? 'Digite o CPF do paciente...' : 'Digite o nome do paciente...'}
                value={termoBusca}
                onChange={(e) => {
                  setTermoBusca(e.target.value);
                  if (e.target.value === '') {
                    setBuscou(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    pesquisarPaciente();
                  }
                }}
                style={{
                  height: '48px',
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0 16px 0 44px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px' }} />
            </div>
          </div>

          <button 
            onClick={pesquisarPaciente}
            style={{
              height: '48px',
              border: 'none',
              backgroundColor: '#0046fe',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0 24px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,70,254,0.1)',
            }}
          >
            <Search size={16} /> Pesquisar
          </button>

          <button 
            onClick={limparBusca}
            style={{
              height: '48px',
              border: '1px solid #0046fe',
              backgroundColor: '#ffffff',
              color: '#0046fe',
              borderRadius: '8px',
              padding: '0 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Limpar
          </button>
        </div>

        {/* Lista e Tabela de Pacientes */}
        {patientDetailsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="#0046fe" />
          </div>
        ) : (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>CPF</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Nome</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Gênero</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {!buscou && mode === 'search' ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      Digite um CPF ou nome de paciente e clique em Pesquisar para consultar o prontuário.
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      Nenhum paciente correspondente encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map(p => (
                    <tr 
                      key={p.id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      onClick={() => fetchPatientDetails(p.id)}
                    >
                      <td style={{ padding: '18px 24px', fontSize: '14px', color: '#334155' }}>
                        {p.cpf !== 'Carregando...' ? p.cpf : 'Prontuário ativo'}
                      </td>
                      <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                        {p.nome}
                      </td>
                      <td style={{ padding: '18px 24px', fontSize: '14px', color: '#64748b' }}>
                        {p.sexo || 'Não informado'}
                      </td>
                      <td style={{ padding: '18px 24px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button 
                            title="Editar paciente"
                            onClick={() => fetchPatientDetails(p.id)}
                            style={{ background: 'none', border: 'none', color: '#0046fe', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            title="Visualizar prontuário"
                            onClick={() => fetchPatientDetails(p.id)}
                            style={{ background: 'none', border: 'none', color: '#0046fe', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            title="Excluir registro"
                            onClick={() => onDeletePaciente(p.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Paginação visual do rodapé */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              fontSize: '13px',
              color: '#64748b'
            }}>
              <span>
                {filteredPatients.length} resultado{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>10 por página</span>
              </div>
            </div>
          </div>
        )}
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