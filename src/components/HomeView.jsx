import { Users, FileText, Activity, Search, PlusCircle, ChevronRight, Stethoscope } from 'lucide-react';

export default function HomeView({ pacientes, onViewChange, onSelectPatient, profileName }) {
  const totalPacientes = pacientes.length;
  
  // Obter data atual formatada em português
  const formatCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('pt-BR', options);
  };

  // Pegar os 3 pacientes mais recentes (últimos adicionados)
  const recentes = pacientes.slice(-3).reverse();

  return (
    <div style={styles.container}>
      {/* Cabeçalho de Boas-Vindas */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcomeTitle}>Olá, Dr. Copilot! 👋</h1>
          <p style={styles.subtitle}>{formatCurrentDate()}</p>
        </div>
        <div style={styles.profileBadge}>
          <span style={styles.profileIndicator}></span>
          <span style={styles.profileText}>{profileName || 'Médico'}</span>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, backgroundColor: '#eff6ff' }}>
            <Users size={24} color="#0046fe" />
          </div>
          <div>
            <p style={styles.statLabel}>Total de Pacientes</p>
            <h3 style={styles.statValue}>{totalPacientes}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, backgroundColor: '#f0fdf4' }}>
            <FileText size={24} color="#15803d" />
          </div>
          <div>
            <p style={styles.statLabel}>Consultas Hoje</p>
            <h3 style={styles.statValue}>8</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, backgroundColor: '#faf5ff' }}>
            <Activity size={24} color="#7e22ce" />
          </div>
          <div>
            <p style={styles.statLabel}>Exames Analisados</p>
            <h3 style={styles.statValue}>14</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconCircle, backgroundColor: '#fff7ed' }}>
            <Stethoscope size={24} color="#c2410c" />
          </div>
          <div>
            <p style={styles.statLabel}>Status do Copilot</p>
            <h3 style={{ ...styles.statValue, color: '#15803d', fontSize: '18px', marginTop: '6px' }}>Online</h3>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <h2 style={styles.sectionTitle}>Ações Rápidas</h2>
      <div style={styles.actionsGrid}>
        <div 
          style={styles.actionCard} 
          onClick={() => onViewChange('cadastro')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = '#bfdbfe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <div style={styles.actionIconContainer}>
            <PlusCircle size={28} color="#0046fe" />
          </div>
          <div>
            <h4 style={styles.actionTitle}>Cadastrar Paciente</h4>
            <p style={styles.actionDesc}>Adicione um novo prontuário ao sistema.</p>
          </div>
        </div>

        <div 
          style={styles.actionCard} 
          onClick={() => onViewChange('search')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = '#bfdbfe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <div style={styles.actionIconContainer}>
            <Search size={28} color="#0046fe" />
          </div>
          <div>
            <h4 style={styles.actionTitle}>Buscar Prontuário</h4>
            <p style={styles.actionDesc}>Pesquise por nome ou CPF com IA assistente.</p>
          </div>
        </div>
      </div>

      {/* Pacientes Recentes */}
      <h2 style={styles.sectionTitle}>Adicionados Recentemente</h2>
      <div style={styles.recentList}>
        {recentes.map(p => (
          <div 
            key={p.id} 
            style={styles.recentCard} 
            onClick={() => onSelectPatient(p.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={styles.recentInfo}>
              <div style={styles.avatarMini}>
                <span style={styles.avatarInitial}>{p.nome.charAt(0)}</span>
              </div>
              <div>
                <h4 style={styles.recentName}>{p.nome}</h4>
                <p style={styles.recentCpf}>{p.cpf !== 'Carregando...' ? `CPF: ${p.cpf}` : 'Prontuário de teste'}</p>
              </div>
            </div>
            <div style={styles.recentAction}>
              <span style={styles.actionText}>Ver Prontuário</span>
              <ChevronRight size={18} color="#0046fe" />
            </div>
          </div>
        ))}
        {totalPacientes === 0 && (
          <p style={styles.emptyText}>Nenhum paciente cadastrado no momento. Comece cadastrando um acima!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '10px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0',
    textTransform: 'capitalize',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    padding: '8px 16px',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  profileIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  profileText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    textTransform: 'capitalize',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '4px 0 0 0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '16px',
    marginTop: '32px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: '1px solid #e2e8f0',
  },
  actionIconContainer: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: 0,
  },
  actionDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    border: '1px solid #e2e8f0',
  },
  recentCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  recentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarMini: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#0046fe',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  recentName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  recentCpf: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  recentAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionText: {
    fontSize: '13px',
    color: '#0046fe',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    padding: '24px 0',
    fontSize: '14px',
    margin: 0,
  }
};
