// ============================================================
// Conversão de áudio para WAV (PCM 16-bit, mono)
// ------------------------------------------------------------
// O navegador grava em webm/opus (MediaRecorder), mas o backend
// (SpeechRecognition / Vosk) transcreve com mais confiança a partir
// de WAV. Aqui decodificamos o áudio gravado e reescrevemos como WAV.
// ============================================================

// Converte um AudioBuffer (Web Audio API) em um Blob .wav mono 16-bit.
export function audioBufferToWavBlob(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;

  // Downmix para mono (média dos canais)
  const length = audioBuffer.length;
  const mono = new Float32Array(length);
  for (let ch = 0; ch < numChannels; ch++) {
    const data = audioBuffer.getChannelData(ch);
    for (let i = 0; i < length; i++) mono[i] += data[i] / numChannels;
  }

  // Float32 [-1,1] -> PCM 16-bit
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + length * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  // Cabeçalho WAV
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);          // tamanho do bloco fmt
  view.setUint16(20, 1, true);           // PCM
  view.setUint16(22, 1, true);           // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true); // byte rate
  view.setUint16(32, bytesPerSample, true);              // block align
  view.setUint16(34, 16, true);          // bits por amostra
  writeString(36, 'data');
  view.setUint32(40, length * bytesPerSample, true);

  // Amostras
  let offset = 44;
  for (let i = 0; i < length; i++) {
    let s = Math.max(-1, Math.min(1, mono[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, s, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

// Recebe um Blob gravado (webm/opus) e devolve um Blob WAV.
export async function blobToWav(recordedBlob) {
  const arrayBuffer = await recordedBlob.arrayBuffer();
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return { wav: audioBufferToWavBlob(audioBuffer), duration: audioBuffer.duration };
  } finally {
    audioCtx.close();
  }
}
