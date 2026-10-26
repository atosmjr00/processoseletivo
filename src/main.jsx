import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Falha ao renderizar a página de carreiras:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '8vh auto', padding: 24, color: '#20221f' }}>
          <p style={{ color: '#617b42', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>GREENN · PRÉVIA INTERNA</p>
          <h1 style={{ fontSize: 30 }}>A página encontrou um erro ao abrir.</h1>
          <p>Esta tela substitui a página branca para ajudar a identificar o problema. Copie a mensagem abaixo e envie no chat.</p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: '#f2f2ec', border: '1px solid #dedfd8', borderRadius: 8, padding: 16 }}>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 16px', border: 0, borderRadius: 8, background: '#20221f', color: 'white', cursor: 'pointer' }}>Recarregar página</button>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<main style="font-family:system-ui,sans-serif;padding:24px"><h1>Não encontrei o elemento #root.</h1><p>Confira o index.html do projeto e reinicie o Vite.</p></main>';
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </React.StrictMode>
  );
}