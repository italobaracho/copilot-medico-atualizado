import './App.css'
import logo_copilot from './assets/logo_copilot_med.png'
import logo_seguranca from './assets/logo_seguranca.png'
import logo_ia from './assets/logo_ia.png'
import logo_perfil from './assets/logo_perfil.png'

function App() {
  return (
    <div className="container-principal">
      
      {/* LADO ESQUERDO AZUL */}
      <div className="lado-esquerdo">
        <div className="conteudo-esquerdo">
          
          <div className="logo">
              <img src={logo_copilot} alt="Logo copilot" height="60" />
              <div className="texto_logo">
                <span className="titulo_logo">Copilot Medico</span>
                <span className="subtitulo_logo">Documentação Clínica com IA</span>
              </div>
          </div>
          
          <h1>
            Inteligência que
            <br/>
            cuida da saúde.
          </h1>
          
          <p>
            A plataforma completa para profissionais,
            <br/>
            pacientes e gestores de clínicas.
          </p>

          {/* O BLOCO DE SEGURANÇA */}
          <div className="logo_seguranca">
              <img src={logo_seguranca} alt="Logo seguranca" height="60" />
              <div className="texto_seguranca">
                <span className="titulo_seguranca">Segura e confiável</span>
                <span className="subtitulo_seguranca">
                  Seus dados protegidos com
                  <br/>
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
                  <br/>
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
                  <br/>
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

          <form>
            <div className="campo">
              <label>E-mail</label>
              <input type="email" placeholder="Digite seu e-mail" />
            </div>
            
            <div className="campo">
              <label>Senha</label>
              <input type="password" placeholder="Digite sua senha" />
            </div>

            <div className="opcoes-extras">
              <label>
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a href="#">Esqueci minha senha</a>
            </div>

            <button type="button" className="btn-entrar">Entrar</button>
            
            <div className="separador">ou</div>

            <button type="button" className="btn-google">Entrar com Google</button>
          </form>

          <p className="rodape">Ainda não tem uma conta? <a href="#">Fale com sua instituição.</a></p>
        </div>
      </div>

    </div>
  )
}

export default App
