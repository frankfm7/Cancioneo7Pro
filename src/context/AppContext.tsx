import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Hymnal, Song, Setlist, SetlistSong, Order } from '../types';
import { hymnals, songs } from '../data/songs';

interface AppContextType {
  state: AppState;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  addSetlist: (name: string) => void;
  removeSetlist: (id: string) => void;
  addSongToSetlist: (setlistId: string, song: SetlistSong) => void;
  removeSongFromSetlist: (setlistId: string, songId: string) => void;
  updateSetlistSong: (setlistId: string, songId: string, updates: Partial<SetlistSong>) => void;
  addOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
  updateOrder: (order: Order) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: number) => void;
  setShowChords: (show: boolean) => void;
  setCapo: (capo: number) => void;
  updatePersonalNote: (songId: string, note: string) => void;
  addCustomHymnal: (hymnal: Hymnal) => void;
  removeCustomHymnal: (id: string) => void;
  updateCustomHymnal: (hymnal: Hymnal) => void;
  addCustomSong: (song: Song) => void;
  updateCustomSong: (song: Song) => void;
  removeCustomSong: (id: string) => void;
}

const defaultState: AppState = {
  favorites: [],
  setlists: [],
  orders: [],
  preferences: {
    theme: 'dark',
    fontSize: 18,
    showChords: true,
    capo: 0,
  },
  personalNotes: {},
  customHymnals: [],
  customSongs: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cancionero-ruah-state');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('cancionero-ruah-state', JSON.stringify(state));
  }, [state]);

  const toggleFavorite = (songId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(songId)
        ? prev.favorites.filter(id => id !== songId)
        : [...prev.favorites, songId]
    }));
  };

  const isFavorite = (songId: string) => state.favorites.includes(songId);

  const addSetlist = (name: string) => {
    const newSetlist: Setlist = {
      id: crypto.randomUUID(),
      name,
      songs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: ''
    };
    setState(prev => ({ ...prev, setlists: [...prev.setlists, newSetlist] }));
  };

  const removeSetlist = (id: string) => {
    setState(prev => ({ ...prev, setlists: prev.setlists.filter(s => s.id !== id) }));
  };

  const addSongToSetlist = (setlistId: string, song: SetlistSong) => {
    setState(prev => ({
      ...prev,
      setlists: prev.setlists.map(s =>
        s.id === setlistId
          ? { ...s, songs: [...s.songs, song], updatedAt: new Date().toISOString() }
          : s
      )
    }));
  };

  const removeSongFromSetlist = (setlistId: string, songId: string) => {
    setState(prev => ({
      ...prev,
      setlists: prev.setlists.map(s =>
        s.id === setlistId
          ? { ...s, songs: s.songs.filter(song => song.songId !== songId), updatedAt: new Date().toISOString() }
          : s
      )
    }));
  };

  const updateSetlistSong = (setlistId: string, songId: string, updates: Partial<SetlistSong>) => {
    setState(prev => ({
      ...prev,
      setlists: prev.setlists.map(s =>
        s.id === setlistId
          ? {
              ...s,
              songs: s.songs.map(song =>
                song.songId === songId ? { ...song, ...updates } : song
              ),
              updatedAt: new Date().toISOString()
            }
          : s
      )
    }));
  };

  const addOrder = (order: Order) => {
    setState(prev => ({ ...prev, orders: [...prev.orders, order] }));
  };

  const removeOrder = (id: string) => {
    setState(prev => ({ ...prev, orders: prev.orders.filter(o => o.id !== id) }));
  };

  const updateOrder = (order: Order) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === order.id ? order : o)
    }));
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, preferences: { ...prev.preferences, theme } }));
  };

  const setFontSize = (fontSize: number) => {
    setState(prev => ({ ...prev, preferences: { ...prev.preferences, fontSize } }));
  };

  const setShowChords = (showChords: boolean) => {
    setState(prev => ({ ...prev, preferences: { ...prev.preferences, showChords } }));
  };

  const setCapo = (capo: number) => {
    setState(prev => ({ ...prev, preferences: { ...prev.preferences, capo } }));
  };

  const updatePersonalNote = (songId: string, note: string) => {
    setState(prev => ({
      ...prev,
      personalNotes: { ...prev.personalNotes, [songId]: note }
    }));
  };

  const addCustomHymnal = (hymnal: Hymnal) => {
    setState(prev => ({ ...prev, customHymnals: [...prev.customHymnals, hymnal] }));
  };

  const removeCustomHymnal = (id: string) => {
    setState(prev => ({ ...prev, customHymnals: prev.customHymnals.filter(h => h.id !== id) }));
  };

  const updateCustomHymnal = (hymnal: Hymnal) => {
    setState(prev => ({
      ...prev,
      customHymnals: prev.customHymnals.map(h => h.id === hymnal.id ? hymnal : h)
    }));
  };

  const addCustomSong = (song: Song) => {
    setState(prev => ({ ...prev, customSongs: [...prev.customSongs, song] }));
  };

  const updateCustomSong = (song: Song) => {
    setState(prev => ({
      ...prev,
      customSongs: prev.customSongs.map(s => s.id === song.id ? song : s)
    }));
  };

  const removeCustomSong = (id: string) => {
    setState(prev => ({ ...prev, customSongs: prev.customSongs.filter(s => s.id !== id) }));
  };

  const value: AppContextType = {
    state,
    toggleFavorite,
    isFavorite,
    addSetlist,
    removeSetlist,
    addSongToSetlist,
    removeSongFromSetlist,
    updateSetlistSong,
    addOrder,
    removeOrder,
    updateOrder,
    setTheme,
    setFontSize,
    setShowChords,
    setCapo,
    updatePersonalNote,
    addCustomHymnal,
    removeCustomHymnal,
    updateCustomHymnal,
    addCustomSong,
    updateCustomSong,
    removeCustomSong
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
