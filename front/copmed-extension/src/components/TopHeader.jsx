import { useState } from "react";
import {
  FiBell,
  FiX,
  FiChevronDown,
  FiUser,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";

function TopHeader({ titulo, descricao, usuarioLogado, notificacoes = [] }) {
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const nomeUsuario = usuarioLogado?.nome || "Usuário";
  const clinicaUsuario = usuarioLogado?.clinica || "Clínica";

  const iniciais = nomeUsuario
    .split(" ")
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="top-header">
        <div>
          <h1>{titulo}</h1>
          <p>{descricao}</p>
        </div>

        <div className="user-area">
          <button
            type="button"
            className="notification-box"
            onClick={() => setMostrarNotificacoes(true)}
          >
            <FiBell size={20} />
            <span className="notification-badge">{notificacoes.length}</span>
          </button>

          <button
            type="button"
            className="profile-area"
            onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
          >
            <div className="profile-avatar">{iniciais}</div>

            <div className="profile-info">
              <strong>{nomeUsuario}</strong>
              <p>{clinicaUsuario}</p>
            </div>

            <FiChevronDown />
          </button>

          {mostrarMenuUsuario && (
            <div className="profile-menu">
              <button type="button">
                <FiUser />
                Ver perfil
              </button>

              <button type="button">
                <FiPlusCircle />
                Adicionar conta
              </button>

              <button type="button" className="logout-option">
                <FiLogOut />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>

      {mostrarNotificacoes && (
        <div className="modal-overlay">
          <div className="modal-card modal-menor">
            <div className="modal-header">
              <div>
                <h3>Notificações</h3>
                <p>Atualizações recentes do sistema.</p>
              </div>

              <button
                type="button"
                className="btn-fechar-form"
                onClick={() => setMostrarNotificacoes(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="notificacoes-lista">
              {notificacoes.length === 0 ? (
                <div className="notificacao-item">
                  Nenhuma notificação no momento.
                </div>
              ) : (
                notificacoes.map((notificacao) => (
                  <div className="notificacao-item" key={notificacao.id}>
                    <strong>{notificacao.titulo}</strong>
                    <p>{notificacao.descricao}</p>
                    {notificacao.data && <small>{notificacao.data}</small>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopHeader;