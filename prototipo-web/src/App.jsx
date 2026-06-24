import React, { useState, createContext, useContext } from 'react';
import {
  LogIn, LogOut, User, Truck, FileText, PawPrint, Search, BarChart3,
  Users, Settings, ShieldCheck, ClipboardCheck, AlertTriangle, CheckCircle2,
  XCircle, Clock, ChevronRight, Plus, Download, Eye, Lock, Globe2, Bell,
  LayoutDashboard, FolderOpen, Activity, Database, Languages, Type, X, Minus
} from 'lucide-react';

const COLORS = {
  navy: '#0B3D6B',
  blue: '#1E6FB5',
  blueLight: '#E6F1FB',
  paper: '#F7F8FA',
  ink: '#16212B',
  inkSoft: '#5B6B79',
  border: '#E1E5EA',
  red: '#C0392B',
  redLight: '#FBEAE8',
  green: '#1E8449',
  greenLight: '#E8F6EE',
  amber: '#B7791F',
  amberLight: '#FBF1DD',
};

const FONT_SCALES = { sm: 0.92, md: 1, lg: 1.12 };

const TEXTS = {
  es: {
    selectRole: 'Selecciona un perfil para ver el contenido y las funciones disponibles para ese rol',
    accessNote: 'En la versión final cada perfil tendrá usuario y contraseña asignados por el administrador. Aquí el acceso es libre, salvo el panel de Administrador, que queda restringido conforme al control de acceso basado en roles (RBAC) definido en la ERS.',
  },
  en: {
    selectRole: 'Select a profile to preview the content and functions available for that role',
    accessNote: 'In the final version each profile will have a username and password assigned by the administrator. Here access is open, except for the Administrator panel, which remains restricted per the role-based access control (RBAC) defined in the SRS.',
  },
};

const AccessibilityContext = createContext({
  fontScale: 'md', setFontScale: () => {}, language: 'es', setLanguage: () => {}, t: TEXTS.es,
});

