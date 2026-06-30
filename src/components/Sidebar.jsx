import {
  LayoutDashboard, Users, Calendar, Sparkles, ClipboardList,
  FolderClosed, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import theme from '../theme';
import logoCopilot from '../assets/logo_copilot_med.png';

// Itens do menu, na mesma ordem das telas de referência (imagens 2-11)
const menuItems = [
  { id: 'home',         icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'pacientes',    icon: Users,           label: 'Pacientes' },
  { id: 'agendamentos', icon: Calendar,        label: 'Agendamentos' },
  { id: 'analise-ia',   icon: Sparkles,        label: 'Análise com IA' },
  { id: 'atendimentos', icon: ClipboardList,   label: 'Atendimentos' },
  { id: 'prontuarios',  icon: FolderClosed,    label: 'Prontuários' },
  { id: 'relatorios',   icon: BarChart3,       label: 'Relatórios' },
  { id: 'configuracoes', icon: Settings,       label: 'Configurações' },
];

function Sidebar({ currentView, onViewChange, onLogout, collapsed, onToggleCollapse }) {
  const width = collapsed ? theme.layout.sidebarCollapsed : theme.layout.sidebarWidth;

  return (
    <aside style={{ ...styles.sidebar, width }}>
      {/* Logo / Marca */}
      <div style={{ ...styles.logoRow, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <img src={logoCopilot} alt="Copilot Médico" style={styles.logoImg} />
        {!collapsed && (
          <span style={styles.logoText}>Copilot Médico</span>
        )}
      </div>

      {/* Navegação */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                ...styles.navButton,
                justifyContent: collapsed ? 'center' : 'flex-start',
                backgroundColor: isActive ? theme.colors.primarySoft : 'transparent',
                color: isActive ? theme.colors.primary : '#475569',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={20} color={isActive ? theme.colors.primary : '#475569'} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Rodapé: Recolher + Sair */}
      <div style={styles.footer}>
        <button
          onClick={onLogout}
          title="Sair"
          style={{ ...styles.navButton, justifyContent: collapsed ? 'center' : 'flex-start', color: '#475569' }}
        >
          <LogOut size={20} color="#475569" />
          {!collapsed && <span>Sair</span>}
        </button>

        <button
          onClick={onToggleCollapse}
          style={{ ...styles.collapseBtn, justifyContent: collapsed ? 'center' : 'flex-start' }}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={18} color="#64748b" /> : <ChevronLeft size={18} color="#64748b" />}
          {!collapsed && <span>Recolher menu</span>}
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.2s ease',
    zIndex: 20,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 8px',
    marginBottom: '28px',
    minHeight: '40px',
  },
  logoImg: { width: '34px', height: '34px', borderRadius: '8px', objectFit: 'contain' },
  logoText: { fontSize: '17px', fontWeight: 700, color: theme.colors.text, whiteSpace: 'nowrap' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    border: 'none',
    background: 'none',
    padding: '11px 12px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
    textAlign: 'left',
  },
  footer: { display: 'flex', flexDirection: 'column', gap: '4px', borderTop: `1px solid ${theme.colors.border}`, paddingTop: '12px' },
  collapseBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    border: 'none',
    background: 'none',
    padding: '11px 12px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontSize: '13px',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
};

export default Sidebar;