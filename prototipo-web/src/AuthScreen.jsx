import React, { useState } from 'react';
import { AlertTriangle, Globe2, Lock, UserPlus } from 'lucide-react';
import { login, register } from './api.js';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '11px 12px', fontSize: 14,
  border: '1px solid #D8E0E8', borderRadius: 8, fontFamily: 'inherit', outline: 'none',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 13 }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 650, marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', documentNumber: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      onAuthenticated(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24,
      backgroundImage: "linear-gradient(rgba(5,30,55,.45),rgba(5,30,55,.58)),url('/fondo-paso-fronterizo.jpg')",
      backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 430 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, color: '#fff', marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, display: 'grid', placeItems: 'center', background: '#0B3D6B' }}>
            <Globe2 size={25} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 750 }}>BorderSync</div>
            <div style={{ fontSize: 12, opacity: .9 }}>Sistema de Gestión Aduanera Inteligente</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 26, boxShadow: '0 16px 45px rgba(0,0,0,.28)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#EEF3F7', borderRadius: 9, padding: 4, marginBottom: 22 }}>
            {[['login', 'Iniciar sesión'], ['register', 'Crear cuenta']].map(([key, label]) => (
              <button key={key} type="button" onClick={() => changeMode(key)} style={{
                border: 0, borderRadius: 7, padding: 9, cursor: 'pointer', fontWeight: 650,
                color: mode === key ? '#fff' : '#5B6B79', background: mode === key ? '#0B3D6B' : 'transparent',
              }}>{label}</button>
            ))}
          </div>

          <h1 style={{ fontSize: 20, margin: '0 0 5px', color: '#16212B' }}>
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Registro de viajero'}
          </h1>
          <p style={{ color: '#5B6B79', fontSize: 13, margin: '0 0 20px' }}>
            {mode === 'login' ? 'Ingresa con tus credenciales de BorderSync.' : 'Crea una cuenta para gestionar tu cruce fronterizo.'}
          </p>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <>
                <Field label="Nombre completo">
                  <input style={inputStyle} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required maxLength={150} />
                </Field>
                <Field label="RUN o pasaporte">
                  <input style={inputStyle} value={form.documentNumber} onChange={(e) => update('documentNumber', e.target.value)} required maxLength={40} />
                </Field>
              </>
            )}
            <Field label="Correo electrónico">
              <input style={inputStyle} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required autoComplete="email" />
            </Field>
            <Field label="Contraseña">
              <input style={inputStyle} type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} maxLength={72} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </Field>

            {error && (
              <div role="alert" style={{ display: 'flex', gap: 8, color: '#C0392B', background: '#FBEAE8', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                <AlertTriangle size={17} /> <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', border: 0, borderRadius: 8, padding: 11, cursor: loading ? 'wait' : 'pointer',
              background: '#0B3D6B', color: '#fff', fontWeight: 700, display: 'flex', justifyContent: 'center', gap: 8,
            }}>
              {mode === 'login' ? <Lock size={17} /> : <UserPlus size={17} />}
              {loading ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión' : 'Registrar cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
