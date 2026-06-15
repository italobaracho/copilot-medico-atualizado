import { useState } from 'react';
import { 
  Search, User, ArrowLeft, Stethoscope, 
  FlaskConical, FileText, Download, ChevronRight, Play 
} from 'lucide-react';

export default function PacientesView({ pacientes, onDeletePaciente }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('atendimentos');
  const [viewedExam, setViewedExam] = useState(null); // Estado para o modal do exame
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);

  // Filtra os pacientes pela barra de busca
  const filteredPatients = pacientes.filter(p => 
  p.nome.toLowerCase().includes(searchQuery.toLowerCase()) || p.cpf.includes(searchQuery)
);

  // VISTA 1: Barra de Pesquisa de Pacientes
  if (!selectedPatient) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Buscar Paciente</h2>
        <div style={styles.searchBox}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Digite o nome ou CPF do paciente..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.patientList}>
          {filteredPatients.map(p => (
            <div key={p.id} style={styles.patientCard} onClick={() => setSelectedPatient(p)}>
              <div style={styles.avatarCircle}><User size={20} color="#0046fe" /></div>
              <div>
                <h4 style={styles.patientName}>{p.nome}</h4>
                <p style={styles.patientSub}>CPF: {p.cpf} • {p.idade}</p>
              </div>
            </div>
          ))}
          {filteredPatients.length === 0 && <p style={{color: '#64748b'}}>Nenhum paciente encontrado.</p>}
        </div>
      </div>
    );
  }

  // VISTA 2: Prontuário do Paciente Selecionado (Igual à imagem)
  return (
    <div style={styles.container}>
      {/* Caminho / Breadcrumb + Botão Voltar */}
      <div style={styles.breadcrumbRow}>
        <span style={styles.breadcrumb}>Home &gt; Pacientes &gt; <span style={{color: '#1e293b'}}>Paciente {selectedPatient.cpf}</span></span>
        <button style={styles.backButton} onClick={() => { setSelectedPatient(null); setViewedExam(null); setShowDetailsMenu(false); }}>
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
              <span style={styles.infoText}>{selectedPatient.idade}</span>
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

  {/* Menu Dropdown que aparece ao clicar */}
  {showDetailsMenu && (
    <div style={styles.dropdownMenu}>
      <button 
        style={styles.deleteBtn} 
        onClick={() => {
          onDeletePaciente(selectedPatient.id); // Deleta do estado global
          setSelectedPatient(null);             // Fecha o prontuário e volta para a busca
          setShowDetailsMenu(false);            // Fecha o menu
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
          ATENDIMENTOS
        </button>
        <button 
          style={{...styles.tabItem, ...(activeTab === 'exames' ? styles.activeTabItem : {})}}
          onClick={() => setActiveTab('exames')}
        >
          EXAMES
        </button>
      </div>

      {/* Layout de Duas Colunas (Timeline + Lista de Exames) */}
      <div style={styles.dashboardGrid}>
        
        {/* Coluna da Esquerda: Atendimentos */}
        <div style={styles.columnBox}>
          <div style={styles.columnHeader}>
            <div style={styles.columnTitleRow}>
              <Stethoscope size={18} color="#0046fe" />
              <h3 style={styles.columnTitle}>Atendimentos</h3>
            </div>
            <button style={styles.actionBtn}>Novo atendimento</button>
          </div>

          <div style={styles.cardsList}>
            {selectedPatient.atendimentos.map(atend => (
              <div key={atend.id} style={styles.itemCard}>
                <div style={styles.dateBlock}>
                  <span style={styles.dateDay}>{atend.data.split(' ')[0]}</span>
                  <span style={styles.dateMonth}>{atend.data.split(' ')[1]}</span>
                </div>
                <div style={{ flexGrow: 1, marginLeft: '16px' }}>
                  <h4 style={styles.itemCardTitle}>{atend.tipo} <span style={{fontWeight: 'normal', color: '#64748b'}}>{atend.especialidade}</span></h4>
                  <p style={styles.itemCardSub}>{atend.medico}</p>
                  <div style={styles.audioPlayerBox}>
                    <Play size={12} color="#475569" />
                    <span style={styles.audioText}>{atend.audio}</span>
                    <span style={styles.audioSize}>{atend.tamanho}</span>
                    <Download size={14} color="#64748b" style={{cursor: 'pointer', marginLeft: 'auto'}} />
                  </div>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Exames */}
        <div style={styles.columnBox}>
          <div style={styles.columnHeader}>
            <div style={styles.columnTitleRow}>
              <FlaskConical size={18} color="#0046fe" />
              <h3 style={styles.columnTitle}>Exames</h3>
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
          </div>
        </div>
      </div>

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

// Estilização em JS para bater com o layout limpo e moderno da imagem
const styles = {
  container: { width: '100%', fontFamily: 'sans-serif', color: '#1e293b' },
  title: { fontSize: '22px', color: '#0f172a', marginBottom: '20px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 16px', marginBottom: '24px' },
  searchIcon: { marginRight: '10px' },
  searchInput: { width: '100%', border: 'none', padding: '14px 0', fontSize: '15px', outline: 'none' },
  patientList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  patientCard: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' },
  avatarCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', display: 'flex', justifyContent: 'center' },
  patientName: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a' },
  patientSub: { margin: 0, fontSize: '13px', color: '#64748b' },
  
  breadcrumbRow: { display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' },
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
  
  dashboardGrid: { display: 'flex', gap: '24px' },
  columnBox: { flex: 1, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' },
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
  itemCardSub: { margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' },
  audioPlayerBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '8px', width: '220px' },
  audioText: { fontSize: '11px', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' },
  audioSize: { fontSize: '10px', color: '#94a3b8', marginLeft: 'auto' },
  statusTag: { backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' },

  // Estilos do Modal do Exame
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
    color: '#ef4444', // Vermelho
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    transition: 'background 0.2s',
  },
};