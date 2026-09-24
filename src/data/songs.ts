import { Hymnal, Song } from '../types';

export const hymnals: Hymnal[] = [
  {
    id: 'alabanzas',
    name: 'Alabanzas',
    description: 'Canciones juveniles en castellano',
    language: 'Castellano',
    icon: '🎵',
    color: '#a855f7',
    isCustom: false,
    codePrefix: 'A'
  },
  {
    id: 'bautista',
    name: 'Himnario Bautista',
    description: 'Himnos tradicionales',
    language: 'Castellano',
    icon: '⛪',
    color: '#3b82f6',
    isCustom: false,
    codePrefix: 'B'
  },
  {
    id: 'cala',
    name: 'Himnario Cala',
    description: 'Bilingüe: Aymara / Castellano',
    language: 'Aymara/Castellano',
    icon: '🏔️',
    color: '#10b981',
    isCustom: false,
    codePrefix: 'C'
  },
  {
    id: 'quechua',
    name: 'Himnario Quechua',
    description: 'Himnos en Quechua',
    language: 'Quechua',
    icon: '🌿',
    color: '#22c55e',
    isCustom: false,
    codePrefix: 'Q'
  },
  {
    id: 'mis-canciones',
    name: 'Mis Canciones',
    description: 'Creaciones personales',
    language: 'Castellano',
    icon: '✍️',
    color: '#f97316',
    isCustom: true,
    codePrefix: 'M'
  }
];

export const songs: Song[] = [
  {
    id: 'a1',
    title: 'Grande es el Señor',
    artist: 'Marcos Witt',
    code: 'A1',
    number: 1,
    hymnalId: 'alabanzas',
    key: 'G',
    timeSignature: '4/4',
    bpm: 72,
    language: 'Castellano',
    categories: ['Adoración'],
    sections: [],
    lyrics: `VERSO 1
//G            Em          C          D
Grande es el Señor y digno de loar
//G            Em          C          D
más grande que todo lo que Él ha creado

CORO
//C          D         Em         G
Grande es el Señor y digno de loar
//C          D         Em         C
más grande que todo lo que Él ha creado`,
    notes: ''
  },
  {
    id: 'a2',
    title: 'Renuévame',
    artist: 'Marcos Witt',
    code: 'A2',
    number: 2,
    hymnalId: 'alabanzas',
    key: 'D',
    timeSignature: '4/4',
    bpm: 68,
    language: 'Castellano',
    categories: ['Adoración'],
    sections: [],
    lyrics: `VERSO 1
//D                A
Renuévame, Señor Jesús
//Bm             F#m
Ya no quiero ser igual

CORO
//G              D
Porque todo lo que hay dentro de mí
//A              Bm
necesita ser cambiado, Señor`,
    notes: ''
  }
];
