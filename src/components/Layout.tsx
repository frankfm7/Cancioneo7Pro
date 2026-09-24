import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Heart, ListMusic, Settings, Menu, X, Moon, Sun, Download, Upload, Plus } from 'lucide-react';
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
  const [showListsDropdown, setShowListsDropdown] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.className = state.preferences.theme;
    const savedBg = localStorage.getItem('cancionero-bg-image');
    if (savedBg) setBgImage(savedBg);
  }, [state.preferences.theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowListsDropdown(false);
      }
    };
    if (showListsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showListsDropdown]);

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBgImage(result);
        localStorage.setItem('cancionero-bg-image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBgImage = () => {
    setBgImage(null);
    localStorage.removeItem('cancionero-bg-image');
  };

  return (
    <div 
      className="min-h-screen relative" 
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        color: 'var(--text-primary)',
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {bgImage && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            backgroundColor: state.preferences.theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)',
            zIndex: 0
          }}
        />
      )}
      
      <div className="relative" style={{ zIndex: 1 }}>
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
                  <button onClick={() => { onImport(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left flex items-center gap-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <Upload size={16} /> Importar Datos
                  </button>
                  <button onClick={() => { onExport(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left flex items-center gap-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <Download size={16} /> Exportar Datos
                  </button>
                  <button onClick={() => { onAddHymnal(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left flex items-center gap-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <Plus size={16} /> Nuevo Cancionero
                  </button>
                  <button onClick={() => { fileInputRef.current?.click(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left flex items-center gap-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    {bgImage ? 'Cambiar Fondo' : 'Imagen de Fondo'}
                  </button>
                  {bgImage && (
                    <button onClick={() => { removeBgImage(); setSidebarOpen(false); }} className="w-full p-3 rounded-xl text-left text-red-500">
                      Quitar Fondo
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageChange}
                  style={{ display: 'none' }}
                />
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
              <div>
                <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--accent)' }}>
                  Cancionero<span className="font-black">7Pro</span>
                </h1>
                <p className="text-[9px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                  Gestión Profesional de Alabanzas
                </p>
              </div>
            </div>
            <button
              onClick={() => setTheme(state.preferences.theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              {state.preferences.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
            ].map(item => {
              const isActive = currentPage === item.id || 
                              (item.id === 'lists-and-orders' && (currentPage === 'setlists' || currentPage === 'orders'));
              
              if (item.id === 'lists-and-orders') {
                return (
                  <div key={item.id} className="flex-1 relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowListsDropdown(!showListsDropdown)}
                      className={`w-full flex flex-col items-center py-3 px-1 transition-all ${
                        isActive ? 'scale-105' : 'opacity-60'
                      }`}
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                      <span className="text-[10px] font-semibold mt-1">{item.label}</span>
                      {isActive && (
                        <div className="absolute top-0 w-8 h-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showListsDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-xl shadow-2xl overflow-hidden"
                          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                        >
                          <button
                            onClick={() => {
                              onNavigate('setlists');
                              setShowListsDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: currentPage === 'setlists' ? 'var(--accent-light)' : 'transparent',
                              color: currentPage === 'setlists' ? 'var(--accent)' : 'var(--text-primary)'
                            }}
                          >
                            <ListMusic size={16} />
                            <span className="font-medium">Lista de canciones</span>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('orders');
                              setShowListsDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:opacity-80 transition-opacity border-t"
                            style={{ 
                              borderColor: 'var(--border-color)',
                              backgroundColor: currentPage === 'orders' ? 'var(--accent-light)' : 'transparent',
                              color: currentPage === 'orders' ? 'var(--accent)' : 'var(--text-primary)'
                            }}
                          >
                            <ListMusic size={16} />
                            <span className="font-medium">Orden de evento</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex-1 flex flex-col items-center py-3 px-1 transition-all ${
                    isActive ? 'scale-105' : 'opacity-60'
                  }`}
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[10px] font-semibold mt-1">{item.label}</span>
                  {isActive && (
                    <div className="absolute top-0 w-8 h-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
