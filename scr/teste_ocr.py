import easyocr

reader = easyocr.Reader(['pt'])

resultado = reader.readtext(
    'exames/Hemograma.png',
    detail=0
)

texto = "\n".join(resultado)

print(texto)