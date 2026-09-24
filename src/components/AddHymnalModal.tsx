import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export default function AddHymnalModal({ onClose }: { onClose: () => void }) {
  const { addCustomHymnal } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('Castellano');
  const [icon, setIcon] = useState('🎵');
  const [color, setColor] = useState('#7c3aed');

  const handleCreate = () => {
    if (!name.trim()) return;
    addCustomHymnal({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      language,
      icon,
      color,
      isCustom: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: 'var(--card-bg)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Nuevo Cancionero</h2>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Descripción</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Idioma</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <option>Castellano</option>
              <option>Aymara</option>
              <option>Quechua</option>
              <option>Inglés</option>
            </select>
          </div>
          <button onClick={handleCreate} disabled={!name.trim()} className="w-full py-3 rounded-xl font-bold disabled:opacity-50" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
