import { Song } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ChevronLeft } from 'lucide-react';
import { hymnals } from '../data/songs';

export default function SongView({ song, onBack, onEdit, songSource }: { 
  song: Song; 
  onBack: () => void; 
  onEdit: () => void;
  songSource?: { type: string; name?: string } | null;
}) {
  const { state, toggleFavorite, isFavorite, setFontSize, setShowChords, setCapo } = useApp();
  const hymnal = [...hymnals, ...state.customHymnals].find(h => h.id === song.hymnalId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          {songSource?.type === 'list' ? 'Volver a lista' : songSource?.type === 'order' ? 'Volver a orden' : 'Volver'}
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{song.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{song.artist} • {hymnal?.name}</p>
        </div>
        <button onClick={() => toggleFavorite(song.id)} style={{ color: isFavorite(song.id) ? 'var(--gold)' : 'var(--text-muted)' }}>
          <Star size={22} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="font-lyrics whitespace-pre-wrap" style={{ fontSize: `${state.preferences.fontSize}px` }}>
          {song.lyrics}
        </div>
      </div>
    </div>
  );
}
