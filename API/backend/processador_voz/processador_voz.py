import speech_recognition as sr

class TranscritorVoz:
    def __init__(self, idioma="pt-BR"):
        self.idioma = idioma
        self.reconhecedor = sr.Recognizer()

    def transcrever(self, audio_data):
        try:
            return self.reconhecedor.recognize_google(audio_data, language=self.idioma)
        except sr.UnknownValueError:
            return "Não foi possível entender o áudio"
        except sr.RequestError as e:
            return f"Erro na API de reconhecimento: {e}"
