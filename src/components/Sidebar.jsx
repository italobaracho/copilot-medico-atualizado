import { 
  Search, Home, User2, FileText, Activity, 
  BarChart2, Users, Code, Lock, HelpCircle, LogOut 
} from 'lucide-react';

function Sidebar({ currentView, onViewChange, onLogout }) {
  // Lista de itens do menu central
  const menuItems = [
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'pacientes', icon: User2, label: 'Pacientes' }, // Este está ativo na imagem
    { id: 'atendimentos', icon: FileText, label: 'Atendimentos' },
    { id: 'clinica', icon: Activity, label: 'Clínica' },
    { id: 'metricas', icon: BarChart2, label: 'Métricas' },
    { id: 'equipe', icon: Users, label: 'Equipe' },
    { id: 'api', icon: Code, label: 'API' },
    { id: 'seguranca', icon: Lock, label: 'Segurança' },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Bloco Superior: Logo */}
      <div style={styles.logoContainer}>
        <button 
          onClick={() => onViewChange('cadastro')} // O clique avisa o App.jsx para mudar de tela
          style={{ ...styles.navButton, ...styles.logoCircle }} // Reaproveita os estilos visuais da bolinha azul
          title="Cadastrar Novo Paciente"
        >
          <span style={styles.logoPlus}>+</span>
        </button>
      </div>

      {/* Bloco Central: Navegação */}
      <nav style={styles.navMenu}>
        {menuItems.map((item) => {
  const Icon = item.icon;
  const isActive = currentView === item.id;
  
  return (
    <button
      key={item.id}
      onClick={() => onViewChange(item.id)}
      style={{
        ...styles.navButton,
        // Se estiver ativo, aplica o fundo azul claro. Se não, fica transparente.
        backgroundColor: isActive ? '#eff6ff' : 'transparent', 
      }}
      title={item.label}
    >
      {/* O ícone fica azul se ativo, ou cinza escuro/azulado se inativo */}
      <Icon size={22} color={isActive ? '#0046fe' : '#475569'} />
    </button>
  );
})}
      </nav>

      {/* Bloco Inferior: Suporte e Sair */}
      <div style={styles.footerMenu}>
        <button style={styles.navButton} title="Ajuda">
          <HelpCircle size={22} color="#64748b" />
        </button>
        <button style={styles.navButton} onClick={onLogout} title="Sair">
          <LogOut size={22} color="#64748b" />
        </button>
      </div>
    </aside>
  );
}

// Estilos rápidos para alinhar com o design da imagem
const styles = {
  sidebar: {
    width: '80px',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'between',
    padding: '24px 0',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    backgroundColor: '#0046fe',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlus: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    flexGrow: 1,
  },
  footerMenu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeButton: {
    backgroundColor: '#eff6ff', // Azul bem claro de fundo
  },
};

export default Sidebar;