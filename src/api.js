// ============================================================
// CONFIGURAÇÃO DE API - Copilot Médico
// ------------------------------------------------------------
// Antes, o endereço do backend (http://localhost:3001) estava
// "chumbado" (hardcoded) em vários arquivos. Isso quebra quando
// o sistema sai do computador do desenvolvedor (homolog/produção).
//
// Agora o endereço vem de uma variável de ambiente do Vite.
// Para mudar, crie um arquivo .env na raiz com:
//   VITE_API_URL=http://meu-servidor:3001
// Se nada for definido, usamos localhost (ambiente de dev).
// ============================================================

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default API_URL;
