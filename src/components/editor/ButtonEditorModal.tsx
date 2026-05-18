"use client";

import React, { useState, useEffect } from 'react';
import styles from './SettingsPanel.module.css'; // Reusing some modal styles

interface ButtonEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonData: {
    label: string;
    link: string;
  };
  onSave: (label: string, link: string) => void;
}

const ButtonEditorModal: React.FC<ButtonEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  buttonData,
  onSave 
}) => {
  const [label, setLabel] = useState(buttonData.label);
  const [link, setLink] = useState(buttonData.link);

  useEffect(() => {
    setLabel(buttonData.label);
    setLink(buttonData.link);
  }, [buttonData]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Edit Button</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.content} style={{ padding: '20px' }}>
          <div className={styles.section} style={{ marginBottom: '20px' }}>
            <label className={styles.label} style={{ display: 'block', marginBottom: '8px' }}>Button Label</label>
            <input 
              type="text" 
              className={styles.select} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. REGISTER NOW"
            />
          </div>
          
          <div className={styles.section}>
            <label className={styles.label} style={{ display: 'block', marginBottom: '8px' }}>External Link (URL)</label>
            <input 
              type="text" 
              className={styles.select} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. https://example.com"
            />
          </div>
        </div>
        
        <div className={styles.footer} style={{ padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            className={styles.tealLink} 
            style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.blueLink} 
            style={{ padding: '8px 16px', background: '#4361ee', color: 'white', border: 'none', borderRadius: '6px' }}
            onClick={() => onSave(label, link)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonEditorModal;
