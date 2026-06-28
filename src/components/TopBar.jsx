import { Bell } from 'lucide-react';
import theme from '../theme';

// Barra superior compartilhada por todas as telas autenticadas.
// Mostra o sino de notificações e o "chip" do usuário logado,
// exatamente como nas telas de referência.
export default function TopBar({ user, profileName }) {
  const nome = user?.name || 'Dr. Rafael Menezes';
  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  return (
    <div style={styles.bar}>
      <div style={styles.bell}>
        <Bell size={20} color="#475569" />
        <span style={styles.badge}>3</span>
      </div>

      <div style={styles.userChip}>
        <div style={styles.avatar}>{iniciais || 'DR'}</div>
        <div style={styles.userText}>
          <span style={styles.userName}>{nome}</span>
          <span style={styles.userSub}>{profileName ? `Perfil: ${profileName}` : 'Clínica Exemplo'}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },
  bell: { position: 'relative', cursor: 'pointer', padding: '6px' },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: theme.colors.danger,
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    minWidth: '16px',
    height: '16px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  userChip: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
  },
  userText: { display: 'flex', flexDirection: 'column', lineHeight: 1.2 },
  userName: { fontSize: '14px', fontWeight: 700, color: theme.colors.text },
  userSub: { fontSize: '12px', color: theme.colors.textMuted },
};
