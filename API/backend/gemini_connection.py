import os
import json
from groq import Groq
from . import patient_db

# Configuração da API Groq
try:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("A variável de ambiente GROQ_API_KEY não foi encontrada.")
    client = Groq(api_key=api_key)
except ValueError as e:
    print(f"Erro de configuração da API Groq: {e}")
    raise

# Carregar Instrução do Sistema (Co-Pilot_medico.txt)
try:
    system_instruction_file = os.path.join(os.path.dirname(__file__), 'Co-Pilot_medico.txt')
    if not os.path.exists(system_instruction_file):
        raise FileNotFoundError(f"Arquivo de instrução do sistema não encontrado em: {system_instruction_file}")
    system_instruction_content = open(system_instruction_file, encoding='utf-8').read()
except FileNotFoundError as e:
    print(f"Erro: {e}")
    raise

# Modelo de alta performance do Groq
MODEL_NAME = "llama-3.3-70b-versatile"

def send_message(patient_id: str, consultation_id: str, message_text: str) -> str:
    """
    Envia o histórico de chat da consulta formatado junto com a nova mensagem para o Groq.
    """
    try:
        # 1. Carregar histórico da consulta específica
        history_from_db = patient_db.get_consultation_chat_history(patient_id, consultation_id)

        # 2. Formatar o histórico no padrão de Chat do Groq (sistema, usuário e assistente)
        messages = [{"role": "system", "content": system_instruction_content}]
        
        if history_from_db:
            for msg in history_from_db:
                # O banco usa 'model', mas o Groq/Llama espera 'assistant'
                role = "assistant" if msg["role"] == "model" else msg["role"]
                text = msg["parts"][0]["text"] if "parts" in msg and len(msg["parts"]) > 0 else ""
                messages.append({"role": role, "content": text})

        # 3. Enviar requisição para a API do Groq
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.3,
            max_tokens=4096,
        )

        return completion.choices[0].message.content

    except Exception as e:
        print(f"Erro ao enviar mensagem para a API Groq para paciente {patient_id}, consulta {consultation_id}: {e}")
        return f"Desculpe, ocorreu um erro de comunicação com a IA do Groq: {str(e)}"


# Estrutura (schema) que pedimos ao modelo para preencher.
# Mantemos o frontend e o backend de acordo com este formato.
ANALISE_SCHEMA_EXEMPLO = {
    "laudo": {"numero": "LAB-2025-000123", "data_emissao": "", "laboratorio": "Clínica Exemplo - Laboratório Central"},
    "resultados": [
        {
            "grupo": "HEMOGRAMA COMPLETO",
            "itens": [
                {"exame": "Hemoglobina", "resultado": "13,2", "unidade": "g/dL", "referencia": "12,0 - 15,5", "status": "Normal"}
            ],
        }
    ],
    "descritivo": "Texto corrido interpretando os achados.",
    "hipoteses": [
        {"titulo": "Infecção bacteriana aguda", "descricao": "Justificativa breve.", "probabilidade": 68, "mais_provavel": True}
    ],
    "orientacoes": ["Correlacionar com a avaliação clínica."],
}


def gerar_analise_laboratorial(contexto_clinico: str) -> dict:
    """
    Usa o Groq para transformar um texto clínico/laboratorial (transcrições,
    resultados de exames colados, PDFs já extraídos) em um LAUDO ESTRUTURADO em JSON,
    pronto para a tela "Análise com IA".

    Retorna um dicionário com as chaves: laudo, resultados, descritivo, hipoteses, orientacoes.
    """
    prompt = f"""Você é um assistente médico de apoio à decisão clínica.
Analise os DADOS CLÍNICOS abaixo e produza um laudo laboratorial estruturado.

Responda EXCLUSIVAMENTE com um JSON válido (sem comentários, sem texto fora do JSON),
seguindo EXATAMENTE esta estrutura de chaves:

{json.dumps(ANALISE_SCHEMA_EXEMPLO, ensure_ascii=False, indent=2)}

REGRAS IMPORTANTES:
- "status" de cada item deve ser exatamente "Normal", "Atenção" ou "Crítico".
- "probabilidade" é um número inteiro de 0 a 100; a soma das hipóteses deve ficar próxima de 100.
- Marque "mais_provavel": true apenas na hipótese de maior probabilidade.
- Se NÃO houver dados laboratoriais suficientes, devolva "resultados" como lista vazia,
  "hipoteses" vazia, e escreva no "descritivo" que não há dados suficientes para o laudo.
- As "orientacoes" não substituem o julgamento clínico; deixe isso implícito sendo prudente.
- Escreva tudo em português do Brasil.

DADOS CLÍNICOS:
\"\"\"{contexto_clinico}\"\"\"
"""

    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": system_instruction_content},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_tokens=4096,
        response_format={"type": "json_object"},
    )

    raw = completion.choices[0].message.content
    return json.loads(raw)