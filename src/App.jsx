import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PacienteView from './components/PacienteView';
import CadastroView from './components/CadastroView';
import Login from './components/Login';
import HomeView from './components/HomeView';
import { API_URL } from './api';
import theme from './theme';

// Telas do menu lateral que ainda não foram construídas.
// Mostram um placeholder amigável (a tela "Análise com IA" será
// implementada pelo time conforme o plano de implementação).
const PLACEHOLDER_TITLES = {
  'agendamentos': 'Agendamentos',
  'analise-ia': 'Análise com IA',
  'atendimentos': 'Atendimentos',
  'prontuarios': 'Prontuários',
  'relatorios': 'Relatórios',
  'configuracoes': 'Configurações',
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || null);

  const [currentView, setCurrentView] = useState('home');
  const [activePatientId, setActivePatientId] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const changeView = (view) => {
    if (view !== 'pacientes') setActivePatientId(null);
    setCurrentView(view);
  };

  const handleLoginSuccess = (userData, userToken, selectedProfile) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('profileName', selectedProfile);
    setToken(userToken);
    setUser(userData);
    setProfileName(selectedProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profileName');
    setToken(null);
    setUser(null);
    setProfileName(null);
    setPacientes([]);
  };

  const fetchPacientes = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/all-patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        // Mapeia os dados básicos recebidos da listagem geral.
        // Os detalhes completos (idade, cpf e sexo) são carregados
        // individualmente quando um paciente específico é aberto.
        setPacientes(data.patients.map(p => ({
          id: p.id,
          nome: p.name,
          cpf: p.cpf || 'Não informado',
          idade: '',
          sexo: p.gender || 'Não informado',
          atendimentos: [],
          exames: []
        })));
      }
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPacientes();
  }, [token, fetchPacientes]);

  const handleAddPaciente = async (novoPaciente) => {
    try {
      const response = await fetch(`${API_URL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: novoPaciente.nome,
          cpf: novoPaciente.cpf,
          idade: novoPaciente.idade.replace(' anos', ''),
          sexo: novoPaciente.sexo
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        fetchPacientes();
      } else {
        alert('Erro ao cadastrar paciente no servidor: ' + (data.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ao cadastrar paciente.');
    }
  };

  const handleDeletePaciente = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja remover este paciente do sistema?");
    if (confirmar) {
      try {
        const response = await fetch(`${API_URL}/api/patients/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          fetchPacientes();
        } else {
          alert('Erro ao remover paciente: ' + (data.message || ''));
        }
      } catch (err) {
        console.error(err);
        alert('Erro de rede ao remover paciente.');
      }
    }
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const sidebarWidth = collapsed ? theme.layout.sidebarCollapsed : theme.layout.sidebarWidth;
  const placeholderTitle = PLACEHOLDER_TITLES[currentView];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.bg }}>
      <Sidebar
        currentView={currentView}
        onViewChange={changeView}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <main
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.2s ease',
          padding: '28px 40px',
          maxWidth: '1400px',
        }}
      >
        <TopBar user={user} profileName={profileName} />

        {currentView === 'home' && (
          <HomeView user={user} onViewChange={changeView} />
        )}

        {(currentView === 'pacientes' || currentView === 'search') && (
          <PacienteView
            pacientes={pacientes}
            onDeletePaciente={handleDeletePaciente}
            token={token}
            mode={currentView === 'search' ? 'search' : 'list'}
            activePatientId={activePatientId}
            onClearActivePatient={() => setActivePatientId(null)}
            onAddNewPatient={() => setCurrentView('cadastro')}
          />
        )}

        {currentView === 'cadastro' && (
          <CadastroView
            onAddPaciente={handleAddPaciente}
            onVoltar={() => {
              setActivePatientId(null);
              setCurrentView('pacientes');
            }}
          />
        )}

        {placeholderTitle && (
          <div style={{ fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ color: theme.colors.text, marginBottom: '8px' }}>{placeholderTitle}</h1>
            <p style={{ color: theme.colors.textMuted }}>
              Esta tela está prevista no plano de implementação e será construída pelo time.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
