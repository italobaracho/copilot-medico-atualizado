# Plano de Implementação — Padronização das Telas (Copilot Médico)

> Documento para o time de tecnologia (1 gerente, 1 líder técnico, 5 devs).
> Linguagem propositalmente simples. Objetivo: deixar o sistema igual às
> 11 telas de referência (paleta, layout e responsividade) e organizar o fluxo
> de Git (dev → homolog → main).

---

## 1. O que já foi feito nesta entrega

Branch: **`feature/ui-telas-referencia`** → mesclada em **`dev`**.

| # | Mudança | Arquivo |
|---|---------|---------|
| 1 | **Tokens de tema** (paleta única) | `src/theme.js` |
| 2 | **Helper de API** (fim das URLs "chumbadas") | `src/api.js` |
| 3 | **Sidebar larga com rótulos + colapsável** | `src/components/Sidebar.jsx` |
| 4 | **TopBar** (sino + usuário) compartilhada | `src/components/TopBar.jsx` |
| 5 | **Dashboard** novo (cards, agenda, atividades, donut, insights) | `src/components/HomeView.jsx` |
| 6 | **Lista de Pacientes** virou **tabela** (busca + paginação) | `src/components/PacienteView.jsx` |
| 7 | **Novo paciente**: formulário completo | `src/components/CadastroView.jsx` |
| 8 | **Layout** (margem dinâmica da sidebar, rotas das telas) | `src/App.jsx` |
| 9 | **Backend**: listagem de pacientes passou a devolver `cpf` e `gender` | `API/backend/patient_db.py` |
| 10 | **CSS global** + `.gitignore` (ignorar `__pycache__`, `*.mp4`) | `src/index.css`, `.gitignore` |

> Os dados do Dashboard (agenda, atividades, donut, insights) são **mock**
> (dados fixos), conforme combinado. Os pontos para ligar ao backend estão
> marcados no código com o comentário `// TODO BACKEND`.

### Gravação de voz (frontend) — agora utilizável
Antes, a gravação existia **só no backend** (`POST /api/transcribe_audio`), sem
botão na tela. Foi adicionado um **microfone no chat do Assistente IA** do paciente
(`src/components/PacienteView.jsx`), que:
1. grava pelo navegador (`MediaRecorder`);
2. converte para WAV (`src/utils/wav.js`) — formato que o backend transcreve melhor;
3. envia para `/api/transcribe_audio` e coloca a transcrição no campo de mensagem
   para o médico revisar antes de enviar.

> Observação: como o modelo **Vosk** não está embarcado no container, a transcrição
> usa o fallback do Google (precisa de internet). Para diarização (Médico/Paciente),
> baixar o modelo para `API/backend/vosk-model-small-pt-0.3/`.

---

## 2. O que falta — tela "Análise com IA / Laudo Laboratorial" (imagens 8 a 11)

Esta é a única tela grande que **não** foi implementada (decisão: distribuir ao time).
Hoje o item de menu "Análise com IA" abre um placeholder em `App.jsx` (view `analise-ia`).

### Tarefa para os devs (sugestão: 1 dev, 2–3 dias)
Criar `src/components/AnaliseIAView.jsx` e renderizá-lo em `App.jsx` quando
`currentView === 'analise-ia'` (hoje cai no `PLACEHOLDER_TITLES`).

A tela tem **5 blocos numerados** (ver imagens 8–11):

1. **Identificação do paciente** — card com nome, CPF, idade, contato, e à direita:
   nº do laudo, solicitante (médico/CRM), datas de coleta/liberação, laboratório.
2. **Resultados dos exames** — tabela agrupada por exame (ex.: HEMOGRAMA,
   PCR), colunas: Exame · Resultado · Unidade · Referência · Status.
   Status com cor: **Normal** (verde), **Atenção** (amarelo), **Crítico** (vermelho)
   → usar `theme.colors.success / warning / danger`.
3. **Descritivo do resultado** — texto corrido.
4. **Possíveis hipóteses de diagnóstico (IA)** — 3 cards com % de probabilidade
   e badge "Gerado por IA". Tag "Mais provável" no primeiro.
5. **Orientações médicas (IA)** — lista de recomendações + rodapé com
   responsável técnico e "assinatura digital".

Botões no topo: **Exportar PDF** e **Imprimir**.

### Backend necessário (1 dev)
- `GET /api/patients/:id/laudos` e `GET /api/laudos/:id` devolvendo a estrutura
  dos 5 blocos. As hipóteses/orientações já podem reutilizar a IA (Gemini/Groq)
  que hoje roda no chat (`/api/recommendations`).
- Reaproveitar o `pdf_reader.py` para a importação e o resultado dos exames.

### Dica de reuso
Os estilos de card, tabela e status já existem em `theme.js` e em
`PacienteView.jsx` (tabela). Copiar o padrão de lá acelera muito.

---

## 3. Gargalos identificados (do mais fácil ao mais estratégico)

| Prioridade | Gargalo | Por que importa | Correção sugerida (fácil) |
|-----------|---------|------------------|---------------------------|
| ✅ Feito | URLs `http://localhost:3001` espalhadas | Quebra em homolog/produção | Centralizado em `src/api.js` (usa `VITE_API_URL`). **Migrar os fetches restantes** que ainda usem string fixa. |
| ✅ Feito | Listagem só trazia id+name | Tabela não mostrava CPF/Gênero | Backend agora devolve `cpf`/`gender`. |
| 🟢 Fácil | `__pycache__` e `.mp4` versionados | Polui o repositório | Já adicionados ao `.gitignore`; rodar `git rm -r --cached` para remover os já commitados. |
| 🟢 Fácil | Pastas legado: `scr/`, `front/`, `dist/`, `exames/` | Confusão sobre o que é usado | Revisar e remover o que não é mais usado (combinar em reunião). |
| 🟡 Médio | Estilos **inline** gigantes em cada componente | Dificulta padronizar e **impede media queries** (responsividade real) | Migrar gradualmente para **CSS Modules** ou **Tailwind**. Começar pelos componentes novos. |
| 🟡 Médio | `PacienteView.jsx` com ~1000 linhas | Difícil de manter e revisar | Quebrar em: `PacienteLista`, `PacienteDetalhe`, `ChatIA`, `ExamesTab`. |
| 🟡 Médio | `alert()`/`prompt()` para erros e ações | Experiência ruim e trava testes | Trocar por toasts/modais (ex.: lib leve de toast). |
| 🟠 Estratégico | Sem testes no frontend | Regressões silenciosas | Adicionar Vitest + Testing Library nos componentes novos. |
| 🟠 Estratégico | Segredos no `docker-compose.yml` (chaves/senha) | Risco de segurança | Mover para `.env` (não versionado) e usar `secrets`. |

---

## 4. Fluxo de Git recomendado (dev → homolog → main)

```
feature/<algo>  →  (PR)  →  dev  →  (PR)  →  homolog  →  (PR)  →  main
```

Regras combinadas:
- **`main` é protegida**: somente o líder técnico faz a mesclagem final.
- Todo trabalho começa em uma branch `feature/...` saindo de `dev`.
- `dev` é a integração; `homolog` é para validação; `main` é produção.

### ⚠️ Pendência de integração detectada
A branch **`feature/backend-start-recording`** (gravação de voz, feita ontem)
**ainda NÃO está em `dev` nem em `homolog`**. Ela está 1 commit à frente de `dev`
(`78eb2ed feat: add backend endpoint to start consultation recording`).
👉 É preciso abrir um PR dessa branch para `dev` para não perder a integração.

---

## 5. Como rodar localmente

```bash
docker compose up -d --build      # sobe backend (3001) e frontend (5173)
# Acessar http://localhost:5173
# Login de teste: doctor@example.com / StrongPass123!  (perfil: Médico)
```

> Observação: o modelo de voz (Vosk) não está dentro da imagem do backend
> (`vosk-model-small-pt-0.3/` está no `.gitignore`). Para a transcrição funcionar,
> baixar o modelo e colocá-lo em `API/backend/` — está documentado no warning do log.