function AccessibilityProvider({ children }) {
  const [fontScale, setFontScale] = useState('md');
  const [language, setLanguage] = useState('es');
  const t = TEXTS[language] || TEXTS.es;
  return (
    <AccessibilityContext.Provider value={{ fontScale, setFontScale, language, setLanguage, t }}>
      <div style={{ fontSize: `${FONT_SCALES[fontScale] * 100}%` }}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const { fontScale, setFontScale, language, setLanguage } = useContext(AccessibilityContext);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ajustes de accesibilidad"
        style={{
          position: 'fixed', top: 20, right: 20, zIndex: 50, width: 46, height: 46, borderRadius: '50%',
          background: '#fff', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <Settings size={20} color={COLORS.navy} />
      </button>

      {open && (
        <div style={{
          position: 'fixed', top: 76, right: 20, zIndex: 50, width: 280, background: '#fff',
          borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.22)', border: `1px solid ${COLORS.border}`,
          padding: 18, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>Ajustes de accesibilidad</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.inkSoft, display: 'flex' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: COLORS.inkSoft, marginBottom: 8 }}>
              <Type size={14} /> Tamaño de letra
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['sm', 'A-'], ['md', 'A'], ['lg', 'A+']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFontScale(key)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${fontScale === key ? COLORS.navy : COLORS.border}`,
                    background: fontScale === key ? COLORS.navy : '#fff',
                    color: fontScale === key ? '#fff' : COLORS.ink,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: COLORS.inkSoft, marginBottom: 8 }}>
              <Languages size={14} /> Idioma
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['es', 'Español'], ['en', 'English']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLanguage(key)}
                  style={{
                    flex: 1, padding: '8px 6px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${language === key ? COLORS.navy : COLORS.border}`,
                    background: language === key ? COLORS.navy : '#fff',
                    color: language === key ? '#fff' : COLORS.ink,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 8, lineHeight: 1.4 }}>
              RNF24 — disponible en español; otros idiomas se incorporarán en futuras versiones.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

const RegistryContext = createContext(null);

function RegistryProvider({ children }) {
  const [tramites, setTramites] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [declaracionesSag, setDeclaracionesSag] = useState([]);
  const [declaracionesMascota, setDeclaracionesMascota] = useState([]);

  let seq = 0;
  function nextId(prefix) {
    seq += 1;
    return `${prefix}-${Date.now().toString().slice(-5)}${seq}`;
  }

  function agregarTramite(tipo) {
    const id = nextId('TR');
    setTramites((t) => [{ id, tipo, estado: 'pendiente', fecha: hoyFormateada() }, ...t]);
    return id;
  }

  function agregarVehiculo(data) {
    const id = nextId('VEH');
    setVehiculos((v) => [{ id, ...data, estado: 'pendiente', fecha: hoyFormateada() }, ...v]);
    return id;
  }

  function agregarDeclaracionSag(data) {
    const id = nextId('SAG');
    setDeclaracionesSag((d) => [{ id, ...data, estado: 'pendiente', fecha: hoyFormateada() }, ...d]);
    return id;
  }

  function agregarDeclaracionMascota(data) {
    const id = nextId('MAS');
    setDeclaracionesMascota((d) => [{ id, ...data, estado: 'pendiente', fecha: hoyFormateada() }, ...d]);
    return id;
  }

  function actualizarEstadoTramite(id, estado) {
    setTramites((t) => t.map((x) => (x.id === id ? { ...x, estado } : x)));
  }

  function actualizarEstadoVehiculo(id, estado) {
    setVehiculos((v) => v.map((x) => (x.id === id ? { ...x, estado } : x)));
  }

  function actualizarEstadoSag(id, estado) {
    setDeclaracionesSag((d) => d.map((x) => (x.id === id ? { ...x, estado } : x)));
  }

  function eliminarDeclaracionMascota(id) {
    setDeclaracionesMascota((d) => d.filter((x) => x.id !== id));
  }

  return (
    <RegistryContext.Provider value={{
      tramites, vehiculos, declaracionesSag, declaracionesMascota,
      agregarTramite, agregarVehiculo, agregarDeclaracionSag, agregarDeclaracionMascota,
      actualizarEstadoTramite, actualizarEstadoVehiculo, actualizarEstadoSag, eliminarDeclaracionMascota,
    }}>
      {children}
    </RegistryContext.Provider>
  );
}

function hoyFormateada() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

const ROLES = [
  {
    id: 'viajero',
    label: 'Viajero / Turista',
    nombre: 'Camila Soto Pardo',
    sub: 'Usuario externo',
    icon: User,
    accent: COLORS.blue,
  },
  {
    id: 'aduanas',
    label: 'Funcionario de Aduanas',
    nombre: 'Marcelo Iturra Vega',
    sub: 'Control y fiscalización',
    icon: ShieldCheck,
    accent: COLORS.navy,
    protected: true,
    accessKey: 'aduanas123',
  },
  {
    id: 'sag_pdi',
    label: 'Funcionario SAG / PDI',
    nombre: 'Daniela Fuentes Rojas',
    sub: 'Control sanitario y migratorio',
    icon: ClipboardCheck,
    accent: COLORS.green,
    protected: true,
    accessKey: 'sagpdi123',
  },
  {
    id: 'admin',
    label: 'Administrador del Sistema',
    nombre: 'Rodrigo Pizarro Núñez',
    sub: 'Acceso restringido — requiere clave',
    icon: Settings,
    accent: COLORS.amber,
    protected: true,
    accessKey: 'admin123',
  },
];

function Logo({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, background: COLORS.navy,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Globe2 size={size * 0.55} color="#fff" strokeWidth={2} />
    </div>
  );
}

function Badge({ children, tone = 'blue' }) {
  const map = {
    blue: { bg: COLORS.blueLight, fg: COLORS.navy },
    green: { bg: COLORS.greenLight, fg: COLORS.green },
    red: { bg: COLORS.redLight, fg: COLORS.red },
    amber: { bg: COLORS.amberLight, fg: COLORS.amber },
    gray: { bg: '#EEF0F2', fg: COLORS.inkSoft },
  };
  const c = map[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.fg, padding: '3px 9px', borderRadius: 100, lineHeight: 1.4,
    }}>
      {children}
    </span>
  );
}

function Card({ children, style = {}, padding = '20px' }) {
  return (
    <div style={{
      background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12,
      padding, ...style,
    }}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = 'primary', icon: Icon, style = {}, type = 'button', disabled }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    fontSize: 14, fontWeight: 600, padding: '10px 16px', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'opacity .15s', opacity: disabled ? 0.5 : 1, fontFamily: 'inherit',
  };
  const variants = {
    primary: { background: COLORS.navy, color: '#fff' },
    secondary: { background: '#fff', color: COLORS.navy, border: `1px solid ${COLORS.border}` },
    danger: { background: COLORS.red, color: '#fff' },
    ghost: { background: 'transparent', color: COLORS.inkSoft, padding: '8px 10px' },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14,
  border: `1px solid ${COLORS.border}`, borderRadius: 8, fontFamily: 'inherit',
  outline: 'none', background: '#fff', color: COLORS.ink,
};

function Toast({ msg, tone, onClose }) {
  if (!msg) return null;
  const tones = {
    success: { bg: COLORS.greenLight, fg: COLORS.green, Icon: CheckCircle2 },
    error: { bg: COLORS.redLight, fg: COLORS.red, Icon: XCircle },
    info: { bg: COLORS.blueLight, fg: COLORS.navy, Icon: Bell },
  };
  const t = tones[tone] || tones.info;
  return (
    <div style={{
      position: 'fixed', top: 18, right: 18, zIndex: 999, background: t.bg, color: t.fg,
      padding: '12px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 14, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxWidth: 360,
    }}>
      <t.Icon size={18} />
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.fg, opacity: 0.6, display: 'flex' }}>
        <XCircle size={16} />
      </button>
    </div>
  );
}

