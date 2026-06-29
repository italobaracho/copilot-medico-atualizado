import { useState } from 'react';
import '../App.css';
import logo_copilot from '../assets/logo_copilot_med.png';
import logo_seguranca from '../assets/logo_seguranca.png';
import logo_ia from '../assets/logo_ia.png';
import logo_perfil from '../assets/logo_perfil.png';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('doctor@example.com');
  const [password, setPassword] = useState('StrongPass123!');
  const [profile, setProfile] = useState('medico');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // --- MODO DE TESTE ATIVADO (Ignorando o backend temporariamente) ---
  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg('');

    // Força o login de sucesso imediatamente sem fazer requisição HTTP
    onLoginSuccess(
      { id: 1, name: "Médico Teste", email: email }, 
      "token-fake-de-sessao", 
      profile
    );

    setLoading(false);
  };
  
  // Se precisar voltar ao normal depois, basta apagar o bloco acima 
  // e descomentar o bloco original do fetch que está guardado abaixo.
  /*
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('E-mail e senha são obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, profile }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        onLoginSuccess(data.user, data.token, data.profile.name);
      } else {
        setErrorMsg(data.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro de conexão com o servidor. Garanta que o backend está online.');
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <div className="container-principal">
      {/* LADO ESQUERDO AZUL */}
      <div className="lado-esquerdo">
        <div className="conteudo-esquerdo">
          <div className="logo">
            <img src={logo_copilot} alt="Logo copilot" height="60" />
            <div className="texto_logo">
              <span className="titulo_logo">Copilot Médico</span>
              <span className="subtitulo_logo">Documentação Clínica com IA</span>
            </div>
          </div>

          <h1>
            Inteligência que
            <br />
            cuida da saúde.
          </h1>

          <p>
            A plataforma completa para profissionais,
            <br />
            pacientes e gestores de clínicas.
          </p>

          {/* O BLOCO DE SEGURANÇA */}
          <div className="logo_seguranca">
            <img src={logo_seguranca} alt="Logo seguranca" height="60" />
            <div className="texto_seguranca">
              <span className="titulo_seguranca">Segura e confiável</span>
              <span className="subtitulo_seguranca">
                Seus dados protegidos com
                <br />
                tecnologia de ponta.
              </span>
            </div>
          </div>

          {/* O BLOCO DE IA */}
          <div className="logo_ia">
            <img src={logo_ia} alt="Logo ia" height="60" />
            <div className="texto_ia">
              <span className="titulo_ia">IA que entende você</span>
              <span className="subtitulo_ia">
                Documentação clínica mais rápida
                <br />
                e precisa.
              </span>
            </div>
          </div>

          {/* O BLOCO DE Perfil */}
          <div className="logo_perfil">
            <img src={logo_perfil} alt="Logo perfil" height="60" />
            <div className="texto_perfil">
              <span className="titulo_perfil">Para todos os perfis</span>
              <span className="subtitulo_perfil">
                Soluções completas para cada
                <br />
                necessidade.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO BRANCO */}
      <div className="lado-direito">
        <div className="formulario-login">
          <h2>Bem-vindo(a) de volta!</h2>
          <p className="subtitulo">Faça login para acessar sua conta</p>

          {errorMsg && (
            <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #fee2e2' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="campo">
              <label>E-mail</label>
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="campo">
              <label>Senha</label>
              <input 
                type="password" 
                placeholder="Digite sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="campo">
              <label>Perfil de Acesso</label>
              <select 
                value={profile} 
                onChange={(e) => setProfile(e.target.value)}
                style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option value="medico">Médico</option>
                <option value="administrador">Administrador</option>
                <option value="recepcao">Recepção</option>
                <option value="usuario">Usuário</option>
              </select>
            </div>

            <div className="opcoes-extras">
              <label>
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a href="#">Esqueci minha senha</a>
            </div>

            <button type="submit" className="btn-entrar" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="separador">ou</div>

            <button type="button" className="btn-google">Entrar com Google</button>
          </form>

          <p className="rodape">Ainda não tem uma conta? <a href="#">Fale com sua instituição.</a></p>
        </div>
      </div>
    </div>
  );
}
