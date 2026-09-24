import { Song } from '../types';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function SongEditor({ song, onBack }: { song: Song; onBack: () => void }) {
  const { updateCustomSong } = useApp();
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [lyrics, setLyrics] = useState(song.lyrics);

  const handleSave = () => {
    updateCustomSong({ ...song, title, artist, lyrics });
    onBack();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          Volver
        </button>
        <h1 className="text-xl font-bold">Editar Canción</h1>
      </div>

      <div className="rounded-2xl border p-4 space-y-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div>
          <label className="text-sm font-semibold mb-1 block">Título</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">Artista</label>
          <input value={artist} onChange={e => setArtist(e.target.value)} className="w-full p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">Letra</label>
          <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} className="w-full p-3 rounded-xl border font-mono resize-none" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', minHeight: '300px' }} />
        </div>
        <button onClick={handleSave} className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          Guardar
        </button>
      </div>
    </div>
  );
}