function LoginScreen({ onSelectRole }) {
  const [view, setView] = useState('home'); // home | staffList | staffKey
  const [pendingStaff, setPendingStaff] = useState(null);
  const [staffKey, setStaffKey] = useState('');
  const [staffError, setStaffError] = useState('');
  const viajeroRole = ROLES.find((r) => r.id === 'viajero');
  const staffRoles = ROLES.filter((r) => r.protected);

  function openStaffKeyForm(role) {
    setPendingStaff(role);
    setStaffKey('');
    setStaffError('');
    setView('staffKey');
  }

  function backToStaffList() {
    setPendingStaff(null);
    setStaffKey('');
    setStaffError('');
    setView('staffList');
  }

  function backToHome() {
    setPendingStaff(null);
    setStaffKey('');
    setStaffError('');
    setView('home');
  }

  function submitStaffKey(e) {
    e.preventDefault();
    if (staffKey.trim() === '') {
      setStaffError('Ingresa la clave de acceso');
      return;
    }
    if (staffKey.trim() !== pendingStaff.accessKey) {
      setStaffError('Clave incorrecta');
      return;
    }
    onSelectRole(pendingStaff);
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url('/fondo-paso-fronterizo.jpg')`,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 16px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
        background: 'rgba(8,33,61,0.55)', padding: '10px 18px', borderRadius: 12,
      }}>
        <Logo size={40} />
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>BorderSync</div>
          <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12 }}>Sistema de Gestión Aduanera Inteligente</div>
        </div>
      </div>

      <div style={{ marginTop: 30, width: '100%', maxWidth: 520 }}>

        {view === 'home' && (
          <>
            <div style={{
              background: 'rgba(8,33,61,0.55)', padding: '18px 22px', borderRadius: 14,
              marginBottom: 22, textAlign: 'center',
            }}>
              <h1 style={{ color: '#fff', fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>
                Bienvenido a BorderSync
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                Facilitamos tu cruce fronterizo para que sea más rápido, simple y seguro.
                Selecciona cómo quieres ingresar.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <button
                onClick={() => onSelectRole(viajeroRole)}
                style={{
                  background: '#fff', border: 'none', borderRadius: 14, padding: '22px 20px',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)', transition: 'transform .15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: `${viajeroRole.accent}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={24} color={viajeroRole.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 3 }}>Soy viajero</div>
                  <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>Gestiona tu cruce fronterizo</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 600, color: viajeroRole.accent }}>
                  Continuar <ChevronRight size={15} />
                </div>
              </button>

              <button
                onClick={() => setView('staffList')}
                style={{
                  background: '#fff', border: 'none', borderRadius: 14, padding: '22px 20px',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)', transition: 'transform .15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: `${COLORS.navy}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShieldCheck size={24} color={COLORS.navy} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 3 }}>Soy funcionario</div>
                  <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>Acceso institucional con clave</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 600, color: COLORS.navy }}>
                  Continuar <ChevronRight size={15} />
                </div>
              </button>
            </div>
          </>
        )}

        {view === 'staffList' && (
          <div>
            <p style={{
              textAlign: 'center', color: '#fff', fontSize: 13, marginBottom: 18,
              background: 'rgba(8,33,61,0.55)', padding: '8px 16px', borderRadius: 8,
            }}>
              Acceso exclusivo para personal institucional
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {staffRoles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => openStaffKeyForm(r)}
                    style={{
                      background: '#fff', border: 'none', borderRadius: 12, padding: '14px 16px',
                      textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, background: `${r.accent}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={18} color={r.accent} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>{r.label}</div>
                      <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>{r.sub}</div>
                    </div>
                    <Lock size={14} color={COLORS.inkSoft} />
                  </button>
                );
              })}
            </div>
            <button
              onClick={backToHome}
              style={{
                display: 'block', margin: '18px auto 0', background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.75)', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              ← Volver
            </button>
          </div>
        )}

        {view === 'staffKey' && pendingStaff && (
          <div>
            <Card style={{ borderRadius: 16, border: 'none' }} padding="28px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9, background: `${pendingStaff.accent}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lock size={18} color={pendingStaff.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>Acceso restringido</div>
                  <div style={{ fontSize: 12, color: COLORS.inkSoft }}>{pendingStaff.label}</div>
                </div>
              </div>
              <form onSubmit={submitStaffKey}>
                <Field label="Clave de acceso">
                  <input
                    style={inputStyle} type="password" value={staffKey}
                    onChange={(e) => setStaffKey(e.target.value)} placeholder="••••••••" autoFocus
                  />
                </Field>
                {staffError && (
                  <div style={{ color: COLORS.red, fontSize: 13, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={14} /> {staffError}
                  </div>
                )}
                <Button type="submit" icon={Lock} style={{ width: '100%', justifyContent: 'center' }}>
                  Acceder
                </Button>
                <button
                  type="button"
                  onClick={backToStaffList}
                  style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: COLORS.inkSoft, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Volver a lista de funcionarios
                </button>
              </form>
            </Card>
            <p style={{
              textAlign: 'center', color: '#fff', fontSize: 11, marginTop: 14,
              background: 'rgba(8,33,61,0.55)', padding: '6px 14px', borderRadius: 8,
              width: 'fit-content', margin: '14px auto 0',
            }}>
              Clave de demostración: {pendingStaff.accessKey}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Shell({ role, navItems, active, setActive, onLogout, children }) {
  const Icon = role.icon;
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.paper, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <aside style={{
        width: 240, background: COLORS.navy, color: '#fff', display: 'flex', flexDirection: 'column',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px' }}>
          <Logo size={32} />
          <div style={{ fontWeight: 700, fontSize: 16 }}>BorderSync</div>
        </div>
        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent', border: 'none',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}
              >
                <ItemIcon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={16} color="#fff" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{role.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{role.sub}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px',
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '28px 36px', maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: COLORS.inkSoft, margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: COLORS.navy, green: COLORS.green, red: COLORS.red, amber: COLORS.amber,
  };
  return (
    <Card padding="16px 18px" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.inkSoft }}>{label}</span>
        <Icon size={16} color={tones[tone]} />
      </div>
      <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.ink }}>{value}</span>
    </Card>
  );
}

function emptyState(Icon, text) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: COLORS.inkSoft }}>
      <Icon size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
      <p style={{ fontSize: 14, margin: 0 }}>{text}</p>
    </div>
  );
}

function ViajeroDashboard({ active, notify }) {
  const {
    tramites, vehiculos, declaracionesSag,
    agregarTramite, agregarVehiculo, agregarDeclaracionSag, agregarDeclaracionMascota,
  } = useContext(RegistryContext);
  const [docForm, setDocForm] = useState({ nombre: '', documento: '', destino: '', fecha: '' });
  const [vehForm, setVehForm] = useState({ patente: '', modelo: '', propietario: '', tipo: 'particular', placaCD: '' });
  const [sagForm, setSagForm] = useState({ productos: '' });
  const [mascotaForm, setMascotaForm] = useState({ tipo: '', cantidad: '1', edadDeclarante: '', tutor: '' });
  const [consultaId, setConsultaId] = useState('');
  const [consultaResultado, setConsultaResultado] = useState(null);

  function submitDocumentacion(e) {
    e.preventDefault();
    if (!docForm.nombre || !docForm.documento || !docForm.destino || !docForm.fecha) {
      notify('Faltan campos obligatorios. El sistema bloqueó el envío.', 'error');
      return;
    }
    agregarTramite('Ingreso de documentación');
    notify('Documentación registrada correctamente (RF03)', 'success');
    setDocForm({ nombre: '', documento: '', destino: '', fecha: '' });
  }

  function submitVehiculo(e) {
    e.preventDefault();
    if (!vehForm.patente || !vehForm.modelo || !vehForm.propietario) {
      notify('Datos del vehículo incompletos', 'error');
      return;
    }
    if (vehForm.tipo === 'diplomatico' && !['CD', 'CC', 'OI', 'PAT'].includes(vehForm.placaCD.toUpperCase())) {
      notify('Tipo de placa diplomática no reconocido por el sistema', 'error');
      return;
    }
    const docTipo = vehForm.tipo === 'particular'
      ? 'Salida y Admisión Temporal de Vehículos Acuerdo Chileno-Argentino (180 días corridos)'
      : 'Título de Salida Temporal de Vehículos (90 días corridos)';
    agregarVehiculo({ patente: vehForm.patente, modelo: vehForm.modelo, propietario: vehForm.propietario, tipo: vehForm.tipo, documentoGenerado: docTipo });
    notify(`Documento generado: ${docTipo}`, 'success');
    setVehForm({ patente: '', modelo: '', propietario: '', tipo: 'particular', placaCD: '' });
  }

  function submitSag(e) {
    e.preventDefault();
    if (!sagForm.productos.trim()) {
      notify('Debe declarar al menos un producto, o indicar "ninguno"', 'error');
      return;
    }
    const restringido = /carne|fruta|semilla|planta|queso/i.test(sagForm.productos);
    agregarDeclaracionSag({ detalle: sagForm.productos, riesgo: restringido ? 'alto' : 'bajo' });
    if (restringido) {
      notify('Declaración registrada — advertencia: contiene productos restringidos sujetos a revisión SAG', 'info');
    } else {
      notify('Declaración SAG registrada correctamente (RF05)', 'success');
    }
    setSagForm({ productos: '' });
  }

  function submitMascota(e) {
    e.preventDefault();
    if (!mascotaForm.tipo || !mascotaForm.cantidad) {
      notify('Formulario incompleto: faltan campos pendientes', 'error');
      return;
    }
    const edad = parseInt(mascotaForm.edadDeclarante || '99', 10);
    if (edad < 18 && !mascotaForm.tutor.trim()) {
      notify('Declarante menor de edad sin representante registrado: envío bloqueado', 'error');
      return;
    }
    agregarDeclaracionMascota({ tipo: mascotaForm.tipo, cantidad: mascotaForm.cantidad, riesgo: 'bajo' });
    notify('Declaración de mascota registrada y disponible para SAG/Aduanas (RF09)', 'success');
    setMascotaForm({ tipo: '', cantidad: '1', edadDeclarante: '', tutor: '' });
  }

  function consultarEstado(e) {
    e.preventDefault();
    const found = tramites.find((t) => t.id.toLowerCase() === consultaId.trim().toLowerCase());
    setConsultaResultado(found || 'not_found');
  }

  if (active === 'inicio') {
    return (
      <>
        <PageHeader title="Panel del viajero" subtitle="Resumen de tus trámites para el cruce fronterizo" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Trámites activos" value={tramites.length} icon={FolderOpen} tone="blue" />
          <StatCard label="Aprobados" value={tramites.filter(t => t.estado === 'aprobado').length} icon={CheckCircle2} tone="green" />
          <StatCard label="Pendientes" value={tramites.filter(t => t.estado === 'pendiente').length} icon={Clock} tone="amber" />
        </div>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Tus trámites recientes</h3>
          {tramites.length === 0 ? emptyState(FolderOpen, 'Aún no tienes trámites registrados') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tramites.map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.ink }}>{t.tipo}</div>
                    <div style={{ fontSize: 12, color: COLORS.inkSoft, fontFamily: 'monospace' }}>{t.id} · {t.fecha}</div>
                  </div>
                  <Badge tone={t.estado === 'aprobado' ? 'green' : 'amber'}>
                    {t.estado === 'aprobado' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {t.estado === 'aprobado' ? 'Aprobado' : 'Pendiente'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </>
    );
  }

  if (active === 'documentacion') {
    return (
      <>
        <PageHeader title="Ingreso de documentación" subtitle="RF03 — Documentación requerida para el cruce fronterizo" />
        <Card style={{ maxWidth: 520 }}>
          <form onSubmit={submitDocumentacion}>
            <Field label="Nombre completo">
              <input style={inputStyle} value={docForm.nombre} onChange={(e) => setDocForm({ ...docForm, nombre: e.target.value })} placeholder="Nombre y apellidos" />
            </Field>
            <Field label="N° de documento de identidad">
              <input style={inputStyle} value={docForm.documento} onChange={(e) => setDocForm({ ...docForm, documento: e.target.value })} placeholder="RUN o pasaporte" />
            </Field>
            <Field label="Destino del viaje">
              <input style={inputStyle} value={docForm.destino} onChange={(e) => setDocForm({ ...docForm, destino: e.target.value })} placeholder="Ej: Mendoza, Argentina" />
            </Field>
            <Field label="Fecha de viaje">
              <input style={inputStyle} type="date" value={docForm.fecha} onChange={(e) => setDocForm({ ...docForm, fecha: e.target.value })} />
            </Field>
            <Button type="submit" icon={FileText} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
              Registrar documentación
            </Button>
          </form>
        </Card>
      </>
    );
  }

  if (active === 'vehiculo') {
    return (
      <>
        <PageHeader title="Gestión de vehículos" subtitle="RF04 — Registro para salida o ingreso al país" />
        <Card style={{ maxWidth: 520 }}>
          <form onSubmit={submitVehiculo}>
            <Field label="Tipo de vehículo">
              <select style={inputStyle} value={vehForm.tipo} onChange={(e) => setVehForm({ ...vehForm, tipo: e.target.value })}>
                <option value="particular">Particular</option>
                <option value="diplomatico">Diplomático</option>
              </select>
            </Field>
            <Field label="Patente">
              <input style={inputStyle} value={vehForm.patente} onChange={(e) => setVehForm({ ...vehForm, patente: e.target.value.toUpperCase() })} placeholder="AB1234" />
            </Field>
            <Field label="Modelo">
              <input style={inputStyle} value={vehForm.modelo} onChange={(e) => setVehForm({ ...vehForm, modelo: e.target.value })} placeholder="Ej: Toyota Yaris 2022" />
            </Field>
            <Field label="Propietario">
              <input style={inputStyle} value={vehForm.propietario} onChange={(e) => setVehForm({ ...vehForm, propietario: e.target.value })} placeholder="Nombre del propietario" />
            </Field>
            {vehForm.tipo === 'diplomatico' && (
              <Field label="Tipo de placa (CD, CC, OI, PAT)">
                <input style={inputStyle} value={vehForm.placaCD} onChange={(e) => setVehForm({ ...vehForm, placaCD: e.target.value })} placeholder="CD" />
              </Field>
            )}
            <Button type="submit" icon={Truck} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
              Generar documento de salida
            </Button>
          </form>
        </Card>
      </>
    );
  }

  if (active === 'sag') {
    return (
      <>
        <PageHeader title="Declaración SAG" subtitle="RF05 — Declaración jurada de productos de origen animal o vegetal" />
        <Card style={{ maxWidth: 520 }}>
          <form onSubmit={submitSag}>
            <Field label="Listado de productos declarados">
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                value={sagForm.productos}
                onChange={(e) => setSagForm({ productos: e.target.value })}
                placeholder="Ej: 2 kg de queso, 1 planta ornamental — o escribe 'ninguno'"
              />
            </Field>
            <p style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: -6, marginBottom: 14 }}>
              Carne, frutas, semillas, plantas y quesos generan advertencia automática por restricción sanitaria.
            </p>
            <Button type="submit" icon={ClipboardCheck} style={{ width: '100%', justifyContent: 'center' }}>
              Registrar declaración
            </Button>
          </form>
        </Card>
      </>
    );
  }

  if (active === 'mascotas') {
    return (
      <>
        <PageHeader title="Declaración de mascotas" subtitle="RF09 — Declaración jurada de animales al ingresar a Chile" />
        <Card style={{ maxWidth: 520 }}>
          <form onSubmit={submitMascota}>
            <Field label="Tipo de animal">
              <input style={inputStyle} value={mascotaForm.tipo} onChange={(e) => setMascotaForm({ ...mascotaForm, tipo: e.target.value })} placeholder="Ej: Perro, gato" />
            </Field>
            <Field label="Cantidad">
              <input style={inputStyle} type="number" min="1" value={mascotaForm.cantidad} onChange={(e) => setMascotaForm({ ...mascotaForm, cantidad: e.target.value })} />
            </Field>
            <Field label="Edad del declarante">
              <input style={inputStyle} type="number" min="0" value={mascotaForm.edadDeclarante} onChange={(e) => setMascotaForm({ ...mascotaForm, edadDeclarante: e.target.value })} placeholder="Años" />
            </Field>
            {parseInt(mascotaForm.edadDeclarante || '99', 10) < 18 && (
              <Field label="Datos del representante legal">
                <input style={inputStyle} value={mascotaForm.tutor} onChange={(e) => setMascotaForm({ ...mascotaForm, tutor: e.target.value })} placeholder="Nombre del representante legal" />
              </Field>
            )}
            <Button type="submit" icon={PawPrint} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
              Registrar declaración
            </Button>
          </form>
        </Card>
      </>
    );
  }

  if (active === 'consulta') {
    return (
      <>
        <PageHeader title="Consulta de estado" subtitle="RF07 — Consulta del estado de tus trámites en línea" />
        <Card style={{ maxWidth: 480 }}>
          <form onSubmit={consultarEstado} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input style={inputStyle} value={consultaId} onChange={(e) => setConsultaId(e.target.value)} placeholder="Ej: TR-2026-0341" />
            <Button type="submit" icon={Search}>Buscar</Button>
          </form>
          {consultaResultado === 'not_found' && (
            <p style={{ color: COLORS.red, fontSize: 13.5, fontWeight: 600 }}>No existe un registro con ese identificador.</p>
          )}
          {consultaResultado && consultaResultado !== 'not_found' && (
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{consultaResultado.tipo}</div>
              <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginBottom: 10 }}>{consultaResultado.id} · {consultaResultado.fecha}</div>
              <Badge tone={consultaResultado.estado === 'aprobado' ? 'green' : 'amber'}>
                {consultaResultado.estado === 'aprobado' ? 'Aprobado' : 'Pendiente'}
              </Badge>
            </div>
          )}
        </Card>
      </>
    );
  }

  return null;
}

