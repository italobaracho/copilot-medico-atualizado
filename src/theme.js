// ============================================================
// DESIGN TOKENS - Copilot Médico
// ------------------------------------------------------------
// Centraliza a paleta de cores, espaçamentos e sombras do sistema.
// REGRA PARA O TIME: ao criar um componente novo, use SEMPRE as
// cores daqui (ex.: theme.colors.primary) em vez de escrever o
// código hexadecimal direto. Assim, se a marca mudar de cor,
// trocamos em um único lugar.
// ============================================================

export const theme = {
  colors: {
    // Marca
    primary: '#0046fe',       // Azul principal (botões, links, ativos)
    primaryHover: '#003cd0',  // Azul no hover
    primaryDark: '#0b45d0',   // Azul escuro (tela de login)
    primarySoft: '#eff6ff',   // Azul bem claro (fundo de item ativo)

    // Superfícies
    bg: '#f8fafc',            // Fundo geral das páginas
    surface: '#ffffff',       // Fundo de cards
    border: '#e2e8f0',        // Bordas suaves

    // Texto
    text: '#0f172a',          // Texto principal / títulos
    textMuted: '#64748b',     // Texto secundário
    textSoft: '#94a3b8',      // Placeholder / texto desativado

    // Status clínico (usado em laudos e exames)
    success: '#16a34a',
    successSoft: '#dcfce7',
    warning: '#d97706',
    warningSoft: '#fef3c7',
    danger: '#dc2626',
    dangerSoft: '#fee2e2',
    purple: '#7c3aed',
    purpleSoft: '#f5f3ff',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    pill: '999px',
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.06)',
    cardHover: '0 12px 20px -3px rgba(0,70,254,0.08)',
    pop: '0 4px 12px rgba(0,0,0,0.1)',
  },
  layout: {
    sidebarWidth: 256,         // Sidebar aberta
    sidebarCollapsed: 80,      // Sidebar recolhida (só ícones)
    topbarHeight: 72,
  },
};

export default theme;