import { Song, Hymnal } from '../types';
import { hymnals, songs } from '../data/songs';
import { useApp } from '../context/AppContext';
import { Star, ChevronRight } from 'lucide-react';

export default function HomePage({ onSelectSong, onSelectHymnal, onSearch, onAddHymnal }: {
  onSelectSong: (song: Song) => void;
  onSelectHymnal: (hymnal: Hymnal) => void;
  onSearch: () => void;
  onAddHymnal: () => void;
}) {
  const { state, toggleFavorite, isFavorite } = useApp();
  const allHymnals = [...hymnals, ...state.customHymnals];
  const allSongs = [...songs, ...state.customSongs];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="relative">
          <input
            type="text"
            onClick={onSearch}
            placeholder="Buscar canciones..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/50"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            readOnly
          />
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Cancioneros</h2>
          <button onClick={onAddHymnal} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            + Nuevo
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allHymnals.map(hymnal => (
            <button
              key={hymnal.id}
              onClick={() => onSelectHymnal(hymnal)}
              className="rounded-2xl p-4 text-left transition-all hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${hymnal.color}, ${hymnal.color}cc)`,
                aspectRatio: '3/4'
              }}
            >
              <div className="text-5xl mb-3">{hymnal.icon}</div>
              <div className="text-white font-bold text-lg">{hymnal.name}</div>
              <div className="text-white/90 text-sm mt-2">
                {allSongs.filter(s => s.hymnalId === hymnal.id).length} canciones
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Destacadas</h2>
        <div className="space-y-2">
          {allSongs.slice(0, 5).map(song => (
            <div key={song.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <button onClick={() => onSelectSong(song)} className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)' }}>
                    {song.code}
                  </span>
                  <span className="font-medium text-sm">{song.title}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {song.artist} • {song.key}
                </div>
              </button>
              <button onClick={() => toggleFavorite(song.id)} style={{ color: isFavorite(song.id) ? 'var(--gold)' : 'var(--text-muted)' }}>
                <Star size={18} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
