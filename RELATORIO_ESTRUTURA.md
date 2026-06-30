# Relatório de Estrutura - Sistema Copilot Médico

## 📋 Resumo Executivo

O **Sistema Copilot Médico** é uma plataforma de inteligência artificial para auxiliar médicos na análise de pacientes, gestão de agendamentos e análise de exames laboratoriais. O sistema foi desenvolvido utilizando tecnologias modernas e containerização, permitindo fácil implantação e escalabilidade.

---

## 🏗️ Arquitetura Geral

### Stack Tecnológico

```
┌─────────────────────────────────────────────┐
│   Frontend (React 19 + Vite 8)              │
│   - Porta: 5173                              │
│   - Interface responsiva com Lucide Icons    │
│   - Comunicação via API REST                 │
└────────────────┬────────────────────────────┘
                 │
          ┌──────▼──────┐
          │  API REST   │
          │  Port: 3001 │
          └──────┬──────┘
                 │
┌─────────────────▼────────────────────────────┐
│   Backend (Flask + Python 3.11)              │
│   - Autenticação JWT                         │
│   - Gestão de Pacientes & Consultas          │
│   - Processamento de PDFs                    │
│   - Integração com APIs de IA                │
└─────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────────┐    ┌──────▼──────┐
│  Banco Dados   │    │ Filesystem   │
│  SQLite        │    │ (áudio/PDF)  │
│  JSON Files    │    │              │
└────────────────┘    └──────────────┘
```

### Estrutura de Pastas

```
projeto_completo/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── HomeView.jsx          # Dashboard
│   │   ├── PacienteView.jsx      # Gestão de Pacientes
│   │   ├── AnaliseIAView.jsx     # Análise com IA
│   │   ├── AtendimentosView.jsx  # Transcrição de Áudio
│   │   ├── AgendamentosView.jsx  # Calendário
│   │   ├── Sidebar.jsx           # Menu navegação
│   │   └── ...
│   ├── App.jsx                   # Componente raiz
│   ├── theme.js                  # Tema centralizado
│   └── api.js                    # URL base API
│
├── API/
│   ├── backend/
│   │   ├── patient_db.py         # CRUD Pacientes
│   │   ├── agendamentos_db.py    # CRUD Agendamentos
│   │   ├── text_filter.py        # Filtro LGPD (remove nomes)
│   │   └── pdf_reader.py         # Extração de PDFs
│   ├── server.py                 # Servidor Flask
│   ├── Dockerfile                # Image do backend
│   └── requirements.txt           # Dependências Python
│
├── docker-compose.yml             # Orquestração
├── vite.config.js                 # Config Vite (com polling Windows)
└── Dockerfile                     # Image do frontend
```

---

## 🤖 IAs Utilizadas

### 1. **Groq API - Llama 3.3 70B Versatile**
- **Função**: Análise clínica de pacientes e geração de diagnósticos
- **Integração**: Via SDK `groq-sdk` (Python)
- **Chave**: `GROQ_API_KEY` (variável de ambiente)
- **Endpoint**: `/api/analise-ia`
- **Caso de Uso**: 
  - Análise de sintomas dos pacientes
  - Geração de relatórios clínicos
  - Hipóteses diagnósticas baseadas em histórico

### 2. **Web Speech API (Navegador)**
- **Função**: Transcrição de áudio em tempo real
- **Integração**: JavaScript nativo (Chrome/Edge)
- **Compatível com**: Windows Speech Recognition
- **Caso de Uso**:
  - Transcrição de atendimentos médicos
  - Captura de notas de voz do médico
  - Busca por palavras-chave em conversas

### 3. **Claude (Anthropic)**
- **Função**: Assistência na codificação e design da arquitetura
- **Versão**: Claude Haiku 4.5 / Sonnet 4.6
- **Caso de Uso**:
  - Implementação de funcionalidades
  - Resolução de bugs
  - Otimização de código

---

## ✨ Funcionalidades Principais

### 📊 Dashboard
- Visão geral do sistema
- Estatísticas de pacientes
- Alertas de consultas próximas

### 👥 Gestão de Pacientes
- **Busca e Filtro**: Encontrar pacientes por nome/CPF
- **Visualização**: Histórico completo de atendimentos
- **Aba Atendimentos**:
  - Lista de consultas com datas
  - 🎙️ Indicador visual de transcrição de áudio
  - Clique para abrir chat com IA
- **Aba Exames**:
  - PDFs de exames anexados automaticamente
  - Horário e ano da realização
  - Visualização do texto extraído do PDF

### 🗣️ Atendimentos (Transcrição em Tempo Real)
- Gravação de áudio do atendimento
- Transcrição automática conforme fala
- Associação do áudio + texto ao paciente
- Visualização posterior no histórico do paciente

### 🧬 Análise com IA
- Chat com modelo Groq Llama 3.3 70B
- **Novo**: Upload de PDF de exame laboratorial
- Extração automática de texto do PDF
- Integração do texto ao prompt da IA
- Geração de diagnósticos e laudos

### 📅 Agendamentos
- Calendário visual
- CRUD completo de consultas
- Persistência em banco de dados

### 🔐 Autenticação
- Login com JWT
- Perfis de acesso:
  - Administrador
  - Médico
  - Recepção
  - Usuário (paciente)

---

## 🔄 Fluxo de Dados Principais

### Fluxo 1: Transcrição de Áudio → Paciente
```
[Atendimentos View]
    ↓ (grava áudio + transcreve)
[Web Speech API / Audio File]
    ↓ POST /api/patients/:id/atendimento-transcricao
[Backend] (salva em patient_db.json)
    ↓
[PacienteView] (exibe badge + histórico)
```

### Fluxo 2: PDF de Exame → Análise com IA
```
[AnaliseIA View]
    ↓ (upload PDF)
POST /api/extract-pdf
    ↓ (extrai texto)
[Backend] (processa com pdf_reader.py)
    ↓
[Textarea preenchida com texto extraído]
    ↓ (submete à IA)
[Groq API] (análise)
    ↓
[Relatório / Diagnóstico]
```

### Fluxo 3: PDF Exame → Aba Exames do Paciente
```
[AnaliseIA ou Chat]
    ↓ POST /api/upload-pdf
[Backend] (extrai + salva em patient_db.json)
    ↓ add_exam_to_patient()
[PacienteView → Aba Exames]
    ↓ (aparece automaticamente)
```

---

## 💾 Persistência de Dados

### Banco de Dados SQLite
- **Localização**: `/app.db` (dentro do container)
- **Uso**: Autenticação de usuários, tabelas do sistema

### Arquivos JSON (Persistência Local)
- **patients_db.json**: Pacientes, consultas, transcriçõess
- **agendamentos.json**: Todos os agendamentos
- **Vantagem**: Leitura rápida, sem dependência ORM

### Filesystem
- **Áudio**: Arquivos `.wav` salvos no backend
- **PDFs**: Referência salva em JSON, arquivo original em storage

---

## 📝 O que Foi Implementado Nesta Sessão

### ✅ Melhorias na UX

1. **Remover Menu Prontuários**
   - Menu lateral: "Prontuários" removido completamente
   - Simplificação da navegação

2. **AtendimentosView**
   - Painel lateral "Gravação de áudio" removido
   - Layout melhorado: coluna única, mais espaço
   - Aviso de navegador incompatível como banner inline

3. **AnaliseIAView**
   - ✨ Novo botão: **"Anexar PDF de Exame"**
   - Extração automática de texto do PDF
   - Preenchimento automático do campo de exame
   - O texto alimenta automaticamente o modelo de IA

4. **PacienteView - Aba ATENDIMENTOS**
   - 🎙️ **Badge Azul**: "Transcrição de áudio disponível"
   - Aparece apenas quando consulta tem áudio/transcrição
   - Ícone de microfone para identificação visual rápida
   - Exibe ano na data (não apenas mês/dia)

5. **PacienteView - Aba EXAMES**
   - Exibe horário da realização do exame
   - Exibe ano do exame
   - PDFs registrados aparecem automaticamente
   - Empty state com instrução: "Envie um PDF de exame no chat"
   - Modal melhora: mostra texto extraído com formatação preservada

### 🔧 Backend (Novas Rotas)

1. **POST `/api/extract-pdf`**
   - Recebe: arquivo PDF
   - Retorna: texto extraído bruto
   - Uso: AnaliseIA preenche campo de exame

2. **POST `/api/upload-pdf` (atualizado)**
   - Agora registra o PDF na aba Exames do paciente
   - Chama `add_exam_to_patient()` internamente
   - Metadados salvos: nome, data, hora, texto extraído

3. **GET `/api/patients/:id` (atualizado)**
   - Novo campo: `has_transcription` por consulta
   - Verifica logs de transcrição para indicar visual

### 📦 Novas Funções Backend

- **`add_exam_to_patient()`**: Registra exames/PDFs no prontuário

### 🐳 Containerização

- Backend rebuild com novas rotas
- Frontend rebuild com novos componentes
- Ambos rodando com sucesso em Docker

---

## 📊 Impacto das Mudanças

| Funcionalidade | Antes | Depois | Benefício |
|---|---|---|---|
| Menu | Incluía Prontuários | Removido | Interface mais limpa |
| Transcrições | Sem indicador visual | Badge 🎙️ | Fácil identificar consultas com áudio |
| PDFs de Exame | Não suportava upload | Upload + extração automática | IA pode analisar exames anexados |
| Exames no Paciente | Sem ano/hora | Completo | Histórico mais preciso |
| AtendimentosView | Painel lateral fixo | Layout limpo | Mais espaço de trabalho |

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19**: Framework UI moderno
- **Vite 8**: Build tool otimizado
- **Lucide Icons**: Ícones SVG
- **Web Speech API**: Transcrição de áudio
- **CSS-in-JS**: Estilos inline (sem dependências)

### Backend
- **Flask 3.0+**: Microframework web
- **Python 3.11**: Linguagem base
- **SQLite**: Banco de dados
- **Groq SDK**: Integração com LLM
- **PyPDF2**: Extração de PDFs

### DevOps
- **Docker**: Containerização
- **Docker Compose**: Orquestração
- **Git**: Versionamento (branch: `feature/melhorias-pacientes-ia-atendimentos`)

---

## 📈 Próximos Passos (Sugestões)

1. **Integrar gravação de áudio do lado do servidor**
   - Armazenar arquivos `.wav` com melhor compressão
   - Opcional: transcrição baseada em servidor

2. **Dashboard com métricas**
   - Total de pacientes
   - Consultas do dia
   - Taxa de utilização da IA

3. **Relatórios exportáveis**
   - PDFs com histórico do paciente
   - Resumos de análises de IA

4. **Melhorias de Performance**
   - Cache de pacientes
   - Paginação de histórico
   - Lazy loading de exames

---

## 📞 Suporte e Documentação

- **GitHub**: `https://github.com/italobaracho/copilot-medico-atualizado`
- **Branch Atual**: `feature/melhorias-pacientes-ia-atendimentos`
- **Ambiente Local**: `http://localhost:5173` (Frontend) e `http://localhost:3001` (Backend)

---

**Documento gerado**: 28 de junho de 2026  
**Autor**: Sistema Copilot Médico  
**Versão**: 1.0
