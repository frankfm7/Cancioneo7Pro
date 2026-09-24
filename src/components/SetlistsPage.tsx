import { useState, useMemo, useEffect, useRef } from 'react';
import { Song, Setlist, SetlistSong } from '../types';
import { songs as allSongs } from '../data/songs';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Music, Clock, ChevronUp, ChevronDown, GripVertical, X, MoreVertical, Edit2, CheckSquare, Square, Search, Share2, Download, Camera, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SetlistExtractor from './SetlistExtractor';

export default function SetlistsPage({ onSelectSong, onBack, initialSetlistId }: { 
  onSelectSong: (song: Song, source?: any) => void; 
  onBack?: () => void;
  initialSetlistId?: string | null;
}) {
  const { state, addSetlist, removeSetlist, addSongToSetlist, removeSongFromSetlist, updateSetlistSong } = useApp();
  const [selectedSetlist, setSelectedSetlist] = useState<string | null>(initialSetlistId || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExtractor, setShowExtractor] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [newSetlistName, setNewSetlistName] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const editRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const allAvailableSongs = useMemo(() => {
    const customSongsMap = new Map(state.customSongs.map(s => [s.id, s]));
    const combinedSongs = allSongs.map(song => customSongsMap.get(song.id) || song);
    const defaultSongIds = new Set(allSongs.map(s => s.id));
    const newCustomSongs = state.customSongs.filter(s => !defaultSongIds.has(s.id));
    return [...combinedSongs, ...newCustomSongs];
  }, [state.customSongs]);

  const currentSetlist = useMemo(() => {
    return state.setlists.find(s => s.id === selectedSetlist);
  }, [state.setlists, selectedSetlist]);

  const filteredSongs = useMemo(() => {
    if (!songSearchQuery.trim()) return allAvailableSongs;
    const query = songSearchQuery.toLowerCase();
    return allAvailableSongs.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.code.toLowerCase().includes(query)
    );
  }, [songSearchQuery, allAvailableSongs]);

  // Cerrar edición al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setEditingItem(null);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (editingItem || showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingItem, showShareMenu]);

  // Cerrar menú de agregar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-add-menu]')) {
        setShowAddMenu(false);
      }
    };

    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddMenu]);

  // Cerrar menú de tres puntos al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-item-menu]')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const createSetlist = () => {
    if (newSetlistName.trim()) {
      addSetlist(newSetlistName.trim());
      setNewSetlistName('');
      setShowCreateModal(false);
    }
  };

  const addSongItem = () => {
    if (!selectedSetlist) return;
    
    const newSong: SetlistSong = {
      songId: '',
      transposition: 0,
      notes: '',
      order: currentSetlist?.songs.length || 0,
    };
    
    addSongToSetlist(selectedSetlist, newSong);
    setShowAddMenu(false);
    setEditingItem('new');
  };

  const removeSong = (songId: string) => {
    if (!selectedSetlist) return;
    removeSongFromSetlist(selectedSetlist, songId);
    setOpenMenuId(null);
  };

  const updateSong = (songId: string, updates: Partial<SetlistSong>) => {
    if (!selectedSetlist) return;
    updateSetlistSong(selectedSetlist, songId, updates);
  };

  const removeSelectedItems = () => {
    if (!selectedSetlist || selectedItems.size === 0) return;
    
    if (!confirm(`¿Eliminar ${selectedItems.size} canción(es)?`)) return;
    
    selectedItems.forEach(songId => {
      removeSongFromSetlist(selectedSetlist, songId);
    });
    
    setSelectedItems(new Set());
    setSelectionMode(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!currentSetlist) return;
    
    const songs = [...currentSetlist.songs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= songs.length) return;
    
    [songs[index], songs[newIndex]] = [songs[newIndex], songs[index]];
    
    // Actualizar el orden
    songs.forEach((song, idx) => {
      updateSetlistSong(selectedSetlist!, song.songId, { order: idx });
    });
  };

  const handleExtracted = (items: string[]) => {
    const newListName = `Lista extraída ${state.setlists.length + 1}`;
    addSetlist(newListName);
    
    // Encontrar la lista recién creada
    const newList = state.setlists.find(s => s.name === newListName);
    if (newList) {
      // Intentar encontrar canciones que coincidan
      items.forEach((text, index) => {
        const matchingSong = allAvailableSongs.find(song => 
          song.title.toLowerCase().includes(text.toLowerCase()) ||
          text.toLowerCase().includes(song.title.toLowerCase())
        );
        
        if (matchingSong) {
          addSongToSetlist(newList.id, {
            songId: matchingSong.id,
            transposition: 0,
            notes: '',
            order: index,
          });
        }
      });
      
      setSelectedSetlist(newList.id);
    }
    
    setShowExtractor(false);
  };

  const toggleItemSelection = (songId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedItems(newSelected);
  };

  const shareAsText = () => {
    if (!currentSetlist) return;
    
    const text = `📋 ${currentSetlist.name}\n\n${currentSetlist.songs.map((ss, i) => {
      const song = allAvailableSongs.find(s => s.id === ss.songId);
      return `${i + 1}. ${song?.title || 'Sin canción'}${song?.artist ? ` - ${song.artist}` : ''}${ss.notes ? ` (${ss.notes})` : ''}`;
    }).join('\n')}\n\nCompartido desde Cancionero7Pro`;
    
    if (navigator.share) {
      navigator.share({
        title: currentSetlist.name,
        text: text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert('Lista copiada al portapapeles');
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Lista copiada al portapapeles');
    }
    setShowShareMenu(false);
  };

  const shareAsImage = async () => {
    if (!currentSetlist) return;
    
    // Crear un canvas con la lista
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = 800;
    const lineHeight = 30;
    const padding = 40;
    const songCount = currentSetlist.songs.length;
    const height = padding * 2 + lineHeight * (songCount + 2);
    
    canvas.width = width;
    canvas.height = height;
    
    // Fondo
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    // Título
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText(currentSetlist.name, padding, padding + 30);
    
    // Canciones
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '18px Inter, sans-serif';
    
    currentSetlist.songs.forEach((ss, i) => {
      const song = allAvailableSongs.find(s => s.id === ss.songId);
      const y = padding + 80 + (i * lineHeight);
      ctx.fillText(`${i + 1}. ${song?.title || 'Sin canción'}`, padding, y);
      
      if (song?.artist) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(`   ${song.artist}`, padding, y + 18);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '18px Inter, sans-serif';
      }
    });
    
    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Cancionero7Pro', padding, height - padding);
    
    // Convertir a imagen y compartir
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], `${currentSetlist.name}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: currentSetlist.name,
            files: [file],
          });
        } catch {
          // Fallback: descargar la imagen
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentSetlist.name}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        // Fallback: descargar la imagen
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentSetlist.name}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
    
    setShowShareMenu(false);
  };

  const exportSetlist = () => {
    if (!currentSetlist) return;
    
    const data = {
      name: currentSetlist.name,
      songs: currentSetlist.songs.map(ss => {
        const song = allAvailableSongs.find(s => s.id === ss.songId);
        return {
          title: song?.title,
          artist: song?.artist,
          code: song?.code,
          key: song?.key,
          transposition: ss.transposition,
          notes: ss.notes,
        };
      }),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSetlist.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedSetlist && currentSetlist) {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setSelectedSetlist(null);
              setSelectionMode(false);
              setSelectedItems(new Set());
            }}
            className="p-2 rounded-xl" 
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            ←
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{currentSetlist.name}</h2>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{currentSetlist.songs.length} canciones</span>
            </div>
          </div>
          <button
            onClick={() => {
              setReorderMode(!reorderMode);
              setSelectionMode(false);
            }}
            className="p-2 rounded-xl"
            style={{ backgroundColor: reorderMode ? 'var(--accent)' : 'var(--bg-tertiary)', color: reorderMode ? 'white' : 'var(--text-primary)' }}
            title="Reordenar"
          >
            <GripVertical size={20} />
          </button>
          <button
            onClick={() => {
              setSelectionMode(!selectionMode);
              setReorderMode(false);
              setSelectedItems(new Set());
            }}
            className="p-2 rounded-xl"
            style={{ backgroundColor: selectionMode ? 'var(--accent)' : 'var(--bg-tertiary)', color: selectionMode ? 'white' : 'var(--text-primary)' }}
            title="Seleccionar"
          >
            <CheckSquare size={20} />
          </button>
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-xl"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <Share2 size={20} />
            </button>
            
            {showShareMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-56 rounded-xl shadow-lg overflow-hidden z-50"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              >
                <button
                  onClick={shareAsText}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-80"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Share2 size={14} /> Compartir como texto
                </button>
                <button
                  onClick={shareAsImage}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-80 border-t"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  <ImageIcon size={14} /> Compartir como imagen
                </button>
                <button
                  onClick={exportSetlist}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-80 border-t"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  <Download size={14} /> Exportar JSON
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selection Actions */}
        {selectionMode && selectedItems.size > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              {selectedItems.size} seleccionado(s)
            </span>
            <div className="flex-1" />
            <button
              onClick={removeSelectedItems}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <Trash2 size={14} /> Eliminar
            </button>
          </div>
        )}

        {/* Songs List */}
        <div className="space-y-2">
          {currentSetlist.songs.map((ss, index) => {
            const song = allAvailableSongs.find(s => s.id === ss.songId);
            const isEditing = editingItem === ss.songId || (editingItem === 'new' && !ss.songId);
            
            return (
              <motion.div
                key={ss.songId || index}
                layout
                className="flex items-start gap-2 p-3 rounded-xl border"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: selectedItems.has(ss.songId) ? 'var(--accent)' : 'var(--border-color)',
                  borderWidth: selectedItems.has(ss.songId) ? '2px' : '1px'
                }}
              >
                {/* Selection Checkbox */}
                {selectionMode && (
                  <button
                    onClick={() => toggleItemSelection(ss.songId)}
                    className="p-1 mt-1"
                    style={{ color: selectedItems.has(ss.songId) ? 'var(--accent)' : 'var(--text-muted)' }}
                  >
                    {selectedItems.has(ss.songId) ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                )}

                {/* Reorder Buttons */}
                {reorderMode && (
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded disabled:opacity-30"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === currentSetlist.songs.length - 1}
                      className="p-1 rounded disabled:opacity-30"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}
                
                {/* Item Number */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1"
                     style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {index + 1}
                </div>
                
                {/* Song Content */}
                <div className="flex-1 min-w-0" ref={isEditing ? editRef : null}>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          value={songSearchQuery}
                          onChange={e => setSongSearchQuery(e.target.value)}
                          placeholder="Buscar canción..."
                          className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border p-2" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        {filteredSongs.slice(0, 10).map(song => (
                          <button
                            key={song.id}
                            onClick={() => {
                              if (editingItem === 'new') {
                                const lastSong = currentSetlist.songs[currentSetlist.songs.length - 1];
                                updateSong(lastSong.songId, { songId: song.id });
                              } else {
                                updateSong(ss.songId, { songId: song.id });
                              }
                              setSongSearchQuery('');
                              setEditingItem(null);
                            }}
                            className="w-full text-left p-2 rounded hover:opacity-80 text-sm"
                            style={{ backgroundColor: ss.songId === song.id ? 'var(--accent-light)' : 'transparent' }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{song.code}</span>
                              <span className="font-medium">{song.title}</span>
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{song.artist}</div>
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={ss.notes || ''}
                        onChange={e => {
                          if (editingItem === 'new') {
                            const lastSong = currentSetlist.songs[currentSetlist.songs.length - 1];
                            updateSong(lastSong.songId, { notes: e.target.value });
                          } else {
                            updateSong(ss.songId, { notes: e.target.value });
                          }
                        }}
                        placeholder="Nota (ej: Tocar en tono D)"
                        className="w-full p-2 rounded-lg border text-xs"
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (song) {
                          onSelectSong(song, { type: 'list', id: currentSetlist.id, name: currentSetlist.name });
                        }
                      }}
                      className="w-full text-left"
                    >
                      {song ? (
                        <>
                          <div className="font-medium text-sm">{song.title}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {song.artist} • {song.key}
                            {ss.transposition !== 0 && ` → ${ss.transposition > 0 ? '+' : ''}${ss.transposition}`}
                          </div>
                          {ss.notes && (
                            <div className="text-xs italic mt-1" style={{ color: 'var(--text-muted)' }}>
                              {ss.notes}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                          Sin canción seleccionada
                        </div>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Three-dot Menu */}
                {!isEditing && !selectionMode && !reorderMode && (
                  <div className="relative" data-item-menu>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === ss.songId ? null : ss.songId)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {openMenuId === ss.songId && (
                      <div 
                        className="absolute right-0 top-full mt-1 w-40 rounded-xl shadow-lg overflow-hidden z-50"
                        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                      >
                        <button
                          onClick={() => {
                            setEditingItem(ss.songId);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-80"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <Edit2 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => removeSong(ss.songId)}
                          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-80"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {currentSetlist.songs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No hay canciones en esta lista
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Usa el botón + para agregar canciones
              </p>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        {!selectionMode && !reorderMode && (
          <div className="fixed bottom-24 right-4 z-30" data-add-menu>
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-2 rounded-xl shadow-lg overflow-hidden"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                >
                  <button
                    onClick={addSongItem}
                    className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 hover:opacity-80"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Music size={16} /> Agregar canción
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 hover:scale-105"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(124,58,237,0.4)'
              }}
            >
              <Plus size={28} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-lg" 
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              ←
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold">Lista de canciones</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {state.setlists.length} listas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExtractor(true)}
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
            title="Crear desde foto"
          >
            <Camera size={20} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {state.setlists.map(setlist => (
          <div
            key={setlist.id}
            className="flex items-center gap-3 p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          >
            <button onClick={() => setSelectedSetlist(setlist.id)} className="flex-1 text-left">
              <div className="font-medium">{setlist.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {setlist.songs.length} canciones
              </div>
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Eliminar "${setlist.name}"?`)) {
                  removeSetlist(setlist.id);
                }
              }}
              className="p-2 rounded-lg"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {state.setlists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No hay listas de canciones
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Crea una con el botón + o escanea una foto con 📷
            </p>
          </div>
        )}
      </div>

      {/* Create Setlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-5"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <h3 className="font-bold text-lg mb-3">Nueva Lista de Canciones</h3>
              
              <input
                type="text"
                value={newSetlistName}
                onChange={e => setNewSetlistName(e.target.value)}
                placeholder="Nombre de la lista"
                className="w-full p-3 rounded-xl border mb-4"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                autoFocus
              />

              <button
                onClick={createSetlist}
                disabled={!newSetlistName.trim()}
                className="w-full py-3 rounded-xl font-bold"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                Crear
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showExtractor && (
        <SetlistExtractor
          onClose={() => setShowExtractor(false)}
          onExtract={handleExtracted}
        />
      )}
    </div>
  );
}
