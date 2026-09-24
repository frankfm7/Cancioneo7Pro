import { Song } from '../types';
import { songs } from '../data/songs';
import { useApp } from '../context/AppContext';
import { Star } from 'lucide-react';

export default function FavoritesPage({ onSelectSong }: { onSelectSong: (song: Song) => void }) {
  const { state, toggleFavorite } = useApp();
  const allSongs = [...songs, ...state.customSongs];
  const favoriteSongs = allSongs.filter(s => state.favorites.includes(s.id));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Favoritos</h2>
      <div className="space-y-2">
        {favoriteSongs.map(song => (
          <div key={song.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => onSelectSong(song)} className="flex-1 text-left">
              <div className="font-medium text-sm">{song.title}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{song.artist}</div>
            </button>
            <button onClick={() => toggleFavorite(song.id)} style={{ color: 'var(--gold)' }}>
              <Star size={18} fill="currentColor" />
            </button>
          </div>
        ))}
        {favoriteSongs.length === 0 && <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No hay favoritos</p>}
      </div>
    </div>
  );
}
