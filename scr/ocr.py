import easyocr

def extrair_texto(caminho_imagem):

    reader = easyocr.Reader(['pt'])

    resultado = reader.readtext(
        caminho_imagem,
        detail=0
    )

    return "\n".join(resultado)