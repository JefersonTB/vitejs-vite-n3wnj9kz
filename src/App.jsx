import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Users,
  Shirt,
  ShoppingBag,
  Utensils,
  LayoutGrid,
  CheckCircle2,
  Plus,
  Trash2,
  Shuffle,
  Copy,
  Check,
  Settings,
  ArrowLeft,
  PartyPopper,
  Calendar,
  MapPin,
  Clock,
  Search,
  ChevronRight,
  Gift,
  Crown,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ============================================================================
// CONFIGURACIÓN DE BASE DE DATOS EN TIEMPO REAL (FIREBASE)
// Cuando publiques esta web en Vercel, Netlify o StackBlitz, pega aquí las
// credenciales de tu proyecto gratuito de Firebase (console.firebase.google.com).
// ============================================================================
const MANUAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDrTu33D-eL_ofcDHqaknHGBZOEwl7Zr9M",
  authDomain: "cumpleanos-oscar-reyes.firebaseapp.com",
  projectId: "cumpleanos-oscar-reyes",
  storageBucket: "cumpleanos-oscar-reyes.firebasestorage.app",
  messagingSenderId: "539603566222",
  appId: "1:539603566222:web:0566fa8d26220558f4d3df",
  measurementId: "G-GYGXMDKCJ5"
};

let db = null;
let auth = null;
let isFirebaseConfigured = false;
let currentAppId = 'cumple-oscar-reyes';

