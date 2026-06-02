import React from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  profiles?: any[];
  data?: {
    description: string;
    copyright: string;
    eventName?: string;
    logo?: string;
  };
  updateData?: (newData: any) => void;
  isReadOnly?: boolean;
  themeConfig?: any;
}

const Footer: React.FC<FooterProps> = ({ profiles = [], data, updateData, isReadOnly = true, themeConfig }) => {
  const footerData = data || {
    description: 'Crafting exceptional digital experiences for world-class events and conferences.',
    copyright: '© 2026 EVENTBUILDER INC. ALL RIGHTS RESERVED.',
    eventName: 'EventBuilder',
    logo: ''
  };

  const colors = {
    primary: themeConfig?.primaryColor || '#2563eb',
    background: themeConfig?.backgroundColor || '#f8fafc',
    text: themeConfig?.textColor || '#0f172a',
    textMuted: themeConfig?.textColor === '#ffffff' ? '#94a3b8' : '#64748b'
  };

  const triggerLogoUpload = () => {
    if (isReadOnly) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => updateData?.({ ...footerData, logo: reader.result as string });
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <footer style={{ 
      padding: '30px 0', 
      background: colors.background === '#ffffff' ? '#f8fafc' : colors.background, 
      borderTop: '1px solid rgba(0,0,0,0.05)',
      textAlign: 'center',
      color: colors.text,
      fontFamily: themeConfig?.fontFamily || 'inherit'
    }}>
      <div className={styles.container}>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <div 
            style={{ cursor: isReadOnly ? 'default' : 'pointer', position: 'relative' }}
            onClick={triggerLogoUpload}
          >
            {footerData.logo ? (
              <img src={footerData.logo} alt="Logo" style={{ height: '32px', maxWidth: '120px', objectFit: 'contain' }} />
            ) : (
              <span 
                style={{ fontSize: '18px', fontWeight: 800, color: colors.text, letterSpacing: '-0.5px', outline: 'none' }}
                contentEditable={!isReadOnly}
                suppressContentEditableWarning
                onBlur={(e: any) => {
                  e.stopPropagation();
                  updateData?.({ ...footerData, eventName: e.target.innerText });
                }}
                onClick={(e) => !isReadOnly && e.stopPropagation()}
              >
                {footerData.eventName || 'EventBuilder'}
              </span>
            )}
            {!isReadOnly && (
              <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', background: colors.primary, color: '#fff', padding: '1px 3px', borderRadius: '2px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                {footerData.logo ? 'CHANGE LOGO' : 'UPLOAD LOGO'}
              </div>
            )}
          </div>
        </div>

        <p 
          style={{ color: colors.textMuted, fontSize: '14px', marginBottom: '16px', maxWidth: '600px', margin: '0 auto 16px', outline: 'none', lineHeight: 1.4 }}
          contentEditable={!isReadOnly}
          suppressContentEditableWarning
          onBlur={(e: any) => updateData?.({ ...footerData, description: e.target.innerText })}
        >
          {footerData.description}
        </p>


        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {profiles.filter(p => p.isVisible !== false).map((profile) => (
            <a 
              key={profile.id} 
              href="#" 
              style={{ color: '#1e293b', fontSize: '12px', fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase' }}
            >
              {profile.name}
            </a>
          ))}
          {profiles.length === 0 && (
            <>
              <a href="#" style={{ color: '#1e293b', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#1e293b', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: '#1e293b', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Contact Support</a>
            </>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
          <p 
            style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.05em', outline: 'none' }}
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) => updateData?.({ ...footerData, copyright: e.target.innerText })}
          >
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
