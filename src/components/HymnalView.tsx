import { Song, Hymnal } from '../types';
import { songs } from '../data/songs';
import { useApp } from '../context/AppContext';
import { Star } from 'lucide-react';

export default function HymnalView({ hymnal, onSelectSong, onBack }: {
  hymnal: Hymnal;
  onSelectSong: (song: Song) => void;
  onBack: () => void;
}) {
  const { state, toggleFavorite, isFavorite } = useApp();
  const hymnalSongs = [...songs, ...state.customSongs].filter(s => s.hymnalId === hymnal.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          ←
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{hymnal.name}</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hymnalSongs.length} canciones</p>
        </div>
      </div>

      <div className="space-y-2">
        {hymnalSongs.map(song => (
          <div key={song.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => onSelectSong(song)} className="flex-1 text-left">
              <div className="font-medium text-sm">{song.title}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{song.artist} • {song.key}</div>
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
