from scr.ocr import extrair_texto
from scr.extrator import extrair_json

texto = extrair_texto(
    "exames/hemograma.jpg"
)

print("=== TEXTO OCR ===")
print(texto)

json_extraido = extrair_json(texto)

print("\n=== JSON ===")
print(json_extraido)