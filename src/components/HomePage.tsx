import { useMemo } from 'react';
import { Song, Hymnal } from '../types';
import { songs as allSongs, hymnals } from '../data/songs';
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

  const allAvailableSongs = useMemo(() => {
    const customSongsMap = new Map(state.customSongs.map(s => [s.id, s]));
    const combinedSongs = allSongs.map(song => customSongsMap.get(song.id) || song);
    const defaultSongIds = new Set(allSongs.map(s => s.id));
    const newCustomSongs = state.customSongs.filter(s => !defaultSongIds.has(s.id));
    return [...combinedSongs, ...newCustomSongs];
  }, [state.customSongs]);

  const allHymnals = useMemo(() => {
    const customHymnalsMap = new Map(state.customHymnals.map(h => [h.id, h]));
    const combinedHymnals = hymnals.map(hymnal => customHymnalsMap.get(hymnal.id) || hymnal);
    const defaultHymnalIds = new Set(hymnals.map(h => h.id));
    const newCustomHymnals = state.customHymnals.filter(h => !defaultHymnalIds.has(h.id));
    return [...combinedHymnals, ...newCustomHymnals];
  }, [state.customHymnals]);

  const featuredSongs = useMemo(() => {
    return allAvailableSongs.slice(0, 6);
  }, [allAvailableSongs]);

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
            const hymnalSongs = allAvailableSongs.filter(s => s.hymnalId === hymnal.id);
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Destacadas</h2>
          <button onClick={onSearch} className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            Ver todas →
          </button>
        </div>
        <div className="space-y-2">
          {featuredSongs.map((song, idx) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-2xl border transition-all hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', boxShadow: 'var(--card-shadow)' }}
            >
              <button onClick={() => onSelectSong(song)} className="flex-1 text-left flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                     style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {song.code.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{song.title}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {song.artist} • {song.key} • {song.timeSignature}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                className="p-2 rounded-xl"
                style={{ color: isFavorite(song.id) ? 'var(--gold)' : 'var(--text-muted)' }}
              >
                <Star size={18} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
