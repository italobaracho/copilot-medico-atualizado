import { useState } from 'react';
import Sidebar from './components/Sidebar';
import PacienteView from './components/PacienteView'; 

function App() {
  const [currentView, setCurrentView] = useState('pacientes');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* O menu lateral fixo */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Conteúdo Dinâmico com base no menu lateral */}
      <main style={{ marginLeft: '80px', flexGrow: 1, padding: '40px' }}>
        {currentView === 'pacientes' ? (
          <PacienteView />
        ) : (
          <div style={{ fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#1e3a8a' }}>Outra Tela</h1>
            <p style={{ color: '#64748b' }}>Você clicou em uma aba que ainda está em desenvolvimento.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;