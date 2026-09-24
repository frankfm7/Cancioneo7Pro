import { Song } from '../types';
import { songs } from '../data/songs';
import { useApp } from '../context/AppContext';
import { Search, X, Star } from 'lucide-react';
import { useState } from 'react';

export default function SearchPage({ onSelectSong, onBack }: { onSelectSong: (song: Song) => void; onBack: () => void }) {
  const { state, toggleFavorite, isFavorite } = useApp();
  const [query, setQuery] = useState('');
  const allSongs = [...songs, ...state.customSongs];
  
  const filteredSongs = query ? allSongs.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          Volver
        </button>
        <h2 className="text-2xl font-bold">Buscar Canciones</h2>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filteredSongs.map(song => (
          <div key={song.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => onSelectSong(song)} className="flex-1 text-left">
              <div className="font-medium text-sm">{song.title}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{song.artist}</div>
            </button>
            <button onClick={() => toggleFavorite(song.id)} style={{ color: isFavorite(song.id) ? 'var(--gold)' : 'var(--text-muted)' }}>
              <Star size={18} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