function AduanasDashboard({ active, notify }) {
  const { tramites, vehiculos, actualizarEstadoTramite, actualizarEstadoVehiculo } = useContext(RegistryContext);

  const cola = [
    ...tramites.map((t) => ({ ...t, origen: 'tramite' })),
    ...vehiculos.map((v) => ({ ...v, tipo: `Registro de vehículo (${v.patente})`, origen: 'vehiculo' })),
  ].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  function resolver(item, decision) {
    if (item.origen === 'tramite') {
      actualizarEstadoTramite(item.id, decision);
    } else {
      actualizarEstadoVehiculo(item.id, decision);
    }
    notify(decision === 'aprobado' ? `${item.id} validado` : `${item.id} rechazado`, decision === 'aprobado' ? 'success' : 'error');
  }

  if (active === 'inicio') {
    return (
      <>
        <PageHeader title="Panel de fiscalización" subtitle="Control y validación de operaciones aduaneras" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Pendientes de validar" value={cola.filter(d => d.estado === 'pendiente').length} icon={Clock} tone="amber" />
          <StatCard label="Validados" value={cola.filter(d => d.estado === 'aprobado').length} icon={CheckCircle2} tone="green" />
          <StatCard label="Usuarios concurrentes" value="5.000" icon={Activity} tone="blue" />
        </div>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Cola de validación</h3>
          {cola.length === 0 ? emptyState(ClipboardCheck, 'Aún no hay trámites ingresados por viajeros para validar') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cola.map((d) => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.tipo}</div>
                    <div style={{ fontSize: 12, color: COLORS.inkSoft, fontFamily: 'monospace' }}>{d.id} · {d.fecha}</div>
                  </div>
                  {d.estado === 'pendiente' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => resolver(d, 'rechazado')}>Rechazar</Button>
                      <Button style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => resolver(d, 'aprobado')}>Validar</Button>
                    </div>
                  ) : (
                    <Badge tone={d.estado === 'aprobado' ? 'green' : 'red'}>
                      {d.estado === 'aprobado' ? 'Validado' : 'Rechazado'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </>
    );
  }

  if (active === 'fiscalizacion') {
    return (
      <>
        <PageHeader title="Fiscalizar operaciones aduaneras" subtitle="Búsqueda de operaciones por viajero o trámite" />
        <Card style={{ maxWidth: 600 }}>
          <Field label="Buscar por ID de trámite o vehículo">
            <input style={inputStyle} placeholder="Ej: TR-12345 o VEH-12345" />
          </Field>
          <p style={{ fontSize: 13, color: COLORS.inkSoft }}>
            La búsqueda consulta los trámites y vehículos registrados por los viajeros en este prototipo. En producción consultaría la base de datos centralizada vía API REST (RF06).
          </p>
        </Card>
      </>
    );
  }

  if (active === 'reportes') {
    return (
      <>
        <PageHeader title="Reportes y estadísticas" subtitle="RF08 — Reportes estadísticos de ingresos y egresos" />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button icon={Download} variant="secondary" onClick={() => notify('Reporte PDF generado (simulado)', 'success')}>Exportar PDF</Button>
          <Button icon={Download} variant="secondary" onClick={() => notify('Reporte Excel generado (simulado)', 'success')}>Exportar Excel</Button>
        </div>
      </>
    );
  }

  return null;
}

function SagPdiDashboard({ active, notify }) {
  const { declaracionesSag, declaracionesMascota, actualizarEstadoSag, eliminarDeclaracionMascota } = useContext(RegistryContext);

  const pendientesSag = declaracionesSag.filter((d) => d.estado === 'pendiente');
  const combinadas = [
    ...pendientesSag.map((d) => ({ ...d, origen: 'sag', detalle: d.detalle })),
    ...declaracionesMascota.map((d) => ({ ...d, origen: 'mascota', detalle: `Declaración de mascota: ${d.cantidad} ${d.tipo}` })),
  ];

  function revisar(item) {
    if (item.origen === 'sag') {
      actualizarEstadoSag(item.id, 'aprobado');
    } else {
      eliminarDeclaracionMascota(item.id);
    }
    notify(`${item.id} marcada como revisada`, 'success');
  }

  if (active === 'inicio') {
    return (
      <>
        <PageHeader title="Panel de fiscalización sanitaria" subtitle="Revisión de declaraciones SAG/PDI" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Por revisar" value={combinadas.length} icon={ClipboardCheck} tone="amber" />
          <StatCard label="Riesgo alto" value={combinadas.filter(d => d.riesgo === 'alto').length} icon={AlertTriangle} tone="red" />
          <StatCard label="Riesgo bajo" value={combinadas.filter(d => d.riesgo === 'bajo' || !d.riesgo).length} icon={CheckCircle2} tone="green" />
        </div>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Declaraciones pendientes</h3>
          {combinadas.length === 0 ? emptyState(ClipboardCheck, 'Aún no hay declaraciones registradas por viajeros') : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {combinadas.map((d) => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.id}</div>
                    <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>{d.detalle}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Badge tone={d.riesgo === 'alto' ? 'red' : d.riesgo === 'medio' ? 'amber' : 'green'}>
                      Riesgo {d.riesgo || 'bajo'}
                    </Badge>
                    <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => revisar(d)}>Revisar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </>
    );
  }

  return null;
}

function AdminDashboard({ active, notify }) {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Camila Soto Pardo', rol: 'Viajero', estado: 'activo' },
    { id: 2, nombre: 'Marcelo Iturra Vega', rol: 'Aduanas', estado: 'activo' },
    { id: 3, nombre: 'Daniela Fuentes Rojas', rol: 'SAG/PDI', estado: 'activo' },
    { id: 4, nombre: 'Pedro Lagos M.', rol: 'Viajero', estado: 'bloqueado' },
  ]);

  function toggleEstado(id) {
    setUsuarios((u) => u.map((x) => x.id === id ? { ...x, estado: x.estado === 'activo' ? 'bloqueado' : 'activo' } : x));
  }

  if (active === 'inicio') {
    return (
      <>
        <PageHeader title="Panel de administración" subtitle="Gestión de usuarios, configuración y monitoreo del sistema" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Usuarios totales" value={usuarios.length} icon={Users} tone="blue" />
          <StatCard label="Disponibilidad" value="99.9%" icon={Activity} tone="green" />
          <StatCard label="Integraciones activas" value="4 / 4" icon={Database} tone="blue" />
          <StatCard label="Alertas de seguridad" value="0" icon={ShieldCheck} tone="green" />
        </div>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Estado de integraciones (3.1.3)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {['SAG', 'PDI', 'Aduanas (interno)', 'Aduanas Argentina'].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: COLORS.greenLight, borderRadius: 8 }}>
                <CheckCircle2 size={15} color={COLORS.green} />
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.green }}>{s}</span>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (active === 'usuarios') {
    return (
      <>
        <PageHeader
          title="Gestión de usuarios y roles"
          subtitle="Control de acceso basado en roles (RBAC)"
          action={<Button icon={Plus} onClick={() => notify('Formulario de alta de usuario (simulado)', 'info')}>Nuevo usuario</Button>}
        />
        <Card padding="0">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {usuarios.map((u, i) => (
              <div key={u.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px',
                borderBottom: i < usuarios.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{u.nombre}</div>
                  <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>{u.rol}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Badge tone={u.estado === 'activo' ? 'green' : 'red'}>{u.estado === 'activo' ? 'Activo' : 'Bloqueado'}</Badge>
                  <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => toggleEstado(u.id)}>
                    {u.estado === 'activo' ? 'Bloquear' : 'Reactivar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (active === 'config') {
    return (
      <>
        <PageHeader title="Configuración del sistema" subtitle="Parámetros generales (simulado)" />
        <Card style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['Autenticación multifactor (MFA)', true],
            ['Bloqueo tras 5 intentos fallidos', true],
            ['Cifrado AES-256 en reposo', true],
            ['Modo mantenimiento', false],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>{label}</span>
              <Badge tone={val ? 'green' : 'gray'}>{val ? 'Activado' : 'Desactivado'}</Badge>
            </div>
          ))}
        </Card>
      </>
    );
  }

  return null;
}

const NAV_BY_ROLE = {
  viajero: [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'documentacion', label: 'Documentación de viaje', icon: FileText },
    { id: 'vehiculo', label: 'Vehículo', icon: Truck },
    { id: 'sag', label: 'Declaración SAG', icon: ClipboardCheck },
    { id: 'mascotas', label: 'Declaración de mascotas', icon: PawPrint },
    { id: 'consulta', label: 'Consultar estado', icon: Search },
  ],
  aduanas: [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'fiscalizacion', label: 'Fiscalizar operaciones', icon: ShieldCheck },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  ],
  sag_pdi: [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
  ],
  admin: [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'usuarios', label: 'Usuarios y roles', icon: Users },
    { id: 'config', label: 'Configuración', icon: Settings },
  ],
};

