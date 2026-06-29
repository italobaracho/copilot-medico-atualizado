import './AnaliseIA.css';

function AnaliseIA() {
  return (
    <div className="container-laudo">
      
      {/* CABEÇALHO */}
      <div className="cabecalho-laudo">
        <div>
          <h1>Laudo Laboratorial</h1>
          <p>Emitido em  <span className="tag-finalizado">Finalizado</span></p>
        </div>
        <div className="botoes-acao">
          <button>Exportar PDF</button>
          <button>Imprimir</button>
        </div>
      </div>

      {/* BLOCO 1: IDENTIFICAÇÃO DO PACIENTE */}
      <div className="cartao">
        
        <div className="titulo-secao">
          <span className="numero">1</span>
          <h2>Identificação do paciente</h2>
        </div>

        <div className="conteudo-bloco-1">
          {/* Coluna da Esquerda: Dados do Paciente */}
          <div className="paciente-info">
            <div className="avatar">MS</div>
            <div className="dados-pessoais">
              <h3>Maria Silva</h3>
              <p className="documentos">
                CPF: 123.456.789-00 <span className="separador-ponto">•</span> Feminino <span className="separador-ponto">•</span> 37 anos (12/04/1988)
              </p>
              <div className="contatos">
                <span>📞 (11) 99999-9999</span>
                <span>✉️ maria.silva@email.com</span>
              </div>
              <div className="endereco">
                <span>📍 Rua das Flores, 123 - Jardim Paulista, São Paulo - SP, 01400-000</span>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Dados do Laudo */}
          <div className="laudo-info">
            <div className="linha-info">
              <span className="rotulo">Nº do laudo</span>
              <span className="valor">LAB-2025-000123</span>
            </div>
            <div className="linha-info">
              <span className="rotulo">Solicitante</span>
              <span className="valor">Dr. Rafael Menezes (CRM 123456-SP)</span>
            </div>
            <div className="linha-info">
              <span className="rotulo">Data da coleta</span>
              <span className="valor">10/05/2025 às 07:30</span>
            </div>
            <div className="linha-info">
              <span className="rotulo">Data de liberação</span>
              <span className="valor">12/05/2025 às 10:23</span>
            </div>
            <div className="linha-info">
              <span className="rotulo">Laboratório</span>
              <span className="valor">Clínica Exemplo - Laboratório Central</span>
            </div>
          </div>
        </div>

      </div>

      {/* BLOCO 2: RESULTADOS DOS EXAMES (A TABELA) */}
      <div className="cartao">
        
        <div className="titulo-secao">
          <span className="numero">2</span>
          <h2>Resultados dos exames</h2>
        </div>

        <table className="tabela-exames">
          <thead>
            <tr>
              <th>Exame</th>
              <th>Resultado</th>
              <th>Unidade</th>
              <th>Referência</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            
            {/* GRUPO 1: HEMOGRAMA */}
            <tr className="linha-grupo">
              <td colSpan="5">🔬 HEMOGRAMA COMPLETO</td>
            </tr>
            <tr>
              <td>Hemoglobina</td>
              <td>13,2</td>
              <td>g/dL</td>
              <td>12,0 - 15,5</td>
              <td><span className="status normal">✅ Normal</span></td>
            </tr>
            <tr>
              <td>Leucócitos</td>
              <td>12.800</td>
              <td>/mm³</td>
              <td>4.000 - 10.000</td>
              <td><span className="status atencao">⚠️ Atenção</span></td>
            </tr>
            <tr>
              <td>Linfócitos</td>
              <td>15,0</td>
              <td>%</td>
              <td>20,0 - 40,0</td>
              <td><span className="status critico">❌ Crítico</span></td>
            </tr>

            {/* GRUPO 2: PCR */}
            <tr className="linha-grupo">
              <td colSpan="5">🧬 PCR ULTRASSENSÍVEL</td>
            </tr>
            <tr>
              <td>Proteína C Reativa</td>
              <td>8,6</td>
              <td>mg/L</td>
              <td>&lt; 5,0</td>
              <td><span className="status atencao">⚠️ Atenção</span></td>
            </tr>

          </tbody>
        </table>

      </div>

      {/* BLOCO 3: DESCRITIVO DO RESULTADO */}
      <div className="cartao">
        
        <div className="titulo-secao">
          <span className="numero">3</span>
          <h2>Descritivo do resultado</h2>
        </div>

        <div className="texto-descritivo">
          <p>
            Os exames demonstram leucocitose com neutrofilia e linfopenia relativa, além de elevação da proteína C reativa, sugerindo processo inflamatório/infeccioso.
          </p>
          <p>
            No perfil lipídico, observa-se colesterol total e LDL elevados, com triglicerídeos discretamente aumentados.
          </p>
          <p>
            Demais parâmetros do hemograma dentro dos limites de referência.
          </p>
        </div>
      </div>

      {/* BLOCO 4: HIPÓTESES IA */}
      <div className="cartao">
        
        <div className="titulo-secao">
          <span className="numero">4</span>
          <h2>Possíveis hipóteses de diagnóstico (IA)</h2>
          <span className="tag-ia">Gerado por IA</span>
        </div>

        <div className="hipoteses-grid">
          
          {/* Hipótese 1 */}
          <div className="cartao-hipotese">
            <div className="hipotese-cabecalho">
              <span className="numero-hipotese">1</span>
              <h3>Infecção bacteriana aguda</h3>
              <span className="tag-destaque">Mais provável</span>
            </div>
            <p className="hipotese-texto">
              Leucocitose com neutrofilia e elevação da PCR são compatíveis com infecção bacteriana.
            </p>
            <div className="probabilidade">
              <div className="probabilidade-info">
                <span>Probabilidade estimada</span>
                <span className="porcentagem">68%</span>
              </div>
              <div className="barra-fundo">
                <div className="barra-preenchimento" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>

          {/* Hipótese 2 */}
          <div className="cartao-hipotese">
            <div className="hipotese-cabecalho">
              <span className="numero-hipotese">2</span>
              <h3>Processo inflamatório não infeccioso</h3>
            </div>
            <p className="hipotese-texto">
              Alterações inflamatórias leves podem estar associadas a condições autoimunes ou inflamatórias.
            </p>
            <div className="probabilidade">
              <div className="probabilidade-info">
                <span>Probabilidade estimada</span>
                <span className="porcentagem">21%</span>
              </div>
              <div className="barra-fundo">
                <div className="barra-preenchimento" style={{ width: '21%' }}></div>
              </div>
            </div>
          </div>

          {/* Hipótese 3 */}
          <div className="cartao-hipotese">
            <div className="hipotese-cabecalho">
              <span className="numero-hipotese">3</span>
              <h3>Síndrome metabólica / Risco cardiovascular</h3>
            </div>
            <p className="hipotese-texto">
              Dislipidemia (LDL e triglicerídeos elevados) pode indicar risco cardiovascular aumentado.
            </p>
            <div className="probabilidade">
              <div className="probabilidade-info">
                <span>Probabilidade estimada</span>
                <span className="porcentagem">11%</span>
              </div>
              <div className="barra-fundo">
                <div className="barra-preenchimento" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>

        </div>

        <div className="aviso-medico">
          <span>ⓘ</span> As hipóteses apresentadas não substituem julgamento clínico e devem ser interpretadas pelo médico responsável.
        </div>
      </div>

      {/* BLOCO 5: ORIENTAÇÕES MÉDICAS (IA) */}
      <div className="cartao">
        
        <div className="titulo-secao">
          <span className="numero">5</span>
          <h2>Orientações médicas (IA)</h2>
          <span className="tag-ia">Gerado por IA</span>
        </div>

        <div className="caixa-orientacoes">
          <ul className="lista-orientacoes">
            <li>
              <span className="icone-orientacao">🩺</span>
              <p>Correlacionar os achados laboratoriais com a avaliação clínica. Investigar presença de sintomas de infecção (febre, dor, secreções, etc.).</p>
            </li>
            <li>
              <span className="icone-orientacao">🧪</span>
              <p>Considerar repetição do hemograma e PCR em 7-10 dias ou conforme evolução clínica.</p>
            </li>
            <li>
              <span className="icone-orientacao">💙</span>
              <p>Para dislipidemia: orientar medidas de estilo de vida (dieta equilibrada, prática de exercícios, controle de peso). Avaliar necessidade de tratamento medicamentoso conforme estratificação de risco cardiovascular.</p>
            </li>
            <li>
              <span className="icone-orientacao">📄</span>
              <p>Avaliar outros exames complementares conforme contexto clínico (ex.: função hepática, TSH, glicemia de jejum).</p>
            </li>
          </ul>
        </div>

      </div>

      {/* RODAPÉ FINAL DO LAUDO (Assinaturas) */}
      <div className="rodape-laudo">
        <div className="responsavel">
          <span className="titulo-responsavel">Responsável técnico</span>
          {/* Se tiver a imagem da assinatura cursiva, poderia entrar uma tag <img> aqui */}
          <span className="nome-responsavel">Dra. Ana Paula Souza</span>
          <span className="crm">CRM 98765-SP</span>
        </div>
        
        <div className="assinatura-digital">
          <span className="icone-check">✔️</span>
          <div className="texto-assinatura">
            <span>Este laudo foi assinado digitalmente.</span>
            <span className="chave">Chave de validação: BF3A-9C21-7D4E-2B6F</span>
          </div>
        </div>
      </div>

 </div> 
  );
}
export default AnaliseIA;