import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PacienteView from './components/PacienteView';
import CadastroView from './components/CadastroView';
import Login from './components/Login';
import HomeView from './components/HomeView';
import NovoAtendimentoView from './components/NovoAtendimentoView';

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
  const [pacientes, setPacientes] = useState([
    { id: '1', nome: 'Maria Silva', cpf: '123.456.789-00', idade: '32 anos', sexo: 'F' },
  { id: '2', nome: 'João Santos', cpf: '987.654.321-00', idade: '45 anos', sexo: 'M' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSelectPatientFromHome = (patientId) => {
    setActivePatientId(patientId);
    setCurrentView('pacientes');
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
      const response = await fetch('http://localhost:3001/api/all-patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        // Mapeia os dados básicos recebidos da listagem geral
        // Os detalhes completos (como idade, cpf e sexo) serão carregados individualmente
        // quando um paciente específico for clicado.
        setPacientes(data.patients.map(p => ({
          id: p.id,
          nome: p.name,
          cpf: 'Carregando...',
          idade: '',
          sexo: '',
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
    if (token) {
      fetchPacientes();
    }
  }, [token, fetchPacientes]);

  const handleAddPaciente = async (novoPaciente) => {
    try {
      const response = await fetch('http://localhost:3001/api/patients', {
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
        fetchPacientes(); // Atualiza a lista geral
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
        const response = await fetch(`http://localhost:3001/api/patients/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          fetchPacientes(); // Atualiza a lista geral
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

    const [menuCollapsed, setMenuCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
    <Sidebar 
  currentView={currentView} 
  onViewChange={setCurrentView} 
  onLogout={handleLogout}
  // Adicione estas duas linhas abaixo:
  collapsed={menuCollapsed}
  onToggleCollapse={() => setMenuCollapsed(!menuCollapsed)}
/>

     <main style={{ 
  marginLeft: menuCollapsed ? '80px' : '220px', 
  flexGrow: 1, 
  padding: '40px',
  transition: 'margin-left 0.2s ease'
}}>
        {currentView === 'home' && (
          <HomeView 
            pacientes={pacientes}
            onViewChange={(view) => {
              if (view !== 'pacientes') {
                setActivePatientId(null);
              }
              setCurrentView(view);
            }}
            onSelectPatient={handleSelectPatientFromHome}
            profileName={profileName}
          />
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
        
        {currentView === 'atendimentos' && (
          <NovoAtendimentoView 
          patientId={activePatientId} 
          pacientes={pacientes}                              
          token={token}       
          onVoltar={() => setCurrentView('pacientes')} 
          onAddNewPatient={() => setCurrentView('cadastro')}
          />
        )}

        {currentView !== 'home' && currentView !== 'pacientes' && currentView !== 'search' && currentView !== 'cadastro' && currentView !== 'atendimentos' && (
          <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h1 style={{ color: '#1e3a8a', marginBottom: '10px' }}>{currentView.toUpperCase()}</h1>
            <p style={{ color: '#64748b' }}>Esta tela está em desenvolvimento ou serve como demonstração.</p>
          </div>
        )}
      </main>
    </div>
  );

}

export default App;