export default function App() {
  const [role, setRole] = useState(null);
  const [active, setActive] = useState('inicio');
  const [toast, setToast] = useState(null);

  function notify(msg, tone = 'info') {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 3200);
  }

  function handleLogin(r) {
    setRole(r);
    setActive('inicio');
    notify(`Sesión iniciada como ${r.label}`, 'success');
  }

  function handleLogout() {
    setRole(null);
  }

  return (
    <RegistryProvider>
      <AccessibilityProvider>
        {!role ? (
          <LoginScreen onSelectRole={handleLogin} />
        ) : (
          <Shell role={role} navItems={NAV_BY_ROLE[role.id]} active={active} setActive={setActive} onLogout={handleLogout}>
            <Toast msg={toast?.msg} tone={toast?.tone} onClose={() => setToast(null)} />
            {role.id === 'viajero' && <ViajeroDashboard active={active} notify={notify} />}
            {role.id === 'aduanas' && <AduanasDashboard active={active} notify={notify} />}
            {role.id === 'sag_pdi' && <SagPdiDashboard active={active} notify={notify} />}
            {role.id === 'admin' && <AdminDashboard active={active} notify={notify} />}
          </Shell>
        )}
        <AccessibilityMenu />
      </AccessibilityProvider>
    </RegistryProvider>
  );
}
