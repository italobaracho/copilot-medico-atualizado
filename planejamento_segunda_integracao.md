# 📋 Planejamento da 2ª Integração - Copilot Médico

Este documento contém a divisão de tarefas (ideal para cadastro no **ClickUp**) e o plano de integração das novas funcionalidades do **segundo repositório** (`Jamuelton/copilot_medico_grupo_6_es/tree/develop`).

Como nossa equipe é composta por desenvolvedores iniciantes, as tarefas foram descritas de forma **fácil, direta e objetiva**, com critérios de aceitação claros.

---

## 👥 Estrutura da Equipe e Papéis

*   **Gerente de Projetos (GP)**: Responsável por gerenciar os prazos e organizar o ClickUp.
*   **Líder Técnico (Você)**: Responsável por tirar dúvidas, revisar o código e fazer a **aprovação final (Merge para a `main`)**.
*   **Desenvolvedores Backend (2 pessoas)**: Dev 1 e Dev 2.
*   **Desenvolvedores Frontend (3 pessoas)**: Dev 3, Dev 4 e Dev 5.

---

## 📂 Visão Geral das Novas Funcionalidades (2º Repositório)

O segundo grupo focou fortemente em **Áudio, Transcrição em tempo real, Diarização de Voz e Recomendações**. Nosso objetivo é trazer essas novidades para o nosso sistema atual que já é bonito e funcional. As principais adições são:
1.  **Captura de Áudio**: Gravação do atendimento pelo microfone diretamente na interface web.
2.  **Controle de Gravação**: Botões para Gravar, Pausar, Retomar e Parar.
3.  **Diarização de Voz**: Divisão automatizada do áudio transcrevendo quem é "Médico" e quem é "Paciente" (diarização ping-pong).
4.  **Log de Transcrições**: Histórico estruturado de todas as conversas gravadas por paciente.

---

## 📅 Divisão de Tarefas para o ClickUp (Fácil e Direto)

### 💻 BACKEND (2 Desenvolvedores)

---

#### 🟢 Tarefa B1 (Dev 1 - Backend)
*   **Título**: `Backend: Endpoint de Processamento de Áudio e Diarização`
*   **Objetivo**: Criar a rota no Flask que recebe o arquivo de áudio gravado no frontend, faz a transcrição e separa as falas do Médico e do Paciente.
*   **O que fazer (Passo a Passo)**:
    1.  Criar uma rota `POST /api/diarize` no arquivo `server.py`.
    2.  Essa rota deve receber um arquivo de áudio `.wav` ou `.mp3` enviado pelo frontend.
    3.  Chamar o módulo de áudio (`Diarizador` do `audio_service.py`) para transcrever o texto.
    4.  Retornar um JSON contendo o texto completo e a lista estruturada de falas (quem falou o que e em qual tempo).
*   **Critério de Aceitação**: 
    - Enviar um áudio via Postman/Insomnia para `/api/diarize` deve retornar status `200` com a transcrição dividida entre "Médico" e "Paciente".

---

#### 🟢 Tarefa B2 (Dev 2 - Backend)
*   **Título**: `Backend: Rota de Recomendações e Banco de Dados de Transcrições`
*   **Objetivo**: Criar a rota de recomendação clínica e salvar os históricos de áudios no banco JSON do paciente.
*   **O que fazer (Passo a Passo)**:
    1.  Criar uma rota `POST /api/recommendation` no `server.py`.
    2.  Essa rota deve enviar a transcrição do atendimento para o Groq (Llama-3.3) e retornar recomendações de exames ou receitas médicas recomendadas.
    3.  Atualizar a função de salvar no banco `patient_db.py` para gravar os logs de transcrições dentro da lista `"transcription_logs"` do respectivo paciente.
*   **Critério de Aceitação**:
    - Chamar `/api/recommendation` passando o texto da consulta deve retornar as sugestões da IA.
    - O banco de dados `patients_db.json` deve registrar o log de áudios e transcrições vinculados ao ID do paciente.

---

### 🎨 FRONTEND (3 Desenvolvedores)

---

#### 🔵 Tarefa F1 (Dev 3 - Frontend)
*   **Título**: `Frontend: Interface Visual do Gravador de Áudio`
*   **Objetivo**: Criar os botões e estados visuais para gravação de voz no prontuário do paciente.
*   **O que fazer (Passo a Passo)**:
    1.  No painel de atendimento do paciente, adicionar uma seção de "Gravação de Consulta".
    2.  Criar o botão de microfone (usando ícones do `lucide-react`).
    3.  Criar uma barra de progresso visual simples ou cronômetro que mostra o tempo de gravação ativo (ex: `00:15`).
*   **Critério de Aceitação**:
    - O médico deve conseguir ver a seção de gravação de áudio e os botões alinhados com o design moderno do nosso sistema.

---

#### 🔵 Tarefa F2 (Dev 4 - Frontend)
*   **Título**: `Frontend: Lógica de Captura e Pausa da Gravação (MediaRecorder)`
*   **Objetivo**: Programar a lógica que captura a voz do microfone e gerencia as ações de pausar, retomar e parar a gravação.
*   **O que fazer (Passo a Passo)**:
    1.  Utilizar a API padrão do navegador (`navigator.mediaDevices.getUserMedia` e `MediaRecorder`).
    2.  Criar funções no React: `iniciarGravação()`, `pausarGravação()`, `retomarGravação()` e `pararGravação()`.
    3.  Ao parar a gravação, gerar o arquivo Blob do áudio e enviá-lo via `fetch` (FormData) para o endpoint de backend (`/api/diarize`).
*   **Critério de Aceitação**:
    - O microfone deve acender ao gravar, conseguir ser pausado e, ao clicar em parar, disparar a requisição de envio do arquivo para o backend.

---

#### 🔵 Tarefa F3 (Dev 5 - Frontend)
*   **Título**: `Frontend: Exibição dos Logs de Transcrição e Diarização`
*   **Objetivo**: Desenhar a tela que exibe o diálogo estruturado (Médico vs Paciente) que o backend transcreveu.
*   **O que fazer (Passo a Passo)**:
    1.  Criar um painel de histórico de transcrições no prontuário.
    2.  Exibir as frases em formato de balões de conversa (tipo chat de WhatsApp):
        - Balões na esquerda com cor suave (ex: cinza) para a fala do **Paciente**.
        - Balões na direita com cor do sistema (ex: azul claro) para a fala do **Médico**.
    3.  Adicionar um botão de "Gerar Conduta por IA" que envia essa transcrição para a API de recomendações.
*   **Critério de Aceitação**:
    - A transcrição deve ser renderizada na tela de forma legível, colorida por autor da fala, e permitir solicitar a recomendação da IA com um clique.

---

## 🛠️ Boas Práticas e Regras do GitHub (Como Colaborar)

Para que o código de todos se junte de forma organizada e sem bagunça, a equipe seguirá este fluxo:

1.  **Branches**: Cada desenvolvedor deve trabalhar exclusivamente na sua branch de tarefa:
    - Exemplo: O Dev 3 cria a branch `feature/gravador-audio` a partir de `dev`.
2.  **Commits**: Seguir a escrita padronizada descrita no nosso manual de commits (ex: `feat(audio): criar botao de gravador`).
3.  **Ambiente de Integração (`dev`)**: 
    - Quando o desenvolvedor terminar, ele deve abrir um **Pull Request (PR)** apontando para a branch `dev`.
    - A gerente de projetos e os colegas revisam. Se estiver ok, o PR é aprovado para entrar na `dev`.
4.  **Ambiente de Homologação (`homolog`)**:
    - As features aprovadas na `dev` são enviadas para a `homolog` para o time testar o sistema completo rodando no Docker.
5.  **Produção (`main`)**:
    - **Apenas o Líder Técnico (Você)** faz o merge final da branch `homolog` para a `main` após garantir que não há bugs.

---

## 🧪 Plano de Testes Simples (Para Iniciantes)

Oriente sua equipe a testar cada etapa manualmente antes de abrir o Pull Request:

1.  **Teste de Microfone (Frontend)**: Clicar em gravar, falar no microfone, clicar em pausar, retomar e parar. Verificar se o navegador não trava e gera o arquivo de áudio.
2.  **Teste de API (Backend)**: Usar o Postman para enviar um áudio de teste curto para `/api/diarize`. Conferir se retorna a estrutura JSON correta com `full_text` e `dialogue`.
3.  **Teste de Integração (Sistema Completo)**: Fazer o fluxo de ponta a ponta: gravar uma conversa de 10 segundos fingindo ser médico e paciente, parar, aguardar a transcrição aparecer na tela dividida em balões de chat e clicar para a IA sugerir a conduta.
