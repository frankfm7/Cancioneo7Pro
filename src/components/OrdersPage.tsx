import { Song } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function OrdersPage({ onSelectSong, onBack, initialOrderId }: { 
  onSelectSong: (song: Song) => void; 
  onBack?: () => void;
  initialOrderId?: string | null;
}) {
  const { state, addOrder, removeOrder } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<any>(initialOrderId ? state.orders.find(o => o.id === initialOrderId) || null : null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderType, setNewOrderType] = useState('Culto');

  if (selectedOrder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedOrder(null)} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            Volver a órdenes
          </button>
          <h2 className="text-xl font-bold">{selectedOrder.name}</h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selectedOrder.items.length} elementos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Órdenes de Evento</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{state.orders.length} órdenes</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {state.orders.map(order => (
          <div key={order.id} className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => setSelectedOrder(order)} className="flex-1 text-left">
              <div className="font-medium">{order.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.eventType} • {order.items.length} elementos</div>
            </button>
            <button onClick={() => { if (confirm(`¿Eliminar "${order.name}"?`)) removeOrder(order.id); }} className="p-2 rounded-lg" style={{ color: '#ef4444' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-md rounded-2xl p-5" style={{ backgroundColor: 'var(--card-bg)' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Nuevo Orden</h3>
            <input type="text" value={newOrderName} onChange={e => setNewOrderName(e.target.value)} placeholder="Nombre" className="w-full p-3 rounded-xl border mb-3" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} />
            <select value={newOrderType} onChange={e => setNewOrderType(e.target.value)} className="w-full p-3 rounded-xl border mb-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <option>Culto</option>
              <option>Boda</option>
              <option>Bautismo</option>
            </select>
            <button onClick={() => { if (newOrderName.trim()) { addOrder({ id: crypto.randomUUID(), name: newOrderName.trim(), eventType: newOrderType, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), notes: '' }); setNewOrderName(''); setShowCreateModal(false); } }} className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              Crear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
