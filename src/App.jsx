// src/App.jsx
import { useState } from 'react';
// Ajustamos o caminho aqui para apontar para a pasta que você criou!
import Sidebar from './components/Sidebar'; 

function App() { // Mudamos o nome para 'App' para o Vite reconhecer como a tela principal
  const [currentView, setCurrentView] = useState('pacientes');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* O menu lateral fixo */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Conteúdo Principal (Aba de Exames / Ficha do Paciente) */}
      <main style={{ marginLeft: '80px', flexGrow: 1, padding: '40px' }}>
        {/* Aqui entra o Header Azul com os dados da Adnielle */}
        {/* E aqui entram os cards de Atendimentos e Exames */}
        <h1 style={{ color: '#1e3a8a', fontFamily: 'sans-serif' }}>Visualização de Exames</h1>
      </main>
    </div>
  );
}

export default App;