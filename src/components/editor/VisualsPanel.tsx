"use client";

import React from 'react';
import styles from './SettingsPanel.module.css';

interface VisualsPanelProps {
  themeConfig: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    navbarColor: string;
    navbarTextColor: string;
    fontFamily?: string;
  };
  updateThemeConfig: (newConfig: any) => void;
  onClose: () => void;
  variant?: 'sidebar' | 'bottom';
}

const VisualsPanel: React.FC<VisualsPanelProps> = ({ themeConfig, updateThemeConfig, onClose, variant = 'sidebar' }) => {
  
  const handlePrimaryChange = (color: string) => {
    updateThemeConfig({
      ...themeConfig,
      primaryColor: color,
    });
  };

  const handleChange = (key: string, value: string) => {
    updateThemeConfig({ ...themeConfig, [key]: value });
  };

  const fonts = [
    { name: 'Default (Sans)', value: 'var(--font-inter), ui-sans-serif, system-ui' },
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Montserrat', value: "'Montserrat', sans-serif" },
    { name: 'Open Sans', value: "'Open Sans', sans-serif" },
    { name: 'Lato', value: "'Lato', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Oswald', value: "'Oswald', sans-serif" },
    { name: 'Raleway', value: "'Raleway', sans-serif" },
    { name: 'Nunito', value: "'Nunito', sans-serif" },
    { name: 'Ubuntu', value: "'Ubuntu', sans-serif" },
    { name: 'Lora', value: "'Lora', serif" },
    { name: 'Merriweather', value: "'Merriweather', serif" },
    { name: 'PT Serif', value: "'PT Serif', serif" },
    { name: 'Bebas Neue', value: "'Bebas Neue', cursive" },
    { name: 'Dancing Script', value: "'Dancing Script', cursive" },
    { name: 'Pacifico', value: "'Pacifico', cursive" },
    { name: 'Caveat', value: "'Caveat', cursive" },
    { name: 'Josefin Sans', value: "'Josefin Sans', sans-serif" },
    { name: 'Arimo', value: "'Arimo', sans-serif" },
    { name: 'Bitter', value: "'Bitter', serif" },
    { name: 'Anton', value: "'Anton', sans-serif" },
    { name: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
    { name: 'Fjalla One', value: "'Fjalla One', sans-serif" },
    { name: 'Quicksand', value: "'Quicksand', sans-serif" },
    { name: 'Hind', value: "'Hind', sans-serif" },
    { name: 'Titillium Web', value: "'Titillium Web', sans-serif" },
    { name: 'Muli', value: "'Muli', sans-serif" },
    { name: 'Noto Sans', value: "'Noto Sans', sans-serif" },
    { name: 'Rubik', value: "'Rubik', sans-serif" },
    { name: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
    { name: 'Karla', value: "'Karla', sans-serif" },
    { name: 'Inconsolata', value: "'Inconsolata', monospace" },
    { name: 'Crimson Text', value: "'Crimson Text', serif" },
    { name: 'Work Sans', value: "'Work Sans', sans-serif" },
    { name: 'Abel', value: "'Abel', sans-serif" },
    { name: 'Zilla Slab', value: "'Zilla Slab', serif" },
    { name: 'Comfortaa', value: "'Comfortaa', cursive" },
    { name: 'Dosis', value: "'Dosis', sans-serif" },
    { name: 'Cabin', value: "'Cabin', sans-serif" },
    { name: 'Archivo', value: "'Archivo', sans-serif" },
    { name: 'Josefin Slab', value: "'Josefin Slab', serif" },
    { name: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
    { name: 'Syne', value: "'Syne', sans-serif" },
    { name: 'Outfit', value: "'Outfit', sans-serif" },
    { name: 'Manrope', value: "'Manrope', sans-serif" },
    { name: 'Lexend', value: "'Lexend', sans-serif" },
  ];

  const presets = [
    { name: 'Elegant Gold', primary: '#f0bf4c', bg: '#ffffff', text: '#1e293b', nav: '#f0bf4c', navText: '#000000' },
    { name: 'Professional Blue', primary: '#2563eb', bg: '#ffffff', text: '#1e293b', nav: '#f8fafc', navText: '#1e293b' },
    { name: 'Modern Dark', primary: '#3b82f6', bg: '#0f172a', text: '#f8fafc', nav: '#0f172a', navText: '#ffffff' },
    { name: 'Sunset Rose', primary: '#f2545f', bg: '#ffffff', text: '#222222', nav: '#101010', navText: '#ffffff' },
    { name: 'Eco Green', primary: '#10b981', bg: '#f9fafb', text: '#064e3b', nav: '#ffffff', navText: '#064e3b' },
    { name: 'Royal Purple', primary: '#8b5cf6', bg: '#ffffff', text: '#1e1b4b', nav: '#1e1b4b', navText: '#ffffff' },
  ];

  const content = (
    <div className={styles.content}>
      {/* Font Selection Section */}
      <div className={styles.section}>
        <label className={styles.label}>Global Typography</label>
        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>Select a font that reflects your brand's personality.</p>
        <select 
          value={themeConfig.fontFamily || ''} 
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {fonts.map(font => (
            <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <label className={styles.label}>Theme Presets</label>
        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>Choose a professionally curated color palette.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {presets.map(preset => (
            <button 
              key={preset.name}
              onClick={() => updateThemeConfig({
                ...themeConfig,
                primaryColor: preset.primary,
                backgroundColor: preset.bg,
                textColor: preset.text,
                navbarColor: preset.nav,
                navbarTextColor: preset.navText
              })}
              style={{
                padding: '12px 8px',
                borderRadius: '10px',
                border: themeConfig.primaryColor === preset.primary ? `2px solid ${preset.primary}` : '1px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: preset.primary }}></div>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: preset.bg, border: '1px solid #eee' }}></div>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: preset.nav }}></div>
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b' }}>{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <label className={styles.label}>Primary Brand Color</label>
        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>This color defines your buttons, icons, and active states.</p>
        <div className={styles.colorInputGroup} style={{ borderLeft: `4px solid ${themeConfig.primaryColor}` }}>
          <input 
            type="color" 
            value={themeConfig.primaryColor} 
            onChange={(e) => handlePrimaryChange(e.target.value)}
            className={styles.colorPicker}
          />
          <input 
            type="text" 
            value={themeConfig.primaryColor} 
            onChange={(e) => handlePrimaryChange(e.target.value)}
            className={styles.colorText}
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Surface & Text</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className={styles.colorInputGroup} style={{ padding: '6px 10px' }}>
            <input 
              type="color" 
              value={themeConfig.backgroundColor} 
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className={styles.colorPicker}
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>BG</span>
          </div>
          <div className={styles.colorInputGroup} style={{ padding: '6px 10px' }}>
            <input 
              type="color" 
              value={themeConfig.textColor} 
              onChange={(e) => handleChange('textColor', e.target.value)}
              className={styles.colorPicker}
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>TEXT</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Navigation Style</label>
        <div className={styles.colorInputGroup} style={{ marginBottom: '10px' }}>
          <input 
            type="color" 
            value={themeConfig.navbarColor} 
            onChange={(e) => handleChange('navbarColor', e.target.value)}
            className={styles.colorPicker}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>NAV BACKGROUND</div>
            <input 
              type="text" 
              value={themeConfig.navbarColor} 
              onChange={(e) => handleChange('navbarColor', e.target.value)}
              className={styles.colorText}
              style={{ fontSize: '12px' }}
            />
          </div>
        </div>
        <div className={styles.colorInputGroup}>
          <input 
            type="color" 
            value={themeConfig.navbarTextColor} 
            onChange={(e) => handleChange('navbarTextColor', e.target.value)}
            className={styles.colorPicker}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>NAV TEXT</div>
            <input 
              type="text" 
              value={themeConfig.navbarTextColor} 
              onChange={(e) => handleChange('navbarTextColor', e.target.value)}
              className={styles.colorText}
              style={{ fontSize: '12px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === 'bottom') {
    return (
      <div style={{ padding: '0 0 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Visual Identity</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: '#64748b', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 20px' }}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.panel} ${styles.open}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Visual Identity</h3>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>
      {content}
    </div>
  );
};

export default VisualsPanel;