try {
  const envConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  const activeConfig = envConfig || (MANUAL_FIREBASE_CONFIG.apiKey !== "TU_API_KEY" ? MANUAL_FIREBASE_CONFIG : null);
  if (typeof __app_id !== 'undefined') {
    currentAppId = __app_id;
  }

  if (activeConfig) {
    const app = initializeApp(activeConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseConfigured = true;
  }
} catch (err) {
  console.error("Error inicializando Firebase:", err);
}

const COLOR_PALETTE = [
  {
    id: 'negro',
    name: 'Negro',
    emoji: '🖤',
    bgClass: 'bg-zinc-900',
    cardGradient: 'from-zinc-900 via-neutral-900 to-black',
    lightBg: 'bg-zinc-100',
    borderClass: 'border-zinc-800',
    textClass: 'text-zinc-900',
    badgeClass: 'bg-zinc-900 text-white',
    ringClass: 'ring-zinc-800',
    hex: '#18181b',
    suggestions: ['Oreo', 'Doritos Dinamita', 'Coca-Cola Zero', 'Gomitas Black', 'Chocolatina Jet Negra', 'Pasabocas empaque negro']
  },
  {
    id: 'morado',
    name: 'Morado',
    emoji: '💜',
    bgClass: 'bg-purple-600',
    cardGradient: 'from-purple-600 via-purple-700 to-indigo-900',
    lightBg: 'bg-purple-50',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-700',
    badgeClass: 'bg-purple-600 text-white',
    ringClass: 'ring-purple-500',
    hex: '#9333ea',
    suggestions: ['Takis Fuego / Morados', 'Gaseosa Uva', 'Galletas Festival Mora', 'Chicles Morados', 'Gomitas de Mora', 'Vino / Sangría']
  },
  {
    id: 'rojo',
    name: 'Rojo',
    emoji: '❤️',
    bgClass: 'bg-red-600',
    cardGradient: 'from-red-500 via-red-600 to-rose-800',
    lightBg: 'bg-red-50',
    borderClass: 'border-red-500',
    textClass: 'text-red-700',
    badgeClass: 'bg-red-600 text-white',
    ringClass: 'ring-red-500',
    hex: '#dc2626',
    suggestions: ['Doritos Nacho', 'DeTodito Rojo', 'Coca-Cola Original', 'Fresas / Cerezas', 'Choclitos / Cheetos', 'M&M Rojos']
  },
  {
    id: 'verde',
    name: 'Verde',
    emoji: '💚',
    bgClass: 'bg-emerald-600',
    cardGradient: 'from-emerald-500 via-emerald-600 to-teal-800',
    lightBg: 'bg-emerald-50',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-600 text-white',
    ringClass: 'ring-emerald-500',
    hex: '#059669',
    suggestions: ['Papas Margarita Limón', 'Sprite / 7Up', 'Gomitas Ácidas Verdes', 'Guacamole y Nachos', 'Uvas Verdes', 'Cerveza botella verde']
  },
  {
    id: 'amarillo',
    name: 'Amarillo',
    emoji: '💛',
    bgClass: 'bg-amber-400',
    cardGradient: 'from-amber-400 via-yellow-500 to-orange-500',
    lightBg: 'bg-amber-50',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-800',
    badgeClass: 'bg-amber-400 text-zinc-950',
    ringClass: 'ring-amber-400',
    hex: '#facc15',
    suggestions: ['Papas Margarita Pollo', 'Tostacos / Platanitos', 'Colombiana / Piña / Mango', 'M&M Amarillos', 'Chocman / Ponqué', 'Cerveza Corona']
  },
  {
    id: 'blanco',
    name: 'Blanco',
    emoji: '🤍',
    bgClass: 'bg-slate-100',
    cardGradient: 'from-slate-100 via-white to-slate-200',
    lightBg: 'bg-slate-50',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-800',
    badgeClass: 'bg-white text-slate-900 border border-slate-300',
    ringClass: 'ring-slate-300',
    hex: '#f8fafc',
    isLight: true,
    suggestions: ['MasMelos / Marshmallows', 'Crispetas / Palomitas', 'Raffaello / Chocolate Blanco', 'Soda / Bretaña / Smirnoff Ice', 'Papas Mayonesa / Crema', 'Galletas Wafer Vainilla']
  },
  {
    id: 'azul',
    name: 'Azul',
    emoji: '💙',
    bgClass: 'bg-blue-600',
    cardGradient: 'from-blue-500 via-blue-600 to-indigo-800',
    lightBg: 'bg-blue-50',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-700',
    badgeClass: 'bg-blue-600 text-white',
    ringClass: 'ring-blue-500',
    hex: '#2563eb',
    suggestions: ['Papas Margarita Natural', 'Pepsi / Gatorade Azul', 'Oreo Original', 'Choclitos Limón (empaque azul)', 'Gomitas Tiburones / Moras', 'Galletas Festival Vainilla']
  }
];

const INITIAL_EVENT_INFO = {
  honoree: 'Oscar Reyes',
  title: 'Color Party: Cumpleaños de Oscar Reyes',
  date: 'Sábado 28 de Noviembre',
  time: '8:00 PM',
  location: 'Casa de Oscar / Salón Social'
};

const INITIAL_GUESTS = [
  { id: '1', name: 'Oscar Reyes (Cumpleañero)', colorId: 'negro', snack: 'Torta / Ponqué especial negro', revealed: true },
  { id: '2', name: 'Camila Gómez', colorId: 'morado', snack: 'Takis y gaseosa de uva', revealed: true },
  { id: '3', name: 'Sebastián Díaz', colorId: 'rojo', snack: 'Doritos Nacho grandes', revealed: false },
  { id: '4', name: 'Valentina Torres', colorId: 'verde', snack: '', revealed: false },
  { id: '5', name: 'Mateo Vargas', colorId: 'amarillo', snack: 'Papas de pollo y cervezas', revealed: true },
  { id: '6', name: 'Sofía Castro', colorId: 'blanco', snack: '', revealed: false },
  { id: '7', name: 'Andrés Morales', colorId: 'azul', snack: 'Pepsi y gomitas azules', revealed: true },
  { id: '8', name: 'Daniela Ruiz', colorId: 'negro', snack: '', revealed: false },
  { id: '9', name: 'Juan Pablo Rojas', colorId: 'morado', snack: '', revealed: false },
  { id: '10', name: 'Laura Mendoza', colorId: 'rojo', snack: 'Coca-Cola y fresas', revealed: true },
  { id: '11', name: 'Nicolás Herrera', colorId: 'verde', snack: 'Papas limón y Sprite', revealed: true },
  { id: '12', name: 'Mariana Silva', colorId: 'amarillo', snack: '', revealed: false },
  { id: '13', name: 'Santiago Ortiz', colorId: 'blanco', snack: 'Crispetas y Smirnoff Ice', revealed: true },
  { id: '14', name: 'Paula Jiménez', colorId: 'azul', snack: '', revealed: false }
];

const INITIAL_ACTIVE_COLORS = ['negro', 'morado', 'rojo', 'verde', 'amarillo', 'blanco', 'azul'];

const DEFAULT_PARTY_STATE = {
  eventInfo: INITIAL_EVENT_INFO,
  guests: INITIAL_GUESTS,
  activeColors: INITIAL_ACTIVE_COLORS
};

function distributeColorsEquitably(guestList, activeColorIds) {
  if (!guestList.length || !activeColorIds.length) return guestList;
  const shuffledGuests = [...guestList].sort(() => Math.random() - 0.5);
  const shuffledColors = [...activeColorIds].sort(() => Math.random() - 0.5);

  const colorMap = new Map();
  shuffledGuests.forEach((guest, idx) => {
    const assignedColor = shuffledColors[idx % shuffledColors.length];
    colorMap.set(guest.id, assignedColor);
  });

  return guestList.map((g) => ({
    ...g,
    colorId: colorMap.get(g.id),
    revealed: false
  }));
}

export default function App() {
  const [view, setView] = useState('guest');
  const [partyState, setPartyState] = useState(DEFAULT_PARTY_STATE);
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState(isFirebaseConfigured ? 'connecting' : 'local');
  const [syncError, setSyncError] = useState('');

  // Guest discovery state
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinColorIndex, setSpinColorIndex] = useState(0);
  const [revealedGuestId, setRevealedGuestId] = useState(null);
  const [snackInput, setSnackInput] = useState('');
  const [snackSavedNotice, setSnackSavedNotice] = useState(false);

  // Organizer state
  const [newGuestName, setNewGuestName] = useState('');
  const [bulkGuestsText, setBulkGuestsText] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [localEventInfo, setLocalEventInfo] = useState(INITIAL_EVENT_INFO);

  const { eventInfo, guests, activeColors } = partyState;

  // 1. Autenticación anónima con Firebase
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Error de autenticación:", err);
        setSyncStatus('error');
        setSyncError('No se pudo conectar con la autenticación en la nube.');
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Suscripción en tiempo real a Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !user) return;

    const partyDocRef = doc(db, 'artifacts', currentAppId, 'public', 'data', 'party', 'oscar-reyes-2026');

    const unsubscribe = onSnapshot(
      partyDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPartyState({
            eventInfo: data.eventInfo || INITIAL_EVENT_INFO,
            guests: Array.isArray(data.guests) ? data.guests : INITIAL_GUESTS,
            activeColors: Array.isArray(data.activeColors) ? data.activeColors : INITIAL_ACTIVE_COLORS
          });
          setSyncStatus('live');
          setSyncError('');
        } else {
          try {
            await setDoc(partyDocRef, DEFAULT_PARTY_STATE);
            setSyncStatus('live');
          } catch (writeErr) {
            console.error("Error inicializando documento:", writeErr);
            setSyncStatus('error');
            setSyncError('Verifica que Firestore Database esté creado en Modo de Prueba.');
          }
        }
      },
      (err) => {
        console.error("Error en listener de Firestore:", err);
        setSyncStatus('error');
        setSyncError('Error de conexión con Firestore. Revisa las reglas de seguridad.');
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!editingInfo) {
      setLocalEventInfo(eventInfo);
    }
  }, [eventInfo, editingInfo]);

  // Helper para actualizar estado local y en la nube al mismo tiempo
  const persistPartyState = async (updaterFn) => {
    let nextState;
    setPartyState((prev) => {
      nextState = typeof updaterFn === 'function' ? updaterFn(prev) : updaterFn;
      return nextState;
    });

    if (isFirebaseConfigured && db && user && nextState) {
      try {
        const partyDocRef = doc(db, 'artifacts', currentAppId, 'public', 'data', 'party', 'oscar-reyes-2026');
        await setDoc(partyDocRef, nextState);
      } catch (err) {
        console.error("Error guardando cambios en la nube:", err);
        setSyncError('No se pudo guardar el cambio en la nube.');
      }
    }
  };

  const activeGuest = useMemo(
    () => guests.find((g) => g.id === revealedGuestId) || null,
    [guests, revealedGuestId]
  );

  const activeGuestColor = useMemo(
    () => (activeGuest ? COLOR_PALETTE.find((c) => c.id === activeGuest.colorId) : null),
    [activeGuest]
  );

  const teammates = useMemo(() => {
    if (!activeGuest) return [];
    return guests.filter((g) => g.colorId === activeGuest.colorId && g.id !== activeGuest.id);
  }, [guests, activeGuest]);

  const filteredGuests = useMemo(() => {
    if (!searchTerm.trim()) return guests;
    return guests.filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [guests, searchTerm]);

  const teamsSummary = useMemo(() => {
    return COLOR_PALETTE.filter((c) => activeColors.includes(c.id) || guests.some((g) => g.colorId === c.id)).map((color) => ({
      ...color,
      members: guests.filter((g) => g.colorId === color.id)
    }));
  }, [guests, activeColors]);

  useEffect(() => {
    if (activeGuest) {
      setSnackInput(activeGuest.snack || '');
    }
  }, [activeGuest?.id]);

  // Spin animation when discovering color
  const handleDiscoverColor = () => {
    if (!selectedGuestId) return;
    const guestObj = guests.find((g) => g.id === selectedGuestId);
    if (!guestObj) return;

    if (guestObj.revealed) {
      setRevealedGuestId(guestObj.id);
      return;
    }

    setIsSpinning(true);
    let ticks = 0;
    const maxTicks = 18;
    const interval = setInterval(() => {
      setSpinColorIndex((prev) => (prev + 1) % COLOR_PALETTE.length);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setIsSpinning(false);
        setRevealedGuestId(guestObj.id);
        persistPartyState((prev) => ({
          ...prev,
          guests: prev.guests.map((g) => (g.id === guestObj.id ? { ...g, revealed: true } : g))
        }));
      }
    }, 85);
  };

  const handleSaveSnack = (e) => {
    e.preventDefault();
    if (!activeGuest) return;
    persistPartyState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === activeGuest.id ? { ...g, snack: snackInput.trim() } : g))
    }));
    setSnackSavedNotice(true);
    setTimeout(() => setSnackSavedNotice(false), 2500);
  };

  const handleSelectSuggestion = (item) => {
    setSnackInput(item);
    if (!activeGuest) return;
    persistPartyState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === activeGuest.id ? { ...g, snack: item } : g))
    }));
    setSnackSavedNotice(true);
    setTimeout(() => setSnackSavedNotice(false), 2500);
  };

  // Organizer handlers
  const handleAddSingleGuest = (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const counts = activeColors.map((cId) => ({
      colorId: cId,
      count: guests.filter((g) => g.colorId === cId).length
    }));
    counts.sort((a, b) => a.count - b.count);
    const chosenColor = counts[0]?.colorId || 'negro';

    const newGuest = {
      id: Date.now().toString(),
      name: newGuestName.trim(),
      colorId: chosenColor,
      snack: '',
      revealed: false
    };
    persistPartyState((prev) => ({
      ...prev,
      guests: [...prev.guests, newGuest]
    }));
    setNewGuestName('');
  };

  const handleBulkImport = () => {
    const names = bulkGuestsText
      .split(/\n|,/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (!names.length) return;

    const created = names.map((name, idx) => ({
      id: `${Date.now()}-${idx}`,
      name,
      colorId: activeColors[idx % activeColors.length] || 'negro',
      snack: '',
      revealed: false
    }));

    const combined = [...guests, ...created];
    const balanced = distributeColorsEquitably(combined, activeColors);
    persistPartyState((prev) => ({
      ...prev,
      guests: balanced
    }));
    setBulkGuestsText('');
    setShowBulkModal(false);
  };

  const handleRemoveGuest = (id) => {
    persistPartyState((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id)
    }));
    if (revealedGuestId === id) setRevealedGuestId(null);
    if (selectedGuestId === id) setSelectedGuestId('');
  };

  const handleRebalanceAll = () => {
    const balanced = distributeColorsEquitably(guests, activeColors);
    persistPartyState((prev) => ({
      ...prev,
      guests: balanced
    }));
    setRevealedGuestId(null);
  };

  const toggleActiveColor = (colorId) => {
    let nextColors;
    if (activeColors.includes(colorId)) {
      if (activeColors.length <= 2) return;
      nextColors = activeColors.filter((c) => c !== colorId);
    } else {
      nextColors = [...activeColors, colorId];
    }
    const balanced = distributeColorsEquitably(guests, nextColors);
    persistPartyState((prev) => ({
      ...prev,
      activeColors: nextColors,
      guests: balanced
    }));
  };

  const handleManualColorChange = (guestId, newColorId) => {
    persistPartyState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === guestId ? { ...g, colorId: newColorId } : g))
    }));
  };

  const handleSaveEventInfo = () => {
    persistPartyState((prev) => ({
      ...prev,
      eventInfo: localEventInfo
    }));
    setEditingInfo(false);
  };

  const generateWhatsAppMessage = () => {
    const teamLines = teamsSummary
      .filter((t) => t.members.length > 0)
      .map((team) => {
        const memberList = team.members
          .map((m) => `  • ${m.name}${m.snack ? ` (${m.snack})` : ''}`)
          .join('\n');
        return `${team.emoji} *Equipo ${team.name}:*\n${memberList}`;
      })
      .join('\n\n');

    return `🎂🎨 *¡CUMPLEAÑOS DE ${eventInfo.honoree.toUpperCase()}: COLOR PARTY!* 🎉

Nos vemos el *${eventInfo.date}* a las *${eventInfo.time}* en *${eventInfo.location}*. Para celebrar a Oscar, dividimos al grupo en *equipos por color* y estas son las 4 reglas:

👕 *1. Outfit monocromático:* Venir vestidos de pies a cabeza de su color asignado.
🥣 *2. Recipiente a juego:* Traer todo en un bowl, tazón o canasta del mismo color.
🍿 *3. Mecato y bebidas del color:* Todo lo que traigan para compartir debe tener el empaque o ser de su color.
🤝 *4. Coordinación en equipo:* Pónganse de acuerdo con su equipo para variar entre salado, dulce y bebida.

👇 *ASÍ QUEDARON LOS EQUIPOS:*

${teamLines}

¡Escríbanse con su equipo y preparen ese combo! 🔥🌈`;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const spinningColor = COLOR_PALETTE[spinColorIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* Top Color Strip */}
      <div className="h-2 w-full flex">
        {COLOR_PALETTE.map((c) => (
          <div key={c.id} className="flex-1 h-full" style={{ backgroundColor: c.hex }} />
        ))}
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-2">
          <div
            onClick={() => {
              setView('guest');
              setRevealedGuestId(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-amber-400 to-cyan-400 p-0.5 shadow-lg shadow-fuchsia-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 block leading-none">
                  Cumpleaños #OscarReyes
                </span>
                {syncStatus === 'live' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En vivo
                  </span>
                )}
                {syncStatus === 'connecting' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 text-[10px] font-semibold text-amber-300">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    Conectando
                  </span>
                )}
                {syncStatus === 'local' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-medium text-slate-400" title="Conecta Firebase para sincronizar entre celulares">
                    <WifiOff className="w-2.5 h-2.5" />
                    Vista previa
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                Color Party
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setView('guest')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                view === 'guest'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              Invitado
            </button>
            <button
              onClick={() => setView('organizer')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                view === 'organizer'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Organizador</span>
              <span className="sm:hidden">Organizar</span>
            </button>
          </div>
        </div>
      </header>

      {syncError && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{syncError}</span>
          </div>
        </div>
      )}

      {/* =====================================================================
          VISTA DE INVITADO
      ====================================================================== */}
      {view === 'guest' && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
          {/* Hero Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                Edición Especial de Cumpleaños
              </div>

              <h2 className="text-3xl sm:text-5