import os
import speech_recognition as sr

MODO_TESTE_SOZINHO = True

class Diarizador:
    def __init__(self, model_path=None, spk_model_path=None):
        self.model_path = model_path
        self.spk_model_path = spk_model_path
        self.reconhecedor = sr.Recognizer()

    def processar_audio(self, audio_path):
        # Transcreve o áudio completo
        try:
            with sr.AudioFile(audio_path) as source:
                audio_data = self.reconhecedor.record(source)
                full_text = self.reconhecedor.recognize_google(audio_data, language="pt-BR")
        except Exception as e:
            full_text = "Não foi possível transcrever o áudio."

        dialogue = []
        if MODO_TESTE_SOZINHO:
            dialogue.append({
                "speaker": "Médico",
                "text": full_text,
                "start": 0.0,
                "end": 10.0
            })
        else:
            # Divide o áudio em frases e alterna entre Médico e Paciente
            phrases = [p.strip() for p in full_text.split(".") if p.strip()]
            if not phrases:
                phrases = [full_text]
            
            for i, phrase in enumerate(phrases):
                speaker = "Médico" if i % 2 == 0 else "Paciente"
                dialogue.append({
                    "speaker": speaker,
                    "text": phrase,
                    "start": float(i * 5),
                    "end": float((i + 1) * 5)
                })

        return {
            "full_text": full_text,
            "dialogue": dialogue
        }
