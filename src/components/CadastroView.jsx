import { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function CadastroView({ onAddPaciente, onVoltar }) {
  const [nome, setNome] = useState('');
  const [cpf, setCPF] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('Feminino');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !cpf || !idade) return alert('Preencha todos os campos!');

    // Cria o novo objeto do paciente no formato do seu banco/mock
    const novoPaciente = {
      id: Date.now().toString(), // Gera um ID único simples
      nome: nome.toUpperCase(),
      idade: `${idade} anos`,
      sexo,
      cpf,
      atendimentos: [],
      exames: []
    };

    onAddPaciente(novoPaciente); // Adiciona na lista global
    alert('Paciente cadastrado com sucesso!');
    onVoltar(); // Volta para a tela de listagem/busca
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#1e3a8a' }}>Cadastrar Novo Paciente</h2>
        <button style={styles.backButton} onClick={onVoltar}>
          <ArrowLeft size={16} /> Voltar para Busca
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome Completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={styles.input} placeholder="Ex: João da Silva" />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>CPF</label>
            <input type="text" value={cpf} onChange={e => setCPF(e.target.value)} style={styles.input} placeholder="000.000.000-00" />
          </div>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Idade</label>
            <input type="number" value={idade} onChange={e => setIdade(e.target.value)} style={styles.input} placeholder="Ex: 39" />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Sexo</label>
          <select value={sexo} onChange={e => setSexo(e.target.value)} style={styles.input}>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <button type="submit" style={styles.submitBtn}>
          <UserPlus size={18} /> Salvar Cadastro
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { width: '100%', maxWidth: '600px', fontFamily: 'sans-serif' },
  form: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#475569' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
  submitBtn: { backgroundColor: '#0046fe', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  backButton: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }
};
