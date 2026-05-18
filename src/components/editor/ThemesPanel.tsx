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
}

const ThemePreview = ({ id, colors }: { id: string, colors: string[] }) => {
  if (id === 'theme-one') {
    return (
      <div style={{ height: '80px', width: '100%', background: '#101010', borderRadius: '6px', position: 'relative', overflow: 'hidden', padding: '10px' }}>
        <div style={{ height: '4px', width: '30px', background: colors[0], marginBottom: '8px' }} />
        <div style={{ height: '10px', width: '80%', background: '#fff', opacity: 0.9, marginBottom: '4px' }} />
        <div style={{ height: '6px', width: '60%', background: '#fff', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', height: '12px', width: '30px', background: colors[0], borderRadius: '2px' }} />
      </div>
    );
  }
  if (id === 'theme-two') {
    return (
      <div style={{ height: '80px', width: '100%', background: '#fff', borderRadius: '6px', position: 'relative', overflow: 'hidden', border: '1px solid #eee' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: colors[0], opacity: 0.1 }} />
        <div style={{ padding: '15px 10px' }}>
           <div style={{ height: '2px', width: '15px', background: colors[0], marginBottom: '8px' }} />
           <div style={{ height: '12px', width: '50%', background: '#0f172a', marginBottom: '4px' }} />
           <div style={{ height: '12px', width: '40%', background: '#0f172a', marginBottom: '8px' }} />
           <div style={{ height: '15px', width: '35px', background: '#0f172a', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }
  // Default Barfi
  return (
    <div style={{ height: '80px', width: '100%', background: '#fff', borderRadius: '6px', position: 'relative', overflow: 'hidden', border: '1px solid #eee' }}>
      <div style={{ height: '12px', width: '100%', background: '#f0bf4c' }} />
      <div style={{ padding: '10px', display: 'flex', gap: '8px' }}>
         <div style={{ height: '40px', width: '40px', background: '#f1f5f9', borderRadius: '4px' }} />
         <div style={{ flex: 1 }}>
            <div style={{ height: '8px', width: '100%', background: '#e2e8f0', marginBottom: '4px' }} />
            <div style={{ height: '8px', width: '70%', background: '#e2e8f0' }} />
         </div>
      </div>
    </div>
  );
};

const ThemesPanel: React.FC<ThemesPanelProps> = ({ onSelectTheme, onClose }) => {
  return (
    <div className={styles.panel} style={{ 
      position: 'relative', 
      right: 0, 
      height: '100%', 
      overflowY: 'auto', 
      borderRight: '1px solid #e2e8f0', 
      width: '320px', 
      backgroundColor: '#ffffff',
      boxShadow: 'none'
    }}>
      <div className={styles.header} style={{ padding: '24px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>Themes</h3>
        <button onClick={onClose} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
      </div>
      
      <div style={{ padding: '20px' }}>
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
