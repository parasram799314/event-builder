"use client";

import React from 'react';
import styles from './SettingsPanel.module.css'; // Reusing existing settings panel styles

export interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  navbarColor: string;
  navbarTextColor: string;
  previewColors: string[];
  isLayout?: boolean;
}

// These are inspired by popular open-source themes (Gruvbox, Nord, Tokyo Night, etc.)
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'amber',
    name: 'Default (Barfi)',
    primaryColor: '#f0bf4c',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    navbarColor: '#ffffff',
    navbarTextColor: '#1e293b',
    previewColors: ['#f0bf4c', '#ffffff', '#1e293b']
  },
  {
    id: 'theme-one',
    name: 'Corporate Minimal',
    primaryColor: '#f2545f',
    backgroundColor: '#ffffff',
    textColor: '#101010',
    navbarColor: '#101010',
    navbarTextColor: '#ffffff',
    previewColors: ['#f2545f', '#ffffff', '#101010'],
    isLayout: true
  },
  {
    id: 'theme-two',
    name: 'Modern Luxury',
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    navbarColor: '#ffffff',
    navbarTextColor: '#0f172a',
    previewColors: ['#6366f1', '#ffffff', '#0f172a'],
    isLayout: true
  }
];

interface ThemesPanelProps {
  onSelectTheme: (theme: ThemePreset) => void;
  onClose: () => void;
  variant?: 'sidebar' | 'horizontal';
}

const ThemePreview = ({ id, colors, isSmall = false }: { id: string, colors: string[], isSmall?: boolean }) => {
  const height = isSmall ? '60px' : '80px';
  if (id === 'theme-one') {
    return (
      <div style={{ height, width: '100%', background: '#101010', borderRadius: '6px', position: 'relative', overflow: 'hidden', padding: isSmall ? '5px' : '10px' }}>
        <div style={{ height: isSmall ? '2px' : '4px', width: '30px', background: colors[0], marginBottom: isSmall ? '4px' : '8px' }} />
        <div style={{ height: isSmall ? '6px' : '10px', width: '80%', background: '#fff', opacity: 0.9, marginBottom: isSmall ? '2px' : '4px' }} />
        <div style={{ height: isSmall ? '4px' : '6px', width: '60%', background: '#fff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: isSmall ? '5px' : '10px', left: isSmall ? '5px' : '10px', height: isSmall ? '8px' : '12px', width: '24px', background: colors[0], borderRadius: '2px' }} />
      </div>
    );
  }
  if (id === 'theme-two') {
    return (
      <div style={{ height, width: '100%', background: '#fff', borderRadius: '6px', position: 'relative', overflow: 'hidden', border: '1px solid #eee' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: colors[0], opacity: 0.1 }} />
        <div style={{ padding: isSmall ? '10px 6px' : '15px 10px' }}>
           <div style={{ height: '2px', width: '15px', background: colors[0], marginBottom: isSmall ? '4px' : '8px' }} />
           <div style={{ height: isSmall ? '8px' : '12px', width: '50%', background: '#0f172a', marginBottom: '4px' }} />
           <div style={{ height: isSmall ? '8px' : '12px', width: '40%', background: '#0f172a', marginBottom: isSmall ? '4px' : '8px' }} />
           <div style={{ height: isSmall ? '12px' : '15px', width: '30px', background: '#0f172a', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }
  // Default Barfi
  return (
    <div style={{ height, width: '100%', background: '#fff', borderRadius: '6px', position: 'relative', overflow: 'hidden', border: '1px solid #eee' }}>
      <div style={{ height: isSmall ? '8px' : '12px', width: '100%', background: '#f0bf4c' }} />
      <div style={{ padding: isSmall ? '6px' : '10px', display: 'flex', gap: '6px' }}>
         <div style={{ height: isSmall ? '30px' : '40px', width: isSmall ? '30px' : '40px', background: '#f1f5f9', borderRadius: '4px' }} />
         <div style={{ flex: 1 }}>
            <div style={{ height: isSmall ? '6px' : '8px', width: '100%', background: '#e2e8f0', marginBottom: isSmall ? '2px' : '4px' }} />
            <div style={{ height: isSmall ? '6px' : '8px', width: '70%', background: '#e2e8f0' }} />
         </div>
      </div>
    </div>
  );
};

const ThemesPanel: React.FC<ThemesPanelProps> = ({ onSelectTheme, onClose, variant = 'sidebar' }) => {
  if (variant === 'horizontal') {
    return (
      <div style={{ 
        width: '100%', 
        backgroundColor: 'white', 
        padding: '16px', 
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Select Theme</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '12px', 
          paddingBottom: '8px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          {THEME_PRESETS.map((theme) => (
            <button 
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              style={{
                flex: '0 0 140px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: 'white',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <ThemePreview id={theme.id} colors={theme.previewColors} isSmall={true} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {theme.name}
                </span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.primaryColor, flexShrink: 0 }} />
              </div>
            </button>
          ))}
        </div>
        <style jsx>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`${styles.panel} ${styles.open}`}>
      <div className={styles.header}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>Themes</h3>
        <button onClick={onClose} className={styles.closeBtn}>&times;</button>
      </div>
      
      <div className={styles.content}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {THEME_PRESETS.map((theme) => (
            <button 
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: 'white',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primaryColor;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 20px -5px ${theme.primaryColor}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ThemePreview id={theme.id} colors={theme.previewColors} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                  {theme.name}
                </span>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.primaryColor }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemesPanel;
