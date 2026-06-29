import React, { useState } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AtendimentoView({ pacientes }) {
  const [searchType, setSearchType] = useState('CPF');
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para guardar o paciente encontrado na busca
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Função executada ao clicar em "Pesquisar"
  const handleBuscar = () => {
    if (!searchQuery.trim()) {
      setPacienteSelecionado(null);
      return;
    }

    // Procura no array global de pacientes enviado pelo App.jsx
    const encontrado = pacientes.find((p) => {
      if (searchType === 'CPF') {
        // Remove pontos e traços para comparar apenas os números limpos
        return p.cpf?.replace(/\D/g, '') === searchQuery.replace(/\D/g, '');
      } else {
        return p.nome?.toLowerCase().includes(searchQuery.toLowerCase());
      }
    });

    if (encontrado) {
      setPacienteSelecionado(encontrado);
    } else {
      alert('Paciente não encontrado!');
      setPacienteSelecionado(null);
    }
  };

  const handleLimpar = () => {
    setSearchQuery('');
    setPacienteSelecionado(null);
  };

  // Pega as iniciais do nome para o círculo roxo (ex: "Maria Silva" -> "MS")
  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.split(' ');
    if (partes.length > 1) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return partes[0][0].toUpperCase();
  };

  // Dados mocados idênticos aos exibidos na imagem para efeito visual
  const historicoExemplo = [
    { id: 1, data: '08/05/2025 - 10:30', especialidade: 'Clínica Geral', medico: 'Dr. Rafael Menezes' },
    { id: 2, data: '15/04/2025 - 14:20', especialidade: 'Neurologia', medico: 'Dra. Juliana Costa' },
    { id: 3, data: '22/03/2025 - 09:15', especialidade: 'Otorrinolaringologia', medico: 'Dr. Pedro Almeida' },
    { id: 4, data: '10/02/2025 - 16:45', especialidade: 'Clínica Geral', medico: 'Dr. Rafael Menezes' },
    { id: 5, data: '05/01/2025 - 11:00', especialidade: 'Dermatologia', medico: 'Dra. Camila Rocha' },
  ];

  return (
    <div style={styles.container}>
      {/* Topo da Tela */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.mainTitle}>Atendimentos</h1>
          <p style={styles.subtitle}>Gerencie os atendimentos e consultas dos pacientes.</p>
        </div>
        <button style={styles.btnPrimary}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Novo atendimento
        </button>
      </div>

      {/* Breadcrumb descritivo */}
      <div style={styles.breadcrumb}>
        <span style={{ color: '#0046fe', cursor: 'pointer' }}>Home</span>
        <span style={{ color: '#94a3b8', margin: '0 8px' }}>&gt;</span>
        <span style={{ color: '#64748b' }}>Atendimentos</span>
      </div>

      {/* Seção 1: Buscar Paciente */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Buscar paciente</h3>
        <div style={styles.searchRow}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={styles.selectInput}
          >
            <option value="CPF">CPF</option>
            <option value="Nome">Nome</option>
          </select>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Digite o nome ou CPF do paciente"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.textInput}
            />
            <Search size={18} color="#94a3b8" style={styles.searchIconInside} />
          </div>

          <button onClick={handleBuscar} style={styles.btnSearch}>
            <Search size={16} style={{ marginRight: '6px' }} /> Pesquisar
          </button>
          <button onClick={handleLimpar} style={styles.btnClear}>
            Limpar
          </button>
        </div>
      </div>

      {/* Seção 2: Info do Paciente Selecionado */}
      {pacienteSelecionado ? (
        <div style={styles.card}>
          <div style={styles.patientProfileRow}>
            <div style={styles.patientLeftInfo}>
              <div style={styles.avatarCircle}>
                {getIniciais(pacienteSelecionado.nome)}
              </div>
              <div>
                <h4 style={styles.patientName}>{pacienteSelecionado.nome}</h4>
                <div style={styles.patientMetaRow}>
                  <span style={styles.metaItem}>
                    {pacienteSelecionado.sexo === 'M' || pacienteSelecionado.sexo?.toLowerCase() === 'masculino'
                      ? '♂ Masculino'
                      : '♀ Feminino'}
                  </span>
                  <span style={styles.metaDot}>•</span>
                  <span style={styles.metaItem}>{pacienteSelecionado.idade}</span>
                  <span style={styles.metaDot}>•</span>
                  <span style={styles.metaItem}>CPF {pacienteSelecionado.cpf}</span>
                </div>
              </div>
            </div>
            <button style={styles.btnOutlineProfile}>
              <User size={16} style={{ marginRight: '8px' }} />
              Ver perfil do paciente
            </button>
          </div>
        </div>
      ) : (
        <div style={{ ...styles.card, textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          Nenhum paciente selecionado. Busque por Nome ou CPF acima.
        </div>
      )}

      {/* Seção 3: Tabela de Atendimentos */}
      <div style={styles.cardTable}>
        <h3 style={{ ...styles.cardTitle, padding: '20px 20px 10px 20px' }}>
          Atendimentos do paciente
        </h3>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Data ↑↓</th>
              <th style={styles.th}>Especialidade ↑↓</th>
              <th style={{ ...styles.th, textAlign: 'right', paddingRight: '40px' }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {pacienteSelecionado && pacienteSelecionado.atendimentos?.length > 0 ? (
              pacienteSelecionado.atendimentos.map((item) => (
                <tr key={item.id} style={styles.tableBodyRow}>
                  <td style={styles.td}>{item.data}</td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '500', color: '#1e293b' }}>
                      {item.especialidade}
                    </span>
                    <span style={{ color: '#94a3b8', marginLeft: '30px' }}>
                      {item.medico}
                    </span>
                  </td>
                  <td style={styles.tdActions}>
                    <button style={styles.actionIconBtn} title="Visualizar">
                      <Eye size={16} color="#0046fe" />
                    </button>
                    <button style={styles.actionIconBtn} title="Editar">
                      <Edit2 size={16} color="#0046fe" />
                    </button>
                    <button style={{ ...styles.actionIconBtn, borderColor: '#fee2e2' }} title="Excluir">
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))
            ) : pacienteSelecionado ? (
              // Se o paciente foi selecionado mas não tem atendimentos na lista dele, exibe o histórico de exemplo (mock)
              historicoExemplo.map((item) => (
                <tr key={item.id} style={styles.tableBodyRow}>
                  <td style={styles.td}>{item.data}</td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '500', color: '#1e293b' }}>
                      {item.especialidade}
                    </span>
                    <span style={{ color: '#94a3b8', marginLeft: '30px' }}>
                      {item.medico}
                    </span>
                  </td>
                  <td style={styles.tdActions}>
                    <button style={styles.actionIconBtn} title="Visualizar">
                      <Eye size={16} color="#0046fe" />
                    </button>
                    <button style={styles.actionIconBtn} title="Editar">
                      <Edit2 size={16} color="#0046fe" />
                    </button>
                    <button style={{ ...styles.actionIconBtn, borderColor: '#fee2e2' }} title="Excluir">
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                  Nenhum histórico de atendimento encontrado para este paciente.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Rodapé / Paginação */}
        <div style={styles.paginationRow}>
          <span style={styles.paginationCount}>1 – 5 de 15 resultados</span>

          <div style={styles.paginationControls}>
            <select style={styles.perPageSelect} defaultValue="10">
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
            </select>

            <button style={styles.pageArrowBtn}>
              <ChevronLeft size={16} />
            </button>
            <button style={{ ...styles.pageNumberBtn, ...styles.pageNumberActive }}>
              1
            </button>
            <button style={styles.pageNumberBtn}>2</button>
            <button style={styles.pageArrowBtn}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    padding: '30px 40px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    flex: 1,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
    marginbottom: 0,
  },
  breadcrumb: {
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '25px',
    marginTop: '10px',
  },
  btnPrimary: {
    backgroundColor: '#0046fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
  },
  cardTable: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  selectInput: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: '14px',
    minWidth: '120px',
    outline: 'none',
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
  },
  textInput: {
    width: '100%',
    padding: '10px 40px 10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  searchIconInside: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  btnSearch: {
    backgroundColor: '#0046fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  btnClear: {
    backgroundColor: 'transparent',
    color: '#0046fe',
    border: '1px solid #0046fe',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  patientProfileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientLeftInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  patientName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  patientMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#64748b',
  },
  metaDot: {
    color: '#cbd5e1',
    fontSize: '12px',
  },
  btnOutlineProfile: {
    backgroundColor: 'transparent',
    color: '#0046fe',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    borderBottom: '1px solid #edf2f7',
    backgroundColor: '#fdfdfd',
  },
  th: {
    padding: '12px 20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  tableBodyRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#475569',
  },
  tdActions: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  actionIconBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  paginationCount: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  perPageSelect: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#475569',
    backgroundColor: '#ffffff',
    marginRight: '12px',
    outline: 'none',
  },
  pageArrowBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },
  pageNumberBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
  },
  pageNumberActive: {
    backgroundColor: '#eff6ff',
    color: '#0046fe',
  },
};