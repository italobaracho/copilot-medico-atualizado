import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PacienteView from './components/PacienteView';
import CadastroView from './components/CadastroView';
import Login from './components/Login';

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

  const [currentView, setCurrentView] = useState('pacientes');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
      />

      <main style={{ marginLeft: '80px', flexGrow: 1, padding: '40px' }}>
        {currentView === 'pacientes' && (
          <PacienteView 
            pacientes={pacientes} 
            onDeletePaciente={handleDeletePaciente}
            token={token}
          /> 
        )}

        {currentView === 'cadastro' && (
          <CadastroView 
            onAddPaciente={handleAddPaciente} 
            onVoltar={() => setCurrentView('pacientes')} 
          />
        )}

        {currentView !== 'pacientes' && currentView !== 'cadastro' && (
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