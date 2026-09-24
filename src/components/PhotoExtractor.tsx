import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera, Upload, X, Loader, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhotoExtractorProps {
  onClose: () => void;
  onExtract: (data: { title: string; artist: string; lyrics: string }) => void;
}

export default function PhotoExtractor({ onClose, onExtract }: PhotoExtractorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedTitle, setExtractedTitle] = useState('');
  const [extractedArtist, setExtractedArtist] = useState('');
  const [extractedLyrics, setExtractedLyrics] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractText = async () => {
    if (!image) return;

    setExtracting(true);
    setProgress(0);

    try {
      const worker = await createWorker('spa+eng', 1, {
        logger: (m: any) => {
          if (m.progress) {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const response = await worker.recognize(image);
      const text = response.data.text;
      await worker.terminate();

      // Parsear el texto extraído
      const lines = text.split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      // Intentar extraer título y artista de las primeras líneas
      let title = '';
      let artist = '';
      let lyrics = '';

      if (lines.length > 0) {
        title = lines[0];
      }
      if (lines.length > 1) {
        artist = lines[1];
      }
      if (lines.length > 2) {
        lyrics = lines.slice(2).join('\n');
      }

      setExtractedTitle(title);
      setExtractedArtist(artist);
      setExtractedLyrics(lyrics);
      setEditMode(true);
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Error al extraer texto de la imagen. Por favor intenta con otra imagen.');
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirm = () => {
    onExtract({
      title: extractedTitle,
      artist: extractedArtist,
      lyrics: extractedLyrics,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Extraer Canción de Foto</h2>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        {!image ? (
          <div className="space-y-4">
            <div className="p-8 rounded-2xl border-2 border-dashed text-center"
                 style={{ borderColor: 'var(--border-color)' }}>
              <Camera size={64} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Sube una foto o captura de pantalla de la canción
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-camera"
              />
              <div className="flex gap-3 justify-center">
                <label
                  htmlFor="photo-upload"
                  className="inline-block px-6 py-3 rounded-xl font-medium cursor-pointer"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <Upload size={20} className="inline mr-2" />
                  Galería
                </label>
                <label
                  htmlFor="photo-camera"
                  className="inline-block px-6 py-3 rounded-xl font-medium cursor-pointer"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <Camera size={20} className="inline mr-2" />
                  Tomar Foto
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img src={image} alt="Uploaded" className="w-full rounded-xl max-h-64 object-cover" />
              <button
                onClick={() => {
                  setImage(null);
                  setExtractedTitle('');
                  setExtractedArtist('');
                  setExtractedLyrics('');
                  setEditMode(false);
                }}
                className="absolute top-2 right-2 p-2 rounded-full"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
              >
                <X size={16} />
              </button>
            </div>

            {!editMode ? (
              <button
                onClick={extractText}
                disabled={extracting}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: extracting ? 'var(--bg-tertiary)' : 'var(--accent)', 
                  color: extracting ? 'var(--text-muted)' : 'white' 
                }}
              >
                {extracting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Extrayendo... {progress}%
                  </>
                ) : (
                  <>
                    <Camera size={20} />
                    Extraer Texto
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold mb-2">Información Extraída (editable)</h3>

                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={extractedTitle}
                    onChange={e => setExtractedTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                    Artista
                  </label>
                  <input
                    type="text"
                    value={extractedArtist}
                    onChange={e => setExtractedArtist(e.target.value)}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>
                    Letra
                  </label>
                  <textarea
                    value={extractedLyrics}
                    onChange={e => setExtractedLyrics(e.target.value)}
                    className="w-full p-2 rounded-lg border text-sm font-mono resize-none"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderColor: 'var(--border-color)', 
                      color: 'var(--text-primary)',
                      minHeight: '200px',
                      lineHeight: '1.8'
                    }}
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setExtractedTitle('');
                      setExtractedArtist('');
                      setExtractedLyrics('');
                      setEditMode(false);
                    }}
                    className="flex-1 py-3 rounded-xl font-medium"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                  >
                    <Check size={20} />
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
