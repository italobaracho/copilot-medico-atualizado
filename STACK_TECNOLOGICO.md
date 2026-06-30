# 🛠️ STACK TECNOLÓGICO COMPLETO - PARA APRESENTAÇÃO AO PROFESSOR

**Versão**: 1.0  
**Data**: 28 de junho de 2026  
**Projeto**: Sistema Copilot Médico  

---

## 📊 Índice de Tecnologias

1. [Frontend](#frontend)
2. [Backend](#backend)
3. [Inteligência Artificial](#inteligência-artificial)
4. [DevOps & Containerização](#devops--containerização)
5. [Bancos de Dados](#bancos-de-dados)
6. [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
7. [Bibliotecas Externas](#bibliotecas-externas)
8. [Esquema Visual](#esquema-visual-completo)

---

## 🎨 Frontend

### React 19.2.6
**Classificação**: Framework de Interface de Usuário  
**Linguagem**: JavaScript (JSX)  
**Função Principal**: Construir a interface do médico

**O que faz**:
- Renderiza componentes (HomeView, PacienteView, etc.)
- Atualiza tela quando dados mudam (estado)
- Gerencia estado com `useState()`
- Busca dados com `useEffect()`

**Por que usamos**:
- Comunidade enorme (Stack Overflow, GitHub)
- Performance otimizada com Virtual DOM
- Componentes reutilizáveis
- Suporte a TypeScript

**Exemplo prático**:
```jsx
function PacienteView({ paciente }) {
  const [selectedTab, setSelectedTab] = useState('atendimentos');
  
  return (
    <div>
      <h1>{paciente.nome}</h1>
      <tabs>
        <tab onClick={() => setSelectedTab('atendimentos')}>
          Atendimentos
        </tab>
        <tab onClick={() => setSelectedTab('exames')}>
          Exames
        </tab>
      </tabs>
      {selectedTab === 'atendimentos' && (
        <AtendimentosList atendimentos={paciente.atendimentos} />
      )}
    </div>
  );
}
```

**Versão instalada**: 19.2.6  
**Alternativas consideradas**: Vue.js, Angular (rejeitadas por complexidade)

---

### Vite 8.0.12
**Classificação**: Build Tool (compilador/otimizador)  
**Linguagem**: JavaScript  
**Função Principal**: Compilar React para versão de produção

**O que faz**:
- Hot Module Replacement (HMR): Recarrega código automaticamente
- Build rápido usando ES Modules nativos
- Minifica JavaScript (remove espaços, nomes longos)
- Otimiza imagens e assets

**Por que usamos**:
- Muito mais rápido que Webpack
- Desenvolvida pelo criador do Vue.js
- Suporte nativo a JSX
- Configuração simples

**Configuração especial para Windows + Docker**:
```javascript
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,      // ← CRÍTICO para Windows
      interval: 300,         // Verifica a cada 300ms
    },
  },
})
```

**Por que esse `usePolling`?**
```
Windows + Docker = problema:
├─ Host (Windows) → edita arquivo
├─ Docker container (Linux) → não recebe notificação
└─ Vite fica esperando inotify que nunca chega
   
Solução: Vite faz polling (verifica cada 300ms)
```

**Versão instalada**: 8.0.12  
**Alternativas**: Webpack, Parcel (mais lentos)

---

### Lucide React 1.17.0
**Classificação**: Biblioteca de Ícones  
**Linguagem**: JavaScript/SVG  
**Função Principal**: Fornecer ícones bonitos e minimalistas

**O que faz**:
- Fornece ícones em SVG
- Customizáveis (tamanho, cor, stroke)
- Peso muito pequeno (ligeiros)
- Importação por nome

**Exemplos de ícones usados no projeto**:
```javascript
import {
  Mic,              // 🎙️ Microfone (Atendimentos)
  Download,         // ⬇️ Download (Exames)
  Sparkles,         // ✨ Análise com IA
  Users,            // 👥 Pacientes
  Calendar,         // 📅 Agendamentos
  BarChart3,        // 📊 Relatórios
  Settings,         // ⚙️ Configurações
  LogOut,           // 🚪 Sair
  Loader2,          // ⌛ Carregando
  ChevronRight,     // ▶️ Próximo
} from 'lucide-react';
```

**Uso na prática**:
```jsx
<Mic size={18} color="#0046fe" />  // Ícone azul de 18px
<Loader2 size={20} className="animate-spin" />  // Girar
```

**Versão instalada**: 1.17.0  
**Alternativas**: FontAwesome, Material Icons (mais pesados)

---

### Web Speech API (Nativa do Navegador)
**Classificação**: API JavaScript Nativa  
**Linguagem**: JavaScript  
**Função Principal**: Transcrever áudio em tempo real

**O que faz**:
- Escuta o microfone do computador
- Converte fala em texto (Speech-to-Text)
- Funciona offline (não precisa internet)
- Precisão ~95% em português

**Como funciona no código**:
```javascript
// 1. Criar reconhecedor
const recognition = new webkitSpeechRecognition();

// 2. Configurar idioma e configurações
recognition.lang = 'pt-BR';
recognition.continuous = true;
recognition.interimResults = true;

// 3. Começar a gravar
recognition.start();

// 4. Receber transcrição
recognition.onresult = (event) => {
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
  console.log('Texto:', transcript);
  setTranscribedText(transcript);
};

// 5. Parar gravação
recognition.stop();
```

**Compatibilidade**:
```
✅ Chrome 25+
✅ Edge 79+
✅ Safari 14.1+
❌ Firefox (não suporta)
❌ Opera Mini
```

**Alternativas consideradas**:
- Google Cloud Speech-to-Text (pago, online)
- Azure Speech Services (pago, online)
- Whisper (OpenAI) - usado em futuro

---

### CSS-in-JS (Estilos Inline)
**Classificação**: Sistema de Styling  
**Linguagem**: JavaScript  
**Função Principal**: Estilizar componentes sem CSS files

**O que faz**:
- Define estilos direto no JavaScript
- Tema centralizado em `theme.js`
- Evita conflitos de CSS
- Dinâmico (pode variar por estado)

**Centralização em `theme.js`**:
```javascript
export const theme = {
  colors: {
    primary: '#0046fe',        // Azul principal
    primarySoft: '#eff6ff',    // Azul suave
    bg: '#ffffff',             // Fundo branco
    surface: '#f8fafc',        // Superfícies
    text: '#0f172a',           // Texto escuro
    textMuted: '#64748b',      // Texto muted
    border: '#e2e8f0',         // Bordas
    success: '#10b981',        // Verde
    warning: '#f59e0b',        // Amarelo
    error: '#ef4444',          // Vermelho
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

**Uso na prática**:
```jsx
const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: '16px',
    border: `1px solid ${theme.colors.border}`,
  }
};

return <div style={styles.card}>Conteúdo</div>;
```

**Por que não usamos Tailwind?**
- Projeto começou simples (sem muitas dependências)
- Estilos inline são suficientes para MVP
- Fácil customizar tema depois

**Alternativas**:
- Tailwind CSS (mais popular, mais dependências)
- Styled-components (CSS-in-JS complexo)
- Sass/SCSS (arquivo separado)

---

## 🔧 Backend

### Flask 3.0+
**Classificação**: Microframework Web  
**Linguagem**: Python  
**Função Principal**: Servidor HTTP que recebe requisições da UI

**O que faz**:
- Define rotas (endpoints)
- Valida permissões
- Processa dados
- Retorna JSON

**Estrutura básica**:
```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/patients', methods=['GET', 'POST'])
@roles_required('medico', 'administrador')
def get_patients():
    if request.method == 'GET':
        patients = load_database().values()
        return jsonify({
            'status': 'success',
            'patients': list(patients)
        })
    elif request.method == 'POST':
        data = request.get_json()
        new_patient = create_patient(data)
        return jsonify({
            'status': 'success',
            'patient': new_patient
        }), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
```

**Vantagens**:
- Comunidade gigantesca
- Documentação excelente
- Infinitas extensões (Flask-JWT, Flask-CORS, etc)
- Fácil de aprender

**Porta**: 3001  
**Versão instalada**: 3.0+  
**Alternativas**: Django (muito pesado), FastAPI (moderno)

---

### Python 3.11
**Classificação**: Linguagem de Programação  
**Função Principal**: Linguagem base do backend

**O que faz**:
- Define a lógica do servidor
- Processa dados
- Integra com APIs externas
- Gerencia banco de dados

**Exemplo de código**:
```python
from datetime import datetime
from groq import Groq
import json

def analyze_patient_with_ai(patient_data, exam_text):
    """Analisa paciente com IA Groq"""
    
    # Filtrar dados sensíveis
    filtered_text = text_filter.remover_nomes(exam_text)
    
    # Preparar prompt
    prompt = f"""
    Você é um assistente médico especializado.
    
    Dados do paciente:
    - Idade: {patient_data['age']}
    - Sexo: {patient_data['gender']}
    - Histórico: {patient_data['history']}
    
    Exame:
    {filtered_text}
    
    Forneça uma análise diagnóstica completa.
    """
    
    # Chamar IA
    client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'user', 'content': prompt}]
    )
    
    return response.choices[0].message.content
```

**Por que Python?**
- Excelente para dados e IA
- Bibliotecas ricas (numpy, pandas, scikit-learn)
- Sintaxe limpa e legível
- Comunidade científica enorme

**Versão instalada**: 3.11  
**Requisitos**: 3.8+

---

### PyJWT (Python JWT)
**Classificação**: Biblioteca de Autenticação  
**Linguagem**: Python  
**Função Principal**: Gerar e validar tokens JWT

**O que faz**:
- Cria token quando usuário faz login
- Valida token em cada requisição
- Extrai informações do token

**Fluxo de autenticação**:
```python
import jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv('AUTH_SECRET_KEY')

def generate_token(user_id, email, profiles):
    """Gera JWT Token"""
    payload = {
        'user_id': user_id,
        'email': email,
        'profiles': profiles,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=24)  # Expira em 24h
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    """Valida JWT Token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expirado
    except jwt.InvalidTokenError:
        return None  # Token inválido
```

**Alternativas**:
- OAuth 2.0 (mais complexo)
- Session cookies (menos seguro)
- API Key simples (não recomendado)

---

### PyPDF2 5.x
**Classificação**: Biblioteca de Processamento de PDFs  
**Linguagem**: Python  
**Função Principal**: Extrair texto de arquivos PDF

**O que faz**:
- Lê arquivo PDF
- Extrai texto de cada página
- Preserva formatação básica

**Exemplo de uso**:
```python
from PyPDF2 import PdfReader
import os

def extract_text_from_pdf(file):
    """Extrai texto de um arquivo PDF"""
    try:
        reader = PdfReader(file)
        text = ""
        
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += f"\n--- Página {page_num + 1} ---\n"
            text += page.extract_text()
        
        return text.strip()
    except Exception as e:
        raise ValueError(f"Erro ao processar PDF: {str(e)}")

# Uso no código
from flask import request

@app.route('/api/extract-pdf', methods=['POST'])
def extract_pdf():
    file = request.files.get('pdf')
    if not file:
        return {'status': 'error'}, 400
    
    text = extract_text_from_pdf(file)
    
    return {
        'status': 'success',
        'text': text,
        'filename': file.filename
    }
```

**Saída esperada**:
```
--- Página 1 ---
HEMOGRAMA COMPLETO
Paciente: [REMOVIDO]
Resultado: Hemoglobina 13.2 g/dL
```

**Versão instalada**: 5.0+  
**Alternativas**: pdfplumber (melhor extração), PyMuPDF (mais rápido)

---

### Groq SDK (Python)
**Classificação**: Biblioteca de Integração com IA  
**Linguagem**: Python  
**Função Principal**: Conectar ao servidor Groq e usar modelo Llama 3.3

**O que faz**:
- Faz requisições HTTPS ao servidor Groq
- Envia prompts e recebe análises
- Gerencia tokens e rate limiting

**Instalação**:
```bash
pip install groq
```

**Exemplo completo**:
```python
from groq import Groq
import os

def analyze_with_groq(patient_symptoms, exam_results):
    """Usa modelo Llama 3.3 70B para análise"""
    
    client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    prompt = f"""
    Você é um assistente médico especializado em diagnósticos.
    
    Sintomas reportados:
    {patient_symptoms}
    
    Resultados de exames:
    {exam_results}
    
    Com base nestas informações, forneça:
    1. Análise inicial dos sintomas
    2. Hipóteses diagnósticas (com % de confiança)
    3. Exames adicionais recomendados
    4. Plano de tratamento sugerido
    
    Seja preciso e cite referências médicas quando possível.
    """
    
    message = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[
            {
                'role': 'system',
                'content': 'Você é um assistente médico experiente.'
            },
            {
                'role': 'user',
                'content': prompt
            }
        ],
        temperature=0.7,           # Criatividade
        max_tokens=2048,           # Máximo de tokens na resposta
        top_p=1,                   # Núcleo de amostragem
        frequency_penalty=0,       # Penalizar repetições
        presence_penalty=0         # Penalizar assuntos já mencionados
    )
    
    return message.choices[0].message.content

# Usar no servidor
@app.route('/api/analise-ia', methods=['POST'])
def get_analysis():
    data = request.get_json()
    patient_id = data['patient_id']
    symptoms = data['symptoms']
    exams = data['exam_text']
    
    analysis = analyze_with_groq(symptoms, exams)
    
    # Salvar no histórico
    add_analysis_to_history(patient_id, analysis)
    
    return {
        'status': 'success',
        'analysis': analysis
    }
```

**Modelo utilizado**: `llama-3.3-70b-versatile`
- 70 bilhões de parâmetros (modelo grande)
- Versátil (bom em várias tarefas)
- Otimizado para velocidade (Groq)

**Alternativas**:
- OpenAI GPT-4 (mais caro, mais lento)
- Anthropic Claude API (bom, mas caro)
- Azure OpenAI (integração completa Microsoft)

**Variáveis de Ambiente**:
```bash
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  # Armazenar em .env (não no git)
```

---

### Flask-CORS
**Classificação**: Extensão de Segurança  
**Linguagem**: Python  
**Função Principal**: Permitir requisições entre domínios diferentes

**O que faz**:
- Adiciona headers CORS à resposta
- Permite frontend (5173) chamar backend (3001)
- Sem isso, navegador bloquearia requisição

**Configuração**:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")  # Permite qualquer origem

# Em produção seria:
CORS(app, origins=["https://seu-dominio.com"])
```

**Por que precisa?**
```
Cenário: Frontend em localhost:5173
Requisição: para localhost:3001
Navegador pensa: "Domínio diferente! Bloqueado!"
CORS responde: "Não, tá liberado"
```

---

## 🤖 Inteligência Artificial

### Groq LLM API
**Classificação**: Serviço em Nuvem de IA  
**Linguagem**: Requisições HTTP/JSON  
**Função Principal**: Executar modelo de linguagem para análises

**Modelo**: Llama 3.3 70B Versatile

**Características do modelo**:
```
Nome:              llama-3.3-70b-versatile
Parâmetros:        70 bilhões
Context Window:    8192 tokens
Treinado em:       Português + 100+ idiomas
Especialidade:     Tarefas gerais, análise de texto
Velocidade:        ~2-5 segundos por requisição
```

**Como funciona**:
```
1. Frontend → Backend
   "Analise estes sintomas"
   
2. Backend → Groq API
   POST https://api.groq.com/openai/v1/chat/completions
   {
     "model": "llama-3.3-70b-versatile",
     "messages": [{"role": "user", "content": "..."}],
     "max_tokens": 2048,
     "temperature": 0.7
   }
   
3. Groq API → Processamento
   [Servidor Groq processa em GPUs especiais]
   
4. Groq API → Backend
   {
     "choices": [{
       "message": {"content": "Com base nos dados..."}
     }]
   }
   
5. Backend → Frontend
   Exibe resposta da IA
```

**Tipos de prompts usados**:

**A) Diagnóstico Simples**
```
Você é um assistente médico.

Sintomas:
- Febre há 3 dias
- Tosse seca
- Dor de garganta
- Sem dispneia

Exame:
- Hemograma normal
- PCR: 8.6 mg/L

Qual é o diagnóstico mais provável?
```

**B) Interpretação de Exame**
```
Analise o seguinte resultado de hemograma:

Hemoglobina: 13.2 g/dL (Normal: 12-16)
Hematócrito: 39% (Normal: 36-46%)
Leucócitos: 12.800/mm³ (Normal: 4.500-11.000) [ELEVADO]
Plaquetas: 250.000/mm³ (Normal: 150-400)
PCR: 8.6 mg/L (Normal: <3) [ELEVADO]

Qual processo está ocorrendo?
```

**C) Recomendação de Tratamento**
```
Paciente diagnosticado com gripe viral.
- Idade: 45 anos
- Comorbidades: Hipertensão
- Alergias: Penicilina

Recomende tratamento.
```

**Custos**:
```
Groq é ~5x mais barato que OpenAI GPT-4
- GPT-4: $0.03-0.06 por 1K tokens
- Llama 3.3 (Groq): $0.005-0.015 por 1K tokens
- Whisper (STT): $0.02 por minuto

Estimativa por mês:
50 análises/dia × 1000 tokens = 50.000 tokens/mês
50.000 × 0.01 / 1000 = ~$5/mês
```

---

### Web Speech API (Repetido - Importante)
Mencionado acima em Frontend, mas é também IA.

Diferença:
- **Speech-to-Text**: Transcrição (Web Speech)
- **Text-to-Speech**: Leitura em voz alta (TTS) - não implementado

---

## 🐳 DevOps & Containerização

### Docker
**Classificação**: Ferramenta de Containerização  
**Linguagem**: YAML + Bash  
**Função Principal**: Empacotar aplicação com todas as dependências

**O que faz**:
- Define ambiente Linux
- Instala Python/Node.js
- Copia código
- Executa aplicação

**Dockerfile do Backend**:
```dockerfile
# Imagem base
FROM python:3.11-slim

# Diretório de trabalho
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Expor porta
EXPOSE 3001

# Rodar Flask
CMD ["flask", "run", "--host", "0.0.0.0"]
```

**Dockerfile do Frontend**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

**Por que Docker?**
```
Sem Docker:
├─ "Funciona no meu computador"
├─ Outro dev com versão diferente Python
├─ Quebra no servidor

Com Docker:
├─ Mesma imagem em qualquer lugar
├─ Reproduzível 100%
└─ CI/CD automático
```

**Versão instalada**: Docker Desktop 4.x  
**Alternativas**: Podman (similar), Kubernetes (maior escala)

---

### Docker Compose
**Classificação**: Orquestrador de Containers  
**Linguagem**: YAML  
**Função Principal**: Definir e rodar múltiplos containers

**Arquivo**: `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./API
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - DB_URL=sqlite:///app.db
      - FLASK_DEBUG=True
    volumes:
      - ./API/backend:/app/backend
    container_name: projeto_completo-backend-1

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    depends_on:
      - backend
    container_name: projeto_completo-frontend-1

volumes:
  backend_data: {}
```

**Comandos principais**:
```bash
docker compose up -d --build      # Subir ambos os containers
docker compose down                # Desligar ambos
docker compose logs -f             # Ver logs
docker compose ps                  # Status
docker compose exec backend bash   # Shell no backend
```

**Vantagens**:
- Um comando para subir tudo
- Containers se comunicam automaticamente
- Fácil para desenvolvimento local
- Simula ambiente de produção

---

### Git & GitHub
**Classificação**: Versionamento + Repositório  
**Linguagem**: CLI  
**Função Principal**: Histórico de código + colaboração

**Fluxo de branches**:
```
main (produção - sempre estável)
  ↑
homolog (testes - antes de ir para produção)
  ↑
dev (desenvolvimento - código mais novo)
  ↑
feature/tela-exames
feature/melhorias-pacientes-ia-atendimentos
```

**Repositório**: https://github.com/italobaracho/copilot-medico-atualizado

**Commits importantes**:
```
✅ a44d0bc feat: integra tabela de pacientes...
✅ eb708b0 feat: implementa painel home...
✅ dd14256 docs(integration): atualizar planejamento...
✅ bfe7c8e feat: melhorias Pacientes, Analise-IA e Atendimentos
```

**Por que Git?**
- Backup seguro na nuvem
- Histórico completo de mudanças
- Rollback se algo quebrar
- Colaboração fácil

---

## 💾 Bancos de Dados

### SQLite
**Classificação**: Banco de Dados Relacional Leve  
**Linguagem**: SQL  
**Função Principal**: Armazenar dados estruturados (usuários, sessões)

**Características**:
```
- Arquivo único (.db)
- Sem servidor separado
- ACID compliant
- Limite: ~1TB por arquivo
- Perfeito para apps < 1GB dados
```

**Localização**: `/app.db` dentro do container

**Tabelas criadas**:
```sql
-- Usuários (autenticação)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    profiles TEXT  -- JSON
);

-- Sessões (tokens)
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    token TEXT UNIQUE,
    expires_at TIMESTAMP
);

-- Logs (auditoria)
CREATE TABLE logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT,
    timestamp TIMESTAMP
);
```

**Alternativas**:
- PostgreSQL (mais poderoso, requer servidor)
- MySQL (popular, complexo)
- MongoDB (NoSQL, para dados flexíveis)

---

### JSON Files (Persistência Custom)
**Classificação**: Persistência Sem Servidor  
**Linguagem**: JSON  
**Função Principal**: Armazenar pacientes, exames, agendamentos

**Arquivos**:
```
patients_db.json        (~2-5MB, 50+ pacientes)
agendamentos.json       (~500KB, 100+ agendamentos)
transcription_logs.json (~1MB, histórico de transcrições)
```

**Exemplo de `patients_db.json`**:
```json
{
  "patient_001": {
    "id": "patient_001",
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "age": 45,
    "gender": "M",
    "created_at": "2026-06-01T10:00:00",
    "consultations": [
      {
        "id": "cons_001",
        "date": "2026-06-28T14:30:00",
        "title": "Consulta de Rotina",
        "type": "Consulta",
        "has_transcription": true,
        "audio_file": "audio_001.wav"
      }
    ],
    "exames": [
      {
        "id": "exam_001",
        "nome": "Hemograma",
        "data": "28 JUN",
        "ano": "2026",
        "horario": "14:35"
      }
    ]
  }
}
```

**Por que JSON em vez de database?**
- Leitura muito rápida (não precisa SQL)
- Fácil de debugar (abrir em editor)
- Sem overhead de ORM
- Suficiente para MVP
- Backup fácil (git)

**Conversão futura**:
```
JSON Files → PostgreSQL (escala maior)
```

---

### Filesystem (Armazenamento de Arquivos)
**Classificação**: Persistência de Arquivos Binários  
**Linguagem**: I/O de Sistema  
**Função Principal**: Armazenar áudios e PDFs

**Estrutura**:
```
API/
├── audios/
│   ├── audio_001.wav    (~2-5MB cada)
│   └── audio_002.wav
├── pdfs/
│   ├── hemograma_001.pdf
│   └── ecocardiograma_002.pdf
└── backend/
```

**Metadados em JSON**:
```json
{
  "audio_001": {
    "filename": "audio_001.wav",
    "patient_id": "patient_001",
    "size": 2400000,  // bytes
    "duration": 125,  // segundos
    "format": "WAV",
    "sample_rate": 16000,
    "created_at": "2026-06-28T14:30:00"
  }
}
```

**Alternativas**:
- AWS S3 (nuvem, escalável)
- Azure Blob Storage (Microsoft)
- MinIO (storage distribuído open-source)

---

## 🛠️ Ferramentas de Desenvolvimento

### Node.js + NPM
**Classificação**: Runtime JavaScript  
**Função Principal**: Executar Vite e gerenciar dependências

**Instalação de dependências**:
```bash
npm install                # Instala de package.json
npm install react@latest   # Instala pacote específico
npm run dev                # Rodar Vite em desenvolvimento
npm run build              # Build para produção
npm run lint               # ESLint
```

**Versão**: 18 LTS ou superior  
**Alternativas**: Yarn, PNPM

---

### ESLint
**Classificação**: Linter (Verificador de Código)  
**Linguagem**: JavaScript  
**Função Principal**: Encontrar erros e padrões ruins

**Arquivo**: `.eslintrc.json`
```json
{
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true }
  },
  "rules": {
    "no-unused-vars": ["warn"],
    "no-console": ["warn"]
  }
}
```

**Exemplo de erro detectado**:
```javascript
// ❌ Variável não usada
const unusedVar = 123;

// ❌ Console deixado no código
console.log('debug');

// ✅ Erroring detecta ambos
```

**Alternativas**: Prettier (formatação), SonarQube (análise profunda)

---

### VS Code
**Classificação**: Editor de Código  
**Função Principal**: Escrever e debugar código

**Extensões usadas**:
```
- ES7+ React/Redux/React-Native snippets
- Python
- Pylance
- Docker
- GitLens
- Thunder Client (tester HTTP)
```

**Shortcuts úteis**:
```
Ctrl+F        Buscar texto
Ctrl+H        Buscar e substituir
Ctrl+Shift+P  Palette de comandos
Ctrl+/        Comentar/descomentar
F5            Iniciar debugger
```

---

### Postman / Thunder Client
**Classificação**: Testador de APIs  
**Função Principal**: Testar endpoints antes de integrar

**Exemplo de requisição**:
```
POST http://localhost:3001/api/patients
Header: Authorization: Bearer eyJhbG...
Body: {
  "name": "João Silva",
  "cpf": "123.456.789-00"
}
Response: { "status": "success", "id": "patient_001" }
```

---

## 📚 Bibliotecas Externas

### Backend (Python)

| Biblioteca | Versão | Função |
|-----------|--------|--------|
| Flask | 3.0+ | Servidor web |
| PyJWT | 2.8+ | Autenticação JWT |
| Werkzeug | 3.0+ | WSGI utilities |
| PyPDF2 | 5.0+ | Leitura de PDFs |
| Groq | 0.5+ | IA Groq SDK |
| Flask-CORS | 4.0+ | CORS headers |
| python-dotenv | 1.0+ | Variáveis .env |

### Frontend (JavaScript/Node)

| Biblioteca | Versão | Função |
|-----------|--------|--------|
| React | 19.2+ | Framework UI |
| Vite | 8.0+ | Build tool |
| Lucide-react | 1.17+ | Ícones SVG |
| React DOM | 19.2+ | Render React |

---

## 📊 Esquema Visual Completo

```
┌────────────────────────────────────────────────────────────────────┐
│                         CAMADA DO USUÁRIO                         │
│                      Médico / Recepcionista                        │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                  (Navegador Chrome/Edge)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    CAMADA APRESENTAÇÃO                            │
│                    React 19 + Vite 8 + CSS                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ HomeView  PacienteView  AtendimentosView  AnaliseIAView  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Lucide Icons  Web Speech API  Estilos CSS-in-JS         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  Porta: 5173 (Vite Dev)                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    HTTP REST / JSON
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    CAMADA APLICAÇÃO                               │
│                  Flask + Python 3.11                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  @app.route('/api/patients')                             │   │
│  │  @app.route('/api/analise-ia')                           │   │
│  │  @app.route('/api/extract-pdf')                          │   │
│  │  @roles_required(validação)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                  Porta: 3001 (Flask)                              │
└────────────────────────┬──────────────────────┬──────────────────┘
                         │                      │
         ┌───────────────┴──────────────┐       │
         │                              │       │
    ┌────▼──────────┐          ┌────────▼────┐ │
    │ Processamento │          │ Integração  │ │
    │               │          │ com IAs     │ │
    │ • PyPDF2      │          │             │ │
    │ • JWT         │          │ • Groq API  │ │
    │ • CORS        │          │ • Whisper   │ │
    │ • Text Filter │          └─────────────┘ │
    └────┬──────────┘                          │
         │                                     │
    ┌────▼──────────────────────────────────────┴──┐
    │         CAMADA DE DADOS                      │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  ┌───────────────┐  ┌────────────────────┐  │
    │  │    SQLite     │  │   JSON Files       │  │
    │  │  (/app.db)    │  │ (*.json)           │  │
    │  │               │  │                    │  │
    │  │ • Usuários    │  │ • Pacientes        │  │
    │  │ • Sessões     │  │ • Agendamentos     │  │
    │  │ • Logs        │  │ • Transcrições     │  │
    │  └───────────────┘  └────────────────────┘  │
    │                                              │
    │  ┌──────────────────────────────────────┐   │
    │  │  Filesystem                          │   │
    │  │  • /audios (*.wav)                   │   │
    │  │  • /pdfs (*.pdf)                     │   │
    │  └──────────────────────────────────────┘   │
    │                                              │
    └──────────────────────────────────────────────┘
```

---

## 📋 Resumo por Categoria

### Frontend (3 principais)
1. **React 19** - Renderização de UI
2. **Vite 8** - Build otimizado
3. **Web Speech API** - Transcrição de áudio

### Backend (2 principais)
1. **Flask 3.0** - Servidor HTTP
2. **Python 3.11** - Linguagem base

### IA (1 principal)
1. **Groq Llama 3.3 70B** - Análise diagnóstica

### DevOps (2 principais)
1. **Docker** - Containerização
2. **Docker Compose** - Orquestração

### Dados (2 principais)
1. **SQLite** - Banco relacional
2. **JSON + Filesystem** - Persistência custom

### Total de Tecnologias: **20+**

---

## 🎓 Como Explicar ao Professor

### Script de Apresentação (3 minutos)

```
"Desenvolvemos um sistema de telemedicina com IA usando:

1. FRONTEND:
   - React 19 para a interface do médico
   - Web Speech API para transcrever áudio em tempo real
   - Vite para build rápido

2. BACKEND:
   - Flask para criar endpoints (API REST)
   - Python para lógica de negócio
   - SQLite para dados estruturados
   - JSON para armazenar pacientes/exames

3. INTELIGÊNCIA ARTIFICIAL:
   - Groq Llama 3.3 70B para análise diagnóstica
   - PyPDF2 para extrair texto de exames

4. INFRAESTRUTURA:
   - Docker para containerizar backend e frontend
   - Docker Compose para orquestrar
   - GitHub para versionamento

5. SEGURANÇA:
   - JWT para autenticação
   - Filtro LGPD para remover nomes
   - CORS para proteção entre domínios

Total de 45+ commits, 11 telas implementadas,
funcionando em Docker localmente."
```

---

**Documento gerado**: 28 de junho de 2026  
**Versão**: 1.0  
**Próxima atualização**: Com deploy em produção

