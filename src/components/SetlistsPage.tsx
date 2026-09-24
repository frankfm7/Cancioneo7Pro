import { Song } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SetlistsPage({ onSelectSong, onBack, initialSetlistId }: { 
  onSelectSong: (song: Song) => void; 
  onBack?: () => void;
  initialSetlistId?: string | null;
}) {
  const { state, addSetlist, removeSetlist } = useApp();
  const [selectedSetlist, setSelectedSetlist] = useState<string | null>(initialSetlistId || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSetlistName, setNewSetlistName] = useState('');

  const currentSetlist = state.setlists.find(s => s.id === selectedSetlist);

  if (selectedSetlist && currentSetlist) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedSetlist(null)} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            Volver a listas
          </button>
          <h2 className="text-xl font-bold">{currentSetlist.name}</h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentSetlist.songs.length} canciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lista de canciones</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{state.setlists.length} listas</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {state.setlists.map(setlist => (
          <div key={setlist.id} className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => setSelectedSetlist(setlist.id)} className="flex-1 text-left">
              <div className="font-medium">{setlist.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{setlist.songs.length} canciones</div>
            </button>
            <button onClick={() => { if (confirm(`¿Eliminar "${setlist.name}"?`)) removeSetlist(setlist.id); }} className="p-2 rounded-lg" style={{ color: '#ef4444' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-md rounded-2xl p-5" style={{ backgroundColor: 'var(--card-bg)' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Nueva Lista</h3>
            <input type="text" value={newSetlistName} onChange={e => setNewSetlistName(e.target.value)} placeholder="Nombre" className="w-full p-3 rounded-xl border mb-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
            <button onClick={() => { if (newSetlistName.trim()) { addSetlist(newSetlistName.trim()); setNewSetlistName(''); setShowCreateModal(false); } }} className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              Crear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
