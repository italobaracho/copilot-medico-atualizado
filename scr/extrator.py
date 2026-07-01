import requests
import json


def extrair_dados(texto, modelo="llama3"):
    prompt = f"""
Extraia os resultados dos exames laboratoriais do texto abaixo.

Retorne APENAS um JSON válido, sem explicações, sem markdown e sem texto adicional.

Exemplo:

{{
    "hemoglobina": 13.5,
    "hematocrito": 40.2,
    "leucocitos": 7200,
    "plaquetas": 250000
}}

Texto:
{texto}
"""

    try:
        resposta = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": modelo,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            },
            timeout=60
        )

        resposta.raise_for_status()

        resultado = resposta.json()["response"]

        return json.loads(resultado)

    except requests.exceptions.ConnectionError:
        raise Exception(
            "Não foi possível conectar ao Ollama. "
            "Verifique se ele está rodando."
        )

    except requests.exceptions.Timeout:
        raise Exception(
            "Tempo limite excedido ao consultar o modelo."
        )

    except json.JSONDecodeError:
        raise Exception(
            "O modelo não retornou um JSON válido."
        )

    except Exception as e:
        raise Exception(f"Erro ao extrair dados: {e}")