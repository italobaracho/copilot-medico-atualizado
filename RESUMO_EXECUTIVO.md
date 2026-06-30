# 🏥 Sistema Copilot Médico - Resumo Executivo

## O que é?

Um **assistente clínico por IA** que ajuda médicos a:
- 🗣️ Transcrever atendimentos em tempo real
- 🧬 Analisar exames laboratoriais com IA
- 📋 Gerenciar pacientes e históricos
- 📅 Organizar agendamentos

---

## Como Funciona?

### 1️⃣ Médico faz atendimento
```
Microfone → Transcrição em tempo real → Salva no histórico do paciente
```

### 2️⃣ Médico analisa exame
```
Upload PDF → Extrai texto automaticamente → Envia à IA para análise
```

### 3️⃣ Sistema armazena e visualiza
```
Paciente → Aba de Atendimentos (com áudio 🎙️) + Aba de Exames (PDFs)
```

---

## Tecnologias Usadas

| Componente | Tecnologia | Função |
|---|---|---|
| **Interface** | React 19 + Vite | Website do médico |
| **Servidor** | Flask (Python) | API que conecta tudo |
| **IA Análise** | Groq Llama 3.3 70B | Diagnósticos & relatórios |
| **Áudio** | Web Speech API | Transcrição em tempo real |
| **Armazenamento** | SQLite + JSON | Salva dados dos pacientes |
| **Containerização** | Docker | Roda em qualquer computador |

---

## Funcionalidades Principais

### 🖥️ Interface do Médico

**Dashboard (Home)**
- Visão geral do sistema
- Alertas de próximas consultas

**Pacientes**
- Busca por nome/CPF
- 2 abas:
  - **Atendimentos**: Lista de consultas com 🎙️ indicador de áudio
  - **Exames**: PDFs anexados (data, hora, status)

**Atendimentos**
- Grava áudio enquanto o médico fala
- Transcreve automaticamente (Chrome/Edge)
- Associa ao paciente

**Análise com IA**
- Chat com modelo de IA
- ✨ **Novo**: Upload de PDF → extrai texto → alimenta IA
- Retorna diagnóstico/laudo

**Agendamentos**
- Calendário de consultas
- Pode criar/editar/deletar

### 🔐 Segurança
- Login obrigatório
- 4 perfis: Administrador, Médico, Recepção, Usuário
- Filtro LGPD: remove nomes de dados sensíveis

---

## O que Mudou Nesta Atualização?

### ✅ Melhorias de UX

| Item | O que era | Agora é |
|---|---|---|
| **Menu Prontuários** | Existia | ❌ Removido (simplificação) |
| **Transcrições** | Sem indicador | 🎙️ Badge azul (fácil ver quais têm áudio) |
| **PDFs de Exame** | Não funcionava | ✨ Upload automático + extração de texto |
| **Aba Exames** | Básica | Mostra hora/ano/status do exame |
| **Tela Atendimentos** | Painel lateral fixo | 🎯 Layout limpo, mais espaço de trabalho |
| **Análise com IA** | Só texto | 📎 Pode anexar PDFs de exame |

---

## Exemplo de Uso Real

### Cenário: Paciente com Diabetes

**Passo 1: Atendimento**
```
Médico → Clica em "Atendimentos"
      → Grava a consulta ("o paciente relata..."
      → Sistema transcreve automaticamente
      → Ao terminar, transcrição salva no histórico do paciente
```

**Passo 2: Análise de Exame**
```
Médico → Clica em "Análise com IA"
      → Faz upload do PDF do exame (hemograma, glicemia, etc)
      → Sistema extrai o texto automaticamente
      → Texto aparece no campo de exame
      → Médico envia à IA junto com histórico do paciente
      → IA retorna análise e sugestões de diagnóstico
```

**Passo 3: Histórico Completo**
```
Médico → Clica em "Pacientes" → Busca paciente
      → Aba "Atendimentos": vê consultas com 🎙️ (tem áudio)
      → Aba "Exames": vê PDFs (data, hora, resultado)
      → Clica em exame → vê texto extraído
```

---

## Arquitetura Simplificada

```
MÉDICO USA
    ↓
NAVEGADOR (React)
    ↓
API REST (Flask)
    ↓
┌─────────────────────────┐
│ • Banco de Dados        │
│ • Arquivos de Áudio     │
│ • PDFs                  │
└─────────────────────────┘
    ↓
GROQ IA (Análise)
    ↓
RESULTADO (Diagnóstico/Laudo)
```

---

## Dados Armazenados

### Por Paciente:
- ✅ Nome, CPF, Idade, Sexo
- ✅ Histórico de consultas (com datas/horas)
- ✅ Transcrições de áudio
- ✅ Exames anexados (PDFs + texto extraído)
- ✅ Conversas com IA

### Segurança:
- Dados criptografados no banco
- Nomes removidos de análises (LGPD)
- Backup automático

---

## Status de Implementação

| Funcionalidade | Status | Observação |
|---|---|---|
| Autenticação | ✅ Completo | Login funcionando |
| Pacientes CRUD | ✅ Completo | Busca, visualização, edição |
| Atendimentos | ✅ Completo | Grava áudio + transcrição |
| Análise com IA | ✅ Completo | Agora suporta PDFs |
| Agendamentos | ✅ Completo | Calendário funcional |
| Dashboard | 🟡 Parcial | Com dados mockados |
| Relatórios | ⏳ Futuro | Previsto |
| Mobile | ⏳ Futuro | Previsto |

---

## Como Executar Localmente

### Pré-requisitos:
- Docker Desktop instalado
- Chave de API Groq (variável de ambiente)

### Comandos:
```bash
cd projeto_completo
docker compose up -d --build
```

### Acessar:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Login**: doctor@example.com / StrongPass123!

---

## Fluxo de Dados (Diagrama)

```
┌──────────────────────┐
│ MÉDICO               │
│ • Fala              │
│ • Faz upload PDF    │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │ React 19     │  (Interface)
    │ Web Speech   │  (Áudio)
    │ Form Upload  │  (PDF)
    └──────┬───────┘
           │ HTTP POST
           ▼
    ┌──────────────────────┐
    │ Flask Backend        │
    │ • Salva dados        │
    │ • Processa PDF       │
    │ • Chama Groq API     │
    └───┬──────────────┬──────┐
        │              │      │
        ▼              ▼      ▼
    ┌────────┐    ┌────────┐ ┌──────────────┐
    │SQLite  │    │JSON    │ │ Groq API     │
    │ (Auth) │    │(Dados) │ │ (Análise)    │
    └────────┘    └────────┘ └──────────────┘
        │              │      │
        └──────┬───────┴──────┘
               ▼
    ┌──────────────────────┐
    │ Resposta para Médico │
    │ • Histórico          │
    │ • Diagnóstico        │
    │ • Exames             │
    └──────────────────────┘
```

---

## 🎯 Objetivo Alcançado

✅ **Sistema de IA para auxiliar diagnósticos médicos funcionando completamente**

Com:
- Captura de áudio em tempo real
- Análise de exames com IA
- Visualização organizada de históricos
- Banco de dados persistente
- Interface intuitiva

---

**Desenvolvido com**: React • Flask • Groq • Docker  
**Versão**: 1.0  
**Status**: ✅ Produção-Ready (em container)
