import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Heart, ListMusic, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPage, onNavigate, onImport, onExport, onAddHymnal }: {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onImport: () => void;
  onExport: () => void;
  onAddHymnal: () => void;
}) {
  const { state, setTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 p-6 overflow-y-auto"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Menú</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button onClick={() => { onImport(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  Importar Datos
                </button>
                <button onClick={() => { onExport(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  Exportar Datos
                </button>
                <button onClick={() => { onAddHymnal(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  Nuevo Cancionero
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <Menu size={20} />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                 style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              C7
            </div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              Cancionero<span className="font-black">7Pro</span>
            </h1>
          </div>
          <button
            onClick={() => setTheme(state.preferences.theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            {state.preferences.theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md"
           style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto flex">
          {[
            { id: 'home', label: 'Inicio', icon: Home },
            { id: 'search', label: 'Buscar', icon: Search },
            { id: 'favorites', label: 'Favoritos', icon: Heart },
            { id: 'lists-and-orders', label: 'Listas', icon: ListMusic },
            { id: 'tools', label: 'Tools', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center py-3 px-1 transition-all ${
                currentPage === item.id ? 'scale-105' : 'opacity-60'
              }`}
              style={{ color: currentPage === item.id ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-semibold mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
