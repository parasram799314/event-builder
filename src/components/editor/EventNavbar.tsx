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
    fontFamily?: string;
    primaryColor?: string;
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
  const [menuOpen, setMenuOpen] = React.useState(false);

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
      className={`${styles.navbar} ${menuOpen ? styles.navbarOpen : ''}`} 
      style={{ 
        backgroundColor: themeConfig?.navbarColor || '#ffffff',
        color: themeConfig?.navbarTextColor || '#1e293b',
        borderColor: themeConfig?.navbarColor === '#ffffff' ? '#e2e8f0' : 'transparent',
        fontFamily: themeConfig?.fontFamily || 'inherit',
        '--primary': themeConfig?.primaryColor || '#ff5722',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
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

      <button 
        className={styles.hamburger} 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ color: themeConfig?.navbarTextColor || '#1e293b', display: menuOpen ? 'block' : undefined }}
      >
        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <div className={`${styles.center} ${menuOpen ? styles.menuOpen : ''}`}>
        <ul className={styles.navList}>
          {displayLinks.map((link) => {
            const getIcon = (name: string) => {
              switch(name) {
                case 'HOME': return 'fa-house';
                case 'AGENDA': return 'fa-calendar-days';
                case 'SPEAKERS': return 'fa-users';
                case 'DISCUSSIONS': return 'fa-comments';
                case 'TICKETS': return 'fa-ticket';
                case 'SPONSORS': return 'fa-handshake';
                case 'VENUE': return 'fa-location-dot';
                case 'EXHIBITORS': return 'fa-store';
                case 'GALLERY': return 'fa-image';
                case 'SIGN IN': return 'fa-right-to-bracket';
                default: return 'fa-circle-dot';
              }
            };

            return (
              <li 
                key={link} 
                className={`${styles.navItem} ${activeTab === link ? styles.active : ''} ${link === 'HOME' ? styles.homePill : ''}`}
                onClick={() => {
                  onTabChange(link);
                  setMenuOpen(false);
                  
                  // Redirection logic for sections
                  const sectionId = link.toLowerCase().replace(/\s+/g, '-');
                  const element = document.getElementById(sectionId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else if (link === 'HOME') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                style={{ 
                  color: activeTab === link ? '#000' : (themeConfig?.navbarTextColor || '#1e293b'),
                  backgroundColor: activeTab === link && link === 'HOME' ? (themeConfig?.navbarTextColor || '#1e293b') : 'transparent'
                }}
              >
                <i className={`fas ${getIcon(link)} ${styles.mobileIcon}`}></i>
                <span 
                  contentEditable={!isReadOnly} 
                  suppressContentEditableWarning
                  style={{ color: activeTab === link && link === 'HOME' ? (themeConfig?.navbarColor || '#ffffff') : 'inherit' }}
                >
                  {link.replace(/_/g, ' ')}
                </span>
                {(link === "EXHIBITORS" || link === "AGENDA") && <span className={styles.dropdownArrow}>▼</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default EventNavbar;
