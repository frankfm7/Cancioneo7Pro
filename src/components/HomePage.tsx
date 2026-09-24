import { Song, Hymnal } from '../types';
import { hymnals, songs } from '../data/songs';
import { useApp } from '../context/AppContext';
import { Star, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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
      {/* Banner Compacto con Buscador */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="relative z-10">
          <div className="relative">
            <input
              type="text"
              onClick={onSearch}
              placeholder="Buscar canciones..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/50"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              readOnly
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Cancioneros en formato 3:4 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Cancioneros</h2>
          <button onClick={onAddHymnal} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            + Nuevo
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allHymnals.map((hymnal, idx) => {
            const hymnalSongs = allSongs.filter(s => s.hymnalId === hymnal.id);
            return (
              <motion.button
                key={hymnal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelectHymnal(hymnal)}
                className="rounded-2xl p-4 text-left transition-all hover:scale-[1.03] active:scale-[0.97] relative overflow-hidden"
                style={{
                  background: hymnal.image 
                    ? `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${hymnal.image}) center/cover`
                    : `linear-gradient(135deg, ${hymnal.color}, ${hymnal.color}cc)`,
                  aspectRatio: '3/4',
                  boxShadow: `0 8px 24px ${hymnal.color}66`
                }}
              >
                {!hymnal.image && (
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-30"
                       style={{ backgroundColor: 'white', transform: 'translate(30%, -30%)' }} />
                )}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl mb-3">{hymnal.icon}</div>
                    <div className="text-white font-bold text-lg leading-tight mb-2" style={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)'
                    }}>{hymnal.name}</div>
                  </div>
                  <div>
                    <div className="text-white/90 text-sm font-semibold" style={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9)'
                    }}>{hymnalSongs.length} canciones</div>
                    <div className="text-white/70 text-xs" style={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9)'
                    }}>{hymnal.language}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Canciones Destacadas */}
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
