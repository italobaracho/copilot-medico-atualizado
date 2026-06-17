# 🚀 Guia de Boas Práticas do Git para Iniciantes (Equipe Copilot Médico)

Olá, equipe! Este guia foi criado para ajudar quem está começando a usar o Git no nosso projeto. Aqui explicamos de forma simples e direta como organizar as branches, escrever commits elegantes e utilizar tags.

---

## 📂 1. O Fluxo de Trabalho (De onde eu puxo e para onde eu envio?)

No nosso projeto, temos **3 branches principais** que nunca devem receber código direto (você nunca deve fazer commits direto nelas):

1.  **`main`**: É o nosso código em produção (o que o cliente usa). Só recebe código super testado e aprovado que vem da branch `homolog`.
2.  **`homolog`**: É a nossa branch de homologação/testes de qualidade. É onde testamos tudo antes de mandar para a `main`.
3.  **`dev`**: É a branch de desenvolvimento. É aqui que juntamos o código de todo mundo da equipe para ver se tudo funciona junto.

### 📌 Como iniciar uma nova tarefa?
Sempre que você for criar uma nova funcionalidade, corrigir um bug ou criar testes, **nunca faça isso direto na `dev`**. Crie uma branch temporária a partir da `dev` usando este padrão:

*   **Para criar uma nova tela ou recurso**: `feature/nome-da-tarefa`
*   **Para corrigir um problema/bug**: `fix/nome-do-bug` ou `bugfix/nome-do-bug`
*   **Para criar testes unitários ou de integração**: `test/nome-do-teste`

#### Passo a passo no terminal:
```bash
# 1. Vá para a branch de desenvolvimento
git checkout dev

# 2. Puxe as últimas atualizações para garantir que seu código está em dia
git pull origin dev

# 3. Crie e entre na sua nova branch de trabalho
git checkout -b feature/minha-nova-tela
```

---

## 💬 2. Como escrever mensagens de commit (Conventional Commits)

Escrever boas mensagens de commit ajuda a equipe a entender o histórico do projeto sem ter que ler linha por linha do código. Usamos um padrão muito famoso chamado **Conventional Commits**:

```
tipo(escopo-opcional): mensagem curta e clara
```

### Os 3 principais tipos que mais usaremos:

#### 🟢 1. `feat` (Funcionalidade/Atualização)
Use quando estiver adicionando algo novo no sistema (telas, botões, rotas novas).
*   *Exemplo ruim*: `git commit -m "fiz o login"`
*   *Exemplo bom e prático*: `git commit -m "feat(auth): criar tela de login e salvar token JWT"`

#### 🔴 2. `fix` (Correção de Bug)
Use quando estiver consertando algo que estava quebrado ou dando erro.
*   *Exemplo ruim*: `git commit -m "arrumado"`
*   *Exemplo bom e prático*: `git commit -m "fix(api): corrigir importacao de paciente no banco"`

#### 🔵 3. `test` (Testes)
Use quando criar ou melhorar os arquivos de testes do sistema.
*   *Exemplo ruim*: `git commit -m "fiz uns testes ai"`
*   *Exemplo bom e prático*: `git commit -m "test(patient): criar teste unitario para cadastro de CPF"`

---

## 🎨 3. Rótulos (Labels) no GitHub

Quando você terminar sua tarefa e criar um **Pull Request (PR)** no GitHub para mandar seu código da sua branch para a `dev`, use os seguintes rótulos coloridos para facilitar o trabalho de quem vai revisar seu código:

*   🔴 **`bug`**: Para quando o seu código corrige um erro do sistema.
*   🟢 **`atualização`**: Para quando você está adicionando uma nova tela ou melhoria.
*   🔵 **`testes`**: Para quando você está adicionando arquivos de testes.

---

## 🎖️ 4. O que são Git Tags? (Carimbo de Versão)

Imagine as **tags** como carimbos que colocamos em commits importantes na branch `main` para marcar que aquela versão está estável e pronta. 

Usamos o formato `v[Maior].[Menor].[Correção]` (ex: `v1.0.0`):
*   **Maior**: Quando o sistema muda tanto que versões antigas deixam de funcionar.
*   **Menor**: Quando adicionamos novas funcionalidades legais (ex: a nova tela de exames).
*   **Correção**: Quando apenas corrigimos bugs pequenos.

#### Exemplo prático de como criar uma tag:
```bash
# Criar o carimbo da versão 1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 - Versão estável com login e IA integrada"

# Enviar o carimbo para o GitHub para que todos vejam
git push origin v1.0.0
```

---

## 💡 Resumo do Dia a Dia do Desenvolvedor (Cópia Rápida)

Aqui está a receita de bolo simples para o seu time seguir todo dia:

1.  `git checkout dev` (entra na dev)
2.  `git pull origin dev` (puxa o código atualizado da equipe)
3.  `git checkout -b feature/nova-funcionalidade` (cria sua branch)
4.  *Escreve o código...*
5.  `git add .` (prepara as alterações)
6.  `git commit -m "feat(nome): descrição clara"` (faz o commit padronizado)
7.  `git push origin feature/nova-funcionalidade` (envia para o GitHub)
8.  Abre um Pull Request no GitHub apontando para a branch `dev` e coloca a Label correspondente (Ex: 🟢 `atualização`).
