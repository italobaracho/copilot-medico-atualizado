# 🎨 GUIA COMPLETO DO FRONTEND - PARA APRESENTAÇÃO AO PROFESSOR

**Versão**: 1.0  
**Data**: 30 de junho de 2026  
**Projeto**: Sistema Copilot Médico  
**Autor**: Ítalo Baracho

---

## 📑 Índice

1. [Estrutura de Frontends](#estrutura-de-frontends)
2. [Frontend Principal (Sistema Completo)](#frontend-principal)
3. [Frontend Extensão (Copmed Extension)](#frontend-extensão)
4. [Arquitetura de Componentes](#arquitetura-de-componentes)
5. [Fluxo de Navegação](#fluxo-de-navegação)
6. [Como Explicar ao Professor](#como-explicar-ao-professor)

---

## 🏗️ Estrutura de Frontends

Você tem **2 frontends independentes** funcionando no projeto:

```
projeto_completo/
│
├── 📁 src/                          [FRONTEND PRINCIPAL - MÉDICO]
│   ├── App.jsx                      ← Componente raiz
│   ├── theme.js                     ← Tema centralizado
│   ├── api.js                       ← Configuração API
│   │
│   ├── components/
│   │   ├── Login.jsx                ← Tela de autenticação
│   │   ├── HomeView.jsx             ← Dashboard
│   │   ├── PacienteView.jsx         ← Gestão de pacientes (PRINCIPAL)
│   │   ├── AtendimentosView.jsx     ← Gravação de áudio
│   │   ├── AnaliseIAView.jsx        ← Chat com IA + PDF
│   │   ├── AgendamentosView.jsx     ← Calendário
│   │   ├── CadastroView.jsx         ← Novo paciente
│   │   ├── Sidebar.jsx              ← Menu lateral
│   │   └── TopBar.jsx               ← Barra superior
│   │
│   ├── utils/
│   │   └── wav.js                   ← Processamento de áudio
│   │
│   └── main.jsx                     ← Entry point React
│
└── 📁 front/copmed-extension/       [FRONTEND EXTENSÃO - RECEPÇÃO]
    ├── src/
    │   ├── App.jsx                  ← Componente raiz
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx        ← Dashboard da recepção
    │   │   ├── Pacientes.jsx        ← Listagem de pacientes
    │   │   └── NovoPaciente.jsx     ← Cadastro novo paciente
    │   │
    │   └── main.jsx                 ← Entry point React
    │
    └── package.json
```

---

## 🖥️ FRONTEND PRINCIPAL

### Localização
```
c:\Users\italo\Documents\projeto_completo\src\
```

### O que é?
**Sistema Copilot Médico Completo** - Interface para médicos gerenciarem pacientes, fazer análises com IA, gravar atendimentos e agendar consultas.

### Porta
```
5173 (Vite desenvolvimento)
```

### Componentes Principais

#### 1. **App.jsx** (Raiz da aplicação)
**Localização**: `src/App.jsx`

**O que faz**:
- Define rotas principais (home, pacientes, atendimentos, etc)
- Gerencia estado global (token, usuário, pacientes)
- Renderiza o componente correto baseado na página atual
- Controla login/logout

**Estrutura básica**:
```jsx
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('home');
  
  if (!token) return <Login />;  // Se não autenticado, mostra login
  
  return (
    <Sidebar currentView={currentView} onViewChange={setCurrentView} />
    <main>
      {currentView === 'pacientes' && <PacienteView />}
      {currentView === 'atendimentos' && <AtendimentosView />}
      {currentView === 'analise-ia' && <AnaliseIAView />}
      // ... mais telas
    </main>
  );
}
```

**Rotas controladas**:
```
home        → HomeView.jsx (Dashboard)
pacientes   → PacienteView.jsx (Gestão de pacientes)
atendimentos → AtendimentosView.jsx (Gravação de áudio)
analise-ia  → AnaliseIAView.jsx (Chat com IA)
agendamentos → AgendamentosView.jsx (Calendário)
cadastro    → CadastroView.jsx (Novo paciente)
```

---

#### 2. **Login.jsx** (Autenticação)
**Localização**: `src/components/Login.jsx`

**O que faz**:
- Exibe formulário de login
- Valida credenciais contra backend
- Gera JWT token
- Armazena token em localStorage

**Campos**:
```
Email: doctor@example.com
Senha: StrongPass123!
Perfil: [Dropdown com opções]
```

**Fluxo**:
```
Usuário digita email/senha
    ↓
Clica "Entrar"
    ↓
POST /api/auth/login
    ↓
Backend valida
    ↓
Retorna JWT Token
    ↓
localStorage.setItem('token', token)
    ↓
Redireciona para Dashboard
```

**Perfis disponíveis**:
- Médico
- Administrador
- Recepção
- Usuário

---

#### 3. **HomeView.jsx** (Dashboard)
**Localização**: `src/components/HomeView.jsx`

**O que faz**:
- Exibe resumo rápido do sistema
- Mostra próximas consultas
- Exibe últimas análises com IA
- Recomendações de ações

**Seções principais**:
```
┌─────────────────────────────┐
│ Bem-vindo, Dr. Copilot! 👋  │
├─────────────────────────────┤
│ RESUMO RÁPIDO               │
│ • Pacientes: 45             │
│ • Consultas hoje: 8         │
│ • Pendências: 3             │
│                             │
│ PRÓXIMAS CONSULTAS          │
│ • 10:00 - João (Consulta)   │
│ • 11:30 - Maria (Retorno)   │
│                             │
│ ÚLTIMAS ANÁLISES COM IA     │
│ • João Silva - Gripe (89%)  │
│ • Maria Santos - Fibromialgia
│                             │
└─────────────────────────────┘
```

**Estado**:
```javascript
const [pacientes, setPacientes] = useState([]);
const [consultas, setConsultas] = useState([]);
const [ultimasAnalises, setUltimasAnalises] = useState([]);
```

---

#### 4. **PacienteView.jsx** (Gestão de Pacientes) ⭐ PRINCIPAL
**Localização**: `src/components/PacienteView.jsx`

**O que faz** (3 modos diferentes):
1. **Modo Lista**: Busca e lista todos os pacientes
2. **Modo Visualizar**: Vê histórico completo de um paciente
3. **Modo Edição**: Edita dados do paciente

**Interface (Modo Lista)**:
```
┌─────────────────────────────────────┐
│ PACIENTES                           │
├─────────────────────────────────────┤
│ [Buscar por nome/CPF...] [+ Novo]   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Maria Silva      CPF: 123.456.  │ │
│ │ Idade: 35 • Sexo: F             │ │
│ │                                 │ │
│ │ [Visualizar] [Editar] [Deletar] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ João Santos      CPF: 987.654.  │ │
│ │ Idade: 45 • Sexo: M             │ │
│ │                                 │ │
│ │ [Visualizar] [Editar] [Deletar] │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Interface (Modo Visualizar) - ABA ATENDIMENTOS**:
```
┌──────────────────────────────────────────────┐
│ MARIA SILVA - ID: patient_123               │
├──────────────────────────────────────────────┤
│ Dados: Nome, CPF, Idade, Sexo                │
│                                              │
│ ┌─ ATENDIMENTOS ─ EXAMES ─────────────┐    │
│ │                                     │    │
│ │ ┌───────────────────────────────┐  │    │
│ │ │ 15 JUN                        │  │    │
│ │ │ 2026                          │  │    │
│ │ │                               │  │    │
│ │ │ Consulta de Rotina            │  │    │
│ │ │ 🎙️ Transcrição disponível    │  │    │
│ │ │                               │  │    │
│ │ │ [Clique para abrir chat IA]   │  │    │
│ │ └───────────────────────────────┘  │    │
│ │                                     │    │
│ │ ┌───────────────────────────────┐  │    │
│ │ │ 10 JUN | Seguimento           │  │    │
│ │ │ 2026                          │  │    │
│ │ │ Sem transcrição               │  │    │
│ │ └───────────────────────────────┘  │    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

**Interface (Modo Visualizar) - ABA EXAMES**:
```
┌──────────────────────────────────────────┐
│ EXAMES CLÍNICOS                          │
├──────────────────────────────────────────┤
│ PDFs anexados aparecem aqui              │
│                                          │
│ ┌──────────────────────────────────┐   │
│ │ 28        Hemograma Completo    │   │
│ │ JUN                             │   │
│ │ 2026                            │   │
│ │                   14:35         │   │
│ │            Concluído ✓          │   │
│ │ [Ver PDF]  [Download]           │   │
│ └──────────────────────────────────┘   │
│                                          │
│ ┌──────────────────────────────────┐   │
│ │ 15        Eletrocardiograma     │   │
│ │ JUN                             │   │
│ │ 2026                            │   │
│ │                   09:00         │   │
│ │            Concluído ✓          │   │
│ └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Dados mostrados**:
```javascript
{
  id: "patient_123",
  name: "Maria Silva",
  cpf: "123.456.789-00",
  age: 35,
  gender: "F",
  consultations: [
    {
      id: "cons_001",
      date: "2026-06-15",
      title: "Consulta de Rotina",
      has_transcription: true,  // ← Mostra badge 🎙️
      audio_file: "audio_001.wav"
    }
  ],
  exames: [
    {
      id: "exam_001",
      nome: "Hemograma",
      data: "28 JUN",
      ano: "2026",
      horario: "14:35",
      resultado: "Hemoglobina: 13.2..."
    }
  ]
}
```

**Funções principais**:
```javascript
function PacienteView({ pacientes, token, mode }) {
  // mode = 'list' | 'search' | 'detail'
  
  // Buscar pacientes
  const handleSearch = (query) => { ... }
  
  // Visualizar paciente
  const handleSelectPatient = (patient) => { ... }
  
  // Editar paciente
  const handleEditPatient = (patient) => { ... }
  
  // Deletar paciente
  const handleDeletePatient = (id) => { ... }
  
  // Abrir consulta no chat IA
  const handleOpenChat = (consultation) => { ... }
  
  // Ver detalhes do exame
  const handleViewExam = (exam) => { ... }
}
```

---

#### 5. **AtendimentosView.jsx** (Transcrição de Áudio)
**Localização**: `src/components/AtendimentosView.jsx`

**O que faz**:
- Grava áudio em tempo real
- Transcreve fala em tempo real (Web Speech API)
- Associa transcrição ao paciente
- Mostra aviso se navegador não suporta

**Interface**:
```
┌────────────────────────────────────┐
│ ATENDIMENTOS - TRANSCRIÇÃO         │
├────────────────────────────────────┤
│                                    │
│ Selecione paciente:                │
│ [Dropdown com lista]               │
│                                    │
│ Tipo de atendimento:               │
│ [Consulta / Seguimento]            │
│                                    │
│ [INICIAR GRAVAÇÃO]                 │
│                                    │
│ ● Gravando...                      │
│ 0:45 segundos                      │
│                                    │
│ Transcrição em Tempo Real:         │
│ ─────────────────────────────────  │
│ "O paciente relata febre há 3      │
│  dias com tosse seca e dor na"     │
│ "garganta..."                      │
│                                    │
│ [FINALIZAR] [CANCELAR]             │
│                                    │
│ ⚠️ Se Firefox: Transcrição em      │
│    Chrome/Edge apenas              │
│                                    │
└────────────────────────────────────┘
```

**Fluxo técnico**:
```javascript
// 1. Inicializar Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.lang = 'pt-BR';

// 2. Começar gravação
recognition.start();

// 3. Receber resultado em tempo real
recognition.onresult = (event) => {
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
  setTranscribedText(transcript);  // Atualiza tela
};

// 4. Ao finalizar
recognition.stop();

// 5. Salvar no backend
POST /api/patients/:id/atendimento-transcricao
{
  "transcription": transcript,
  "type": "Consulta"
}
```

**Compatibilidade**:
- ✅ Chrome / Edge / Safari
- ❌ Firefox

---

#### 6. **AnaliseIAView.jsx** (Chat com IA + PDF) ⭐
**Localização**: `src/components/AnaliseIAView.jsx`

**O que faz**:
- Chat com modelo Groq Llama 3.3
- Upload de PDF de exame
- Extração automática de texto
- Histórico de conversas

**Interface**:
```
┌─────────────────────────────────────────┐
│ ANÁLISE COM IA                          │
├─────────────────────────────────────────┤
│                                         │
│ Selecione paciente:                     │
│ [Dropdown]                              │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ HISTÓRICO DA CONVERSA               ││
│ ├─────────────────────────────────────┤│
│ │                                     ││
│ │ User: "O paciente tem..."           ││
│ │ IA: "Com base nos sintomas..."      ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ Resultados do Exame:                    │
│ [Anexar PDF de Exame]                   │
│ ┌─────────────────────────────────────┐│
│ │ Hemoglobina: 13.2 g/dL              ││
│ │ Hematócrito: 39%                    ││
│ │ Leucócitos: 12.800/mm³              ││
│ │ ...                                 ││
│ └─────────────────────────────────────┘│
│                                         │
│ Sua pergunta:                           │
│ ┌─────────────────────────────────────┐│
│ │ [Caixa de texto grande]             ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ [GERAR ANÁLISE]                         │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ RESULTADO:                          ││
│ │                                     ││
│ │ Descrição: Paciente com...          ││
│ │                                     ││
│ │ Hipóteses Diagnósticas:             ││
│ │ 1. Gripe (89%) ⭐ MAIS PROVÁVEL    ││
│ │ 2. Rinite (7%)                      ││
│ │ 3. Sinusite (4%)                    ││
│ │                                     ││
│ │ Recomendações:                      ││
│ │ • Repouso adequado                  ││
│ │ • Hidratação                        ││
│ │ • Paracetamol 500mg                 ││
│ │                                     ││
│ │ [IMPRIMIR] [SALVAR] [COPIAR]        ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

**Novo: Upload de PDF**:
```
Clica em "Anexar PDF de Exame"
    ↓
Seleciona arquivo PDF
    ↓
POST /api/extract-pdf
    ↓
Backend processa com PyPDF2
    ↓
Retorna texto extraído
    ↓
Textarea preenchida automaticamente
    ↓
Médico pode enviar à IA
```

**Fluxo de chat**:
```javascript
const handleGenerateAnalysis = async () => {
  // 1. Coletar dados
  const prompt = buildPrompt(examText, patientData);
  
  // 2. Enviar à IA
  const response = await fetch('/api/analise-ia', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      patient_id: selectedPatient.id,
      consultation_id: selectedConsultation.id,
      message: prompt
    })
  });
  
  // 3. Receber resposta
  const data = await response.json();
  setResult(data.analysis);
  
  // 4. Salvar no histórico
  addMessageToHistory(data);
};
```

---

#### 7. **AgendamentosView.jsx** (Calendário)
**Localização**: `src/components/AgendamentosView.jsx`

**O que faz**:
- Exibe calendário visual
- CRUD de agendamentos (Create, Read, Update, Delete)
- Persistência em JSON
- Indicadores de status

**Interface**:
```
┌────────────────────────────────────────┐
│ AGENDAMENTOS                           │
├────────────────────────────────────────┤
│                                        │
│ ◀ Junho 2026 ▶                         │
│                                        │
│ Dom Seg Ter Qua Qui Sex Sáb            │
│                                        │
│  25  26  27  28  29  30   1            │
│           2   3   4   5  [Hoje: 28]   │
│           ┌──────────────────┐        │
│          6│ 09:00 Consulta   │        │
│           │ João Silva       │        │
│           │ Sala: 3 (🟢 OK) │        │
│           └──────────────────┘        │
│           ┌──────────────────┐        │
│          6│ 14:00 Seguimento │        │
│           │ Maria Santos     │        │
│           │ (🟡 Pendente)    │        │
│           └──────────────────┘        │
│                                        │
│  7   8   9  10  11  12  13             │
│           ┌──────────────────┐        │
│          8│ 10:30 Avaliação │        │
│           │ Pedro Costa      │        │
│           │ (🔴 Cancelado)   │        │
│           └──────────────────┘        │
│                                        │
│ [+ Novo Agendamento]                   │
│                                        │
└────────────────────────────────────────┘
```

**Criar agendamento**:
```
Clica "+ Novo"
    ↓
Modal abre:
  - Data: [seletor]
  - Hora início: [10:30]
  - Hora fim: [11:00]
  - Título: [Consulta de Rotina]
  - Tipo: [Consulta / Seguimento / Exame]
  - Paciente: [Dropdown]
    ↓
POST /api/agendamentos
    ↓
Agendamento aparece no calendário
```

**Deletar agendamento**:
```
Clica no ícone de lixeira
    ↓
Confirmação: "Tem certeza?"
    ↓
DELETE /api/agendamentos/:id
    ↓
Agendamento removido
```

---

#### 8. **CadastroView.jsx** (Novo Paciente)
**Localização**: `src/components/CadastroView.jsx`

**O que faz**:
- Formulário para registrar novo paciente
- Validação de CPF
- Cálculo de idade
- Envio ao backend

**Formulário**:
```
Nome Completo:
[________________________]

CPF (sem pontos):
[___________]

Data de Nascimento:
[__/__/____]  (calcula idade automaticamente)

Sexo:
(•) Masculino  ( ) Feminino

Telefone (opcional):
[_____] [_______-____]

[CADASTRAR]  [CANCELAR]
```

**Validação**:
```javascript
// Validar CPF
if (cpf.length !== 11 || isInvalidCPF(cpf)) {
  setError("CPF inválido");
  return;
}

// Validar nome
if (!nome || nome.length < 3) {
  setError("Nome deve ter pelo menos 3 caracteres");
  return;
}

// POST ao backend
POST /api/patients
{
  "nome": "Maria Silva",
  "cpf": "12345678901",
  "idade": 35,
  "sexo": "F",
  "phone": "11987654321"
}
```

---

#### 9. **Sidebar.jsx** (Menu Lateral)
**Localização**: `src/components/Sidebar.jsx`

**O que faz**:
- Navegação entre telas
- Logo do sistema
- Botão de logout
- Botão para recolher/expandir

**Componentes**:
```
┌─────────────────────────┐
│ 🏥 COPILOT MÉDICO      │ ← Logo + Título
├─────────────────────────┤
│ 🏠 Dashboard            │
│ 👥 Pacientes            │
│ 📅 Agendamentos         │
│ ✨ Análise com IA       │
│ 🎙️ Atendimentos         │
│ 📊 Relatórios           │
│ ⚙️ Configurações        │
├─────────────────────────┤
│ 🚪 Sair                 │
│ ◀ Recolher Menu         │
│                         │
└─────────────────────────┘
```

**Menu items (sem Prontuários)**:
```javascript
const menuItems = [
  { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'pacientes', icon: Users, label: 'Pacientes' },
  { id: 'agendamentos', icon: Calendar, label: 'Agendamentos' },
  { id: 'analise-ia', icon: Sparkles, label: 'Análise com IA' },
  { id: 'atendimentos', icon: ClipboardList, label: 'Atendimentos' },
  { id: 'relatorios', icon: BarChart3, label: 'Relatórios' },
  { id: 'configuracoes', icon: Settings, label: 'Configurações' },
];
```

---

#### 10. **TopBar.jsx** (Barra Superior)
**Localização**: `src/components/TopBar.jsx`

**O que faz**:
- Exibe nome do usuário
- Mostra perfil
- Notificações (futura)
- Hora atual

**Componentes**:
```
┌─────────────────────────────────────────────┐
│ Dr. Copilot (Médico)  |  Jun 28  |  14:35  │
└─────────────────────────────────────────────┘
```

---

### Arquivos de Configuração

#### **theme.js** (Tema Centralizado)
**Localização**: `src/theme.js`

**O que faz**:
- Define cores do sistema
- Define tamanhos e espaçamento
- Define border radius
- Define largura de sidebar

**Conteúdo**:
```javascript
export const theme = {
  colors: {
    primary: '#0046fe',      // Azul principal
    primarySoft: '#eff6ff',  // Azul suave
    bg: '#ffffff',           // Branco
    surface: '#f8fafc',      // Cinza suave
    text: '#0f172a',         // Texto escuro
    textMuted: '#64748b',    // Texto muted
    border: '#e2e8f0',       // Bordas
    success: '#10b981',      // Verde
    warning: '#f59e0b',      // Amarelo
    error: '#ef4444',        // Vermelho
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    pill: '9999px',
  },
  layout: {
    sidebarWidth: 220,
    sidebarCollapsed: 80,
  }
};
```

#### **api.js** (Configuração da API)
**Localização**: `src/api.js`

**O que faz**:
- Define URL base da API
- Centraliza endpoints

**Conteúdo**:
```javascript
export const API_URL = 'http://localhost:3001';

// Uso:
fetch(`${API_URL}/api/patients`)
```

---

## 🖥️ FRONTEND EXTENSÃO (COPMED EXTENSION)

### Localização
```
c:\Users\italo\Documents\projeto_completo\front\copmed-extension\src\
```

### O que é?
**Interface simplificada para recepcionistas** - Focada apenas em:
- Visualizar Dashboard rápido
- Listar pacientes
- Cadastrar novo paciente

### Porta
```
Roda junto com o principal (mesma porta 5173, rotas diferentes)
```

### Componentes

#### 1. **App.jsx**
**O que faz**:
- Define rotas simples
- 3 páginas apenas

**Rotas**:
```javascript
if (paginaAtual === 'pacientes') return <Pacientes />;
if (paginaAtual === 'novoPaciente') return <NovoPaciente />;
return <Dashboard />;  // Padrão
```

#### 2. **Dashboard.jsx**
**O que faz**:
- Exibe resumo rápido
- Lista pacientes ativos
- Mostra próximas consultas
- Menu colapsável

**Bibliotecas usadas**:
```javascript
import {
  FiBell,       // Sino (notificações)
  FiHome,       // Casa
  FiUsers,      // Usuários
  FiCalendar,   // Calendário
  // ...
} from 'react-icons/fi';  // ← Ícones Feather (não Lucide)
```

**Dados mockados** (não vem da API ainda):
```javascript
const pacientes = [
  { id: 1, nome: "Maria Silva", ativo: true, novoMes: true },
  { id: 2, nome: "João Oliveira", ativo: true, novoMes: true },
  // ...
];

const consultas = [
  {
    id: 1,
    horario: "08:00",
    paciente: "Maria Silva",
    tipo: "Retorno",
    especialidade: "Cardiologia",
    status: "Confirmado",
    hoje: true,
  },
  // ...
];
```

#### 3. **Pacientes.jsx**
**O que faz**:
- Lista todos os pacientes
- Cada um com botão "Novo Atendimento"
- Filtro por status

**Interface**:
```
Pacientes Ativos        Pacientes Inativos
├─ Maria Silva         ├─ Carlos Mendes
├─ João Oliveira       
├─ Ana Costa           
└─ Pedro Carvalho      
  [Novo Atendimento]   
```

#### 4. **NovoPaciente.jsx**
**O que faz**:
- Formulário para cadastro
- Campos: nome, CPF, idade, sexo
- Botão para salvar

---

## 📊 Arquitetura de Componentes

### Hierarquia do Frontend Principal

```
App.jsx (Raiz)
│
├─ Login.jsx
│
└─ Componente ativo baseado em currentView:
   ├─ HomeView.jsx
   ├─ PacienteView.jsx (3 modos: list, search, detail)
   │  ├─ Aba ATENDIMENTOS
   │  │  └─ Cards de consulta
   │  ├─ Aba EXAMES
   │  │  └─ Cards de PDF
   │  └─ Modal de detalhes
   ├─ AtendimentosView.jsx
   │  └─ Web Speech API
   ├─ AnaliseIAView.jsx
   │  └─ Chat com Groq
   ├─ AgendamentosView.jsx
   │  └─ Calendário
   ├─ CadastroView.jsx
   │  └─ Formulário
   └─ Sidebar.jsx + TopBar.jsx
```

### Fluxo de Dados

```
[User Action]
    ↓
[React Component State]
    ↓
[fetch() com Bearer token]
    ↓
[Backend API]
    ↓
[Response JSON]
    ↓
[setState() atualiza UI]
    ↓
[Componente re-renderiza]
    ↓
[Usuário vê mudanças]
```

---

## 🔄 Fluxo de Navegação

### Cenário: Médico acessa paciente

```
1. Médico clica em "Pacientes" (Sidebar)
   ↓
2. App.jsx muda: setCurrentView('pacientes')
   ↓
3. PacienteView renderiza em modo "list"
   ↓
4. Lista de pacientes aparece
   ↓
5. Médico digita "João" na busca
   ↓
6. handleSearch('João') → fetch('/api/patients?q=João')
   ↓
7. Filtra localmente os resultados
   ↓
8. Médico clica "Visualizar"
   ↓
9. handleSelectPatient(joão) → setSelectedPatient(joão)
   ↓
10. PacienteView muda para modo "detail"
    ↓
11. Mostra abas: ATENDIMENTOS | EXAMES
    ↓
12. Médico clica em uma consulta
    ↓
13. handleOpenChat() → setCurrentView('analise-ia')
    ↓
14. AnaliseIAView abre com histórico do paciente
    ↓
15. Médico pode fazer análise com IA
```

---

## 💡 Como Explicar ao Professor

### Script Resumido (5 minutos)

```
"Temos 2 frontends funcionando:

1️⃣ FRONTEND PRINCIPAL (Sistema Completo)
   Localização: src/
   Porta: 5173
   Para: Médicos
   
   Componentes principais:
   ✅ App.jsx - Raiz, gerencia rotas
   ✅ Login.jsx - Autenticação com JWT
   ✅ HomeView.jsx - Dashboard
   ✅ PacienteView.jsx - Gestão de pacientes (MAIS IMPORTANTE)
   ✅ AtendimentosView.jsx - Transcrição com Web Speech API
   ✅ AnaliseIAView.jsx - Chat com IA Groq + Upload PDF
   ✅ AgendamentosView.jsx - Calendário
   ✅ Sidebar.jsx - Menu
   
   Fluxo:
   Usuário faz login → Vai para Dashboard
   Clica em "Pacientes" → Lista todos
   Busca "João" → Filtra resultado
   Clica "Visualizar João" → Vê histórico
   Vê abas: ATENDIMENTOS (com 🎙️ transcrição)
            EXAMES (com PDFs)
   Clica em atendimento → Abre chat com IA
   Faz análise → IA retorna diagnóstico

2️⃣ FRONTEND EXTENSÃO (Interface Recepção)
   Localização: front/copmed-extension/src/
   Para: Recepcionistas
   
   Componentes:
   • Dashboard.jsx - Resumo rápido
   • Pacientes.jsx - Lista de pacientes
   • NovoPaciente.jsx - Cadastro
   
   Mais simples, focado em recepção.

TECNOLOGIAS FRONTEND:
• React 19 - Framework
• Vite 8 - Build rápido
• Lucide React - Ícones
• Web Speech API - Transcrição
• CSS-in-JS - Estilos

DADOS:
• JWT Token em localStorage
• Fetch com Authorization header
• Backend retorna JSON
• LocalState com useState()
"
```

### Apresentação Detalhada (15 minutos)

#### Parte 1: Estrutura (3 min)
```
"Vamos começar pela estrutura.

Temos DOIS frontends neste projeto:

1. O FRONTEND PRINCIPAL é para os MÉDICOS
   [Mostrar: src/components/]
   Tem 9 componentes principais:
   
   - Login (autenticação com email/senha)
   - HomeView (dashboard com resumo)
   - PacienteView (o coração do sistema)
   - AtendimentosView (grava áudio)
   - AnaliseIAView (chat com IA)
   - AgendamentosView (calendário)
   - CadastroView (novo paciente)
   - Sidebar (menu)
   - TopBar (barra superior)

2. O FRONTEND DA EXTENSÃO é para RECEPCIONISTAS
   [Mostrar: front/copmed-extension/src/]
   Mais simples, só tem 3 páginas:
   - Dashboard
   - Pacientes
   - NovoPaciente
   
   Ainda com dados mockados (não conecta ao backend)
"
```

#### Parte 2: PacienteView - O Componente Principal (5 min)
```
"Agora vamos no detalhe mais importante: PacienteView.

Este é o coração do sistema para médicos.

[Mostrar código]

Tem 3 modos:

MODO 1 - LISTA:
  [Imagem da lista de pacientes]
  Mostra todos os pacientes
  Pode buscar por nome/CPF
  Botão de Novo Paciente
  
MODO 2 - VISUALIZAR (Aba ATENDIMENTOS):
  [Imagem da aba atendimentos]
  Mostra histórico de consultas
  NOVO: Badge 🎙️ indica se tem transcrição
  Clica em uma consulta → Abre chat com IA
  
MODO 3 - VISUALIZAR (Aba EXAMES):
  [Imagem da aba exames]
  Mostra PDFs que foram anexados
  Clica em PDF → Vê texto extraído
  Data, hora, status completo
  
Como funciona:
  Médico clica "Pacientes" 
  → Lista aparece
  → Digita "João" 
  → Filtra resultado
  → Clica "Visualizar João"
  → Vê histórico com 2 abas

Dados que aparecem:
  • Nome, CPF, Idade, Sexo
  • Lista de consultas com datas
  • Cada consulta tem título e tipo
  • Indicador se tem áudio/transcrição
  • PDFs de exames com meta dados
"
```

#### Parte 3: Fluxo de Dados (4 min)
```
"Agora vamos ver como os dados fluem.

[Diagrama]

USUÁRIO ← [Navegador] ← React 19 (5173)
           ↓
        [fetch()]
           ↓
        [Backend] ← Flask (3001)
           ↓
        [Banco de dados]
           ↓
        [JSON response]
           ↓
        [setState()]
           ↓
        [Componente re-renderiza]
           ↓
        USUÁRIO VÊ MUDANÇAS

Exemplo real:

1. Médico digita 'João' na busca
   → handleSearch('João')
   
2. React faz fetch
   → fetch('/api/patients?q=João', {
       headers: { Authorization: Bearer token }
     })
   
3. Backend processa
   → Busca em patients_db.json
   → Filtra por nome 'João'
   
4. Backend retorna
   → JSON com pacientes encontrados
   
5. React setState
   → setPacientes(resultado)
   
6. Componente re-renderiza
   → Lista atualiza na tela
   
7. Usuário vê "João Silva" na lista
"
```

#### Parte 4: Tecnologias Usadas (3 min)
```
"Tecnologias do frontend:

FRONTEND:
1. React 19 - Framework principal
   • Componentes reutilizáveis
   • Estado com useState()
   • useEffect para buscar dados
   
2. Vite 8 - Build tool
   • Muito rápido
   • Hot reload automático
   • Em Windows com Docker precisa: usePolling: true
   
3. Lucide React - Ícones
   • 500+ ícones bonitos
   • SVG leve
   • Customizáveis

4. Web Speech API - Transcrição
   • Nativa do navegador
   • Funciona offline
   • Só em Chrome/Edge/Safari
   
5. CSS-in-JS - Estilos
   • Sem arquivo CSS externo
   • Tema centralizado em theme.js
   • Dinâmico por estado

COMUNICAÇÃO:
• fetch() para requisições HTTP
• JWT Token em Authorization header
• JSON para troca de dados
• localStorage para persistência

DADOS:
• Estado local com useState()
• Props para passar dados entre componentes
• Fetch para chamar API backend
"
```

---

## 📂 Localização Rápida de Arquivos

### Para Encontrar Código Específico

| O que você quer | Aonde procurar |
|---|---|
| **Listar pacientes** | `src/components/PacienteView.jsx:50-100` |
| **Transcrever áudio** | `src/components/AtendimentosView.jsx:150-200` |
| **Análise com IA** | `src/components/AnaliseIAView.jsx:80-150` |
| **Calendário** | `src/components/AgendamentosView.jsx:1-80` |
| **Cores do sistema** | `src/theme.js` |
| **URL da API** | `src/api.js` |
| **Login** | `src/components/Login.jsx` |
| **Ícones usados** | `src/components/Sidebar.jsx:import { ... } from 'lucide-react'` |

---

## 🎯 Perguntas Esperadas do Professor

**P: "Onde está o código do login?"**  
R: `src/components/Login.jsx`

**P: "Como o médico vê o histórico do paciente?"**  
R: Em `src/components/PacienteView.jsx`, modo "detail" com 2 abas (ATENDIMENTOS e EXAMES)

**P: "Como funciona a transcrição de áudio?"**  
R: `src/components/AtendimentosView.jsx` usa `webkitSpeechRecognition()` (Web Speech API nativa)

**P: "Como os dados vão para o backend?"**  
R: Com `fetch()` do JavaScript, enviando JWT no header Authorization

**P: "Quantos componentes tem?"**  
R: Frontend Principal tem 9 componentes React

**P: "Qual é o mais importante?"**  
R: `PacienteView.jsx` - tem 1192 linhas, gerencia tudo sobre pacientes

**P: "Por que tem 2 frontends?"**  
R: Um para Médicos (completo), um para Recepcionistas (simplificado)

---

**Pronto para apresentar!** 🎓

Use este documento para guiar o professor pelas funcionalidades! 

