import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import theme from '../theme';

// Tela "Novo paciente" (imagem 5).
// OBS PARA O TIME: hoje o backend só persiste nome, cpf, idade e sexo.
// Os campos telefone, e-mail, endereço e observações já estão na UI;
// quando o endpoint POST /api/patients aceitar esses campos, basta
// incluí-los no corpo enviado (ver // TODO BACKEND no App.jsx).
export default function CadastroView({ onAddPaciente, onVoltar }) {
  const [form, setForm] = useState({
    nome: '', cpf: '', sexo: '', nascimento: '',
    telefone: '', email: '', endereco: '', observacoes: '',
  });

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  // Calcula a idade a partir da data de nascimento (para compatibilizar com o backend)
  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return '';
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade >= 0 ? String(idade) : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.cpf || !form.sexo) {
      return alert('Preencha os campos obrigatórios: Nome, CPF e Gênero.');
    }

    onAddPaciente({
      id: Date.now().toString(),
      nome: form.nome.toUpperCase(),
      cpf: form.cpf,
      idade: `${calcularIdade(form.nascimento)} anos`,
      sexo: form.sexo,
      telefone: form.telefone,
      email: form.email,
      endereco: form.endereco,
      observacoes: form.observacoes,
      atendimentos: [],
      exames: [],
    });
    alert('Paciente cadastrado com sucesso!');
    onVoltar();
  };

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <h1 style={styles.title}>Novo paciente</h1>
      <p style={styles.subtitle}>Cadastre as informações principais do paciente.</p>

      {/* Breadcrumb */}
      <p style={styles.breadcrumb}>
        <span style={{ color: theme.colors.primary, fontWeight: 600 }}>Home</span> &gt; Pacientes &gt; Novo paciente
      </p>

      <div style={styles.card}>
        <button type="button" style={styles.backLink} onClick={onVoltar}>
          <ArrowLeft size={16} /> Voltar para pacientes
        </button>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <Field label="Nome completo" required>
              <input style={styles.input} placeholder="Digite o nome completo" value={form.nome} onChange={set('nome')} />
            </Field>
            <Field label="CPF" required>
              <input style={styles.input} placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf')} />
            </Field>
            <Field label="Gênero" required>
              <select style={styles.input} value={form.sexo} onChange={set('sexo')}>
                <option value="">Selecione</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </Field>
            <Field label="Data de nascimento">
              <input type="date" style={styles.input} value={form.nascimento} onChange={set('nascimento')} />
            </Field>
            <Field label="Telefone">
              <input style={styles.input} placeholder="(00) 00000-0000" value={form.telefone} onChange={set('telefone')} />
            </Field>
            <Field label="E-mail">
              <input type="email" style={styles.input} placeholder="email@exemplo.com" value={form.email} onChange={set('email')} />
            </Field>
          </div>

          <div style={{ marginTop: '18px' }}>
            <Field label="Endereço">
              <input style={styles.input} placeholder="Rua, número, bairro, cidade" value={form.endereco} onChange={set('endereco')} />
            </Field>
          </div>

          <div style={{ marginTop: '18px' }}>
            <Field label="Observações">
              <textarea
                style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
                placeholder="Digite observações importantes sobre o paciente"
                value={form.observacoes}
                onChange={set('observacoes')}
              />
            </Field>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.outlineBtn} onClick={onVoltar}>Cancelar</button>
            <button type="submit" style={styles.submitBtn}>Salvar paciente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: theme.colors.danger }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const styles = {
  container: { width: '100%', maxWidth: '960px', fontFamily: 'system-ui, sans-serif' },
  title: { fontSize: '28px', fontWeight: 800, color: theme.colors.text, margin: 0 },
  subtitle: { color: theme.colors.textMuted, fontSize: '14px', margin: '6px 0 0 0' },
  breadcrumb: { fontSize: '13px', color: theme.colors.textMuted, margin: '20px 0' },
  card: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, padding: '24px', boxShadow: theme.shadow.card },
  backLink: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: theme.colors.primary, fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 600, color: '#334155' },
  input: { padding: '11px 12px', borderRadius: theme.radius.sm, border: `1px solid #cbd5e1`, fontSize: '14px', outline: 'none', width: '100%', color: theme.colors.text, backgroundColor: '#fff' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' },
  outlineBtn: { backgroundColor: '#fff', color: '#475569', border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, padding: '11px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  submitBtn: { backgroundColor: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.radius.sm, padding: '11px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
};
