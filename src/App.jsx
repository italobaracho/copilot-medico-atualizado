import { useState } from 'react';
import Sidebar from './components/Sidebar';
import PacienteView from './components/PacienteView';
import CadastroView from './components/CadastroView'; 

// Movemos os dados iniciais para cá
const DADOS_INICIAIS = [
  {
    id: '1',
    nome: 'ADNIELLE MARIA APARECIDA DA SILVA PEREIRA',
    idade: '39 anos',
    sexo: 'Feminino',
    cpf: '000.000.000-00',
    atendimentos: [],
    exames: []
  }
];

function App() {
  const [currentView, setCurrentView] = useState('pacientes');
  const [pacientes, setPacientes] = useState(DADOS_INICIAIS); // Estado global da lista

  // Função para adicionar o novo paciente vindo do formulário
  const handleAddPaciente = (novoPaciente) => {
    setPacientes([novoPaciente, ...pacientes]);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main style={{ marginLeft: '80px', flexGrow: 1, padding: '40px' }}>
        {currentView === 'pacientes' && (
          <PacienteView pacientes={pacientes} /> 
        )}

        {currentView === 'cadastro' && (
          <CadastroView 
            onAddPaciente={handleAddPaciente} 
            onVoltar={() => setCurrentView('pacientes')} 
          />
        )}

        {currentView !== 'pacientes' && currentView !== 'cadastro' && (
          <div style={{ fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#1e3a8a' }}>Outra Tela</h1>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;