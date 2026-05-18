"use client";

import React from 'react';
import styles from './EventNavbar.module.css';

interface EventNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  links?: string[];
  isReadOnly?: boolean;
  themeConfig?: {
    navbarColor: string;
    navbarTextColor: string;
  };
}

const EventNavbar: React.FC<EventNavbarProps> = ({ 
  activeTab, 
  onTabChange, 
  links = ["HOME", "AGENDA", "SPEAKERS", "DISCUSSIONS", "TICKETS", "SPONSORS", "VENUE", "EXHIBITORS", "GALLERY", "SIGN IN"],
  isReadOnly = false,
  themeConfig
}) => {
  // Always include HOME at the start and ensure links are unique
  const displayLinks = links.includes("HOME") ? links : ["HOME", ...links];

  const [logo, setLogo] = React.useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogo(url);
    }
  };

  const triggerLogoInput = () => {
    if (isReadOnly) return;
    document.getElementById('logo-upload-input')?.click();
  };

  return (
    <nav 
      className={styles.navbar} 
      style={{ 
        backgroundColor: themeConfig?.navbarColor || '#ffffff',
        color: themeConfig?.navbarTextColor || '#1e293b',
        borderColor: themeConfig?.navbarColor === '#ffffff' ? '#e2e8f0' : 'transparent',
        fontFamily: themeConfig?.fontFamily || 'inherit',
        '--primary': themeConfig?.primaryColor || '#ff5722'
      } as any}
    >
      <div className={styles.left}>
        <input 
          type="file" 
          id="logo-upload-input" 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleLogoUpload}
        />
        {logo ? (
          <div className={styles.logoContainer} onClick={triggerLogoInput} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
            <img src={logo} alt="Event Logo" className={styles.logoImage} />
          </div>
        ) : !isReadOnly ? (
          <button 
            className={styles.logoBtn} 
            onClick={triggerLogoInput}
            style={{ 
              color: themeConfig?.navbarTextColor || '#1e293b',
              borderColor: themeConfig?.navbarTextColor || '#1e293b'
            }}
          >
            UPLOAD LOGO
          </button>
        ) : null}
      </div>

      <div className={styles.center}>
        <ul className={styles.navList}>
          {displayLinks.map((link) => (
            <li 
              key={link} 
              className={`${styles.navItem} ${activeTab === link ? styles.active : ''} ${link === 'HOME' ? styles.homePill : ''}`}
              onClick={() => onTabChange(link)}
              style={{ 
                color: activeTab === link ? '#000' : (themeConfig?.navbarTextColor || '#1e293b'),
                backgroundColor: activeTab === link && link === 'HOME' ? (themeConfig?.navbarTextColor || '#1e293b') : 'transparent'
              }}
            >
              <span 
                contentEditable={!isReadOnly} 
                suppressContentEditableWarning
                style={{ color: activeTab === link && link === 'HOME' ? (themeConfig?.navbarColor || '#ffffff') : 'inherit' }}
              >
                {link.replace(/_/g, ' ')}
              </span>
              {(link === "EXHIBITORS" || link === "AGENDA") && <span className={styles.dropdownArrow}>▼</span>}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default EventNavbar;
