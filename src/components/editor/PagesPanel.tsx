"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './SettingsPanel.module.css';

interface PagesPanelProps {
  profiles: any[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: any) => void;
  onDeleteProfile: (id: string) => void;
  onUpdateProfile: (id: string, newData: any) => void;
  onClose: () => void;
}

const PagesPanel: React.FC<PagesPanelProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onDeleteProfile,
  onUpdateProfile,
  onClose
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddPage = () => {
    if (!newPageName.trim()) return;
    const id = `page_${Date.now()}`;
    const newProfile = {
      id,
      name: newPageName,
      isDefault: false,
      isVisible: true,
      sections: []
    };
    onAddProfile(newProfile);
    setNewPageName('');
    setIsAdding(false);
    onSelectProfile(id);
  };

  const startEditing = (profile: any) => {
    setEditingId(profile.id);
    setEditName(profile.name);
    setMenuOpenId(null);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateProfile(editingId, { name: editName });
    }
    setEditingId(null);
  };

  const toggleVisibility = (profile: any) => {
    onUpdateProfile(profile.id, { isVisible: !profile.isVisible });
    setMenuOpenId(null);
  };

  return (
    <div className={styles.panel} style={{ 
      position: 'relative', right: 0, height: '100%', width: '320px', 
      borderRight: '1px solid #e2e8f0', backgroundColor: '#ffffff', // White BG
      boxShadow: 'none', display: 'flex', flexDirection: 'column', color: '#333'
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #eee', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
            Pages ({profiles.length})
          </h3>
          <button onClick={onClose} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>
      </div>

      <div style={{ padding: '15px 20px' }}>
        {/* Purple Add Page Button */}
        <button 
          onClick={() => setIsAdding(true)}
          style={{ 
            width: '100%', padding: '12px', background: '#3d35c8', color: '#fff', 
            border: 'none', borderRadius: '25px', fontWeight: '600', fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: 8, transition: 'background 0.2s'
          }}
        >
          <i className="fa-solid fa-plus"></i> Add Page
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 20px 10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              style={{ 
                padding: '12px 15px', borderBottom: '1px solid #f1f1f1',
                background: activeProfileId === profile.id ? '#f5f4ff' : '#f8f9fa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                position: 'relative', transition: 'all 0.2s', borderRadius: '8px',
                marginBottom: '4px'
              }}
              onClick={() => onSelectProfile(profile.id)}
            >
              {/* Name / Input */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === profile.id ? (
                  <input 
                    autoFocus value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={e => {
                      if(e.key === 'Enter') saveEdit();
                      if(e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={e => e.stopPropagation()}
                    style={{ background: '#fff', border: '1px solid #3d35c8', color: '#333', fontSize: '14px', width: '100%', outline: 'none', borderRadius: '4px', padding: '4px 8px' }}
                  />
                ) : (
                  <span style={{ 
                    fontSize: '14px', fontWeight: 500, color: profile.isVisible === false ? '#aaa' : '#333',
                  }}>
                    {profile.name}
                  </span>
                )}
              </div>

              {/* Status & Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {profile.isVisible === false && (
                   <i className="fa-solid fa-eye-slash" style={{ color: '#aaa', fontSize: '12px' }}></i>
                )}
                
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === profile.id ? null : profile.id); }}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '5px' }}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
              </div>

              {/* Action Menu Dropdown */}
              {menuOpenId === profile.id && (
                <div ref={menuRef} style={{ 
                  position: 'absolute', top: '35px', right: '10px', background: '#fff', 
                  border: '1px solid #eee', borderRadius: '8px', zIndex: 100, width: '160px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden'
                }}>
                  <button onClick={(e) => { e.stopPropagation(); startEditing(profile); }} style={menuItemStyle}>
                    <i className="fa-solid fa-pencil" style={{ width: '15px' }}></i> Rename
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleVisibility(profile); }} style={menuItemStyle}>
                    <i className={`fa-solid ${profile.isVisible === false ? 'fa-eye' : 'fa-eye-slash'}`} style={{ width: '15px' }}></i> 
                    {profile.isVisible === false ? 'Show page' : 'Hide page'}
                  </button>
                  {!profile.isDefault && (
                    <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete this page?')) onDeleteProfile(profile.id); }} style={{ ...menuItemStyle, color: '#ef4444' }}>
                      <i className="fa-solid fa-trash" style={{ width: '15px' }}></i> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Page Modal */}
      {isAdding && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }} onClick={() => setIsAdding(false)}>
          <div style={{ 
            background: '#fff', padding: '25px', borderRadius: '12px', 
            width: '350px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Add New Page</h3>
            <input 
              autoFocus placeholder="Enter page name..."
              value={newPageName} onChange={e => setNewPageName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPage()}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', fontSize: '14px', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsAdding(false)} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleAddPage} style={{ padding: '8px 16px', background: '#3d35c8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const menuItemStyle: React.CSSProperties = {
  width: '100%', padding: '10px 15px', background: 'none', border: 'none', 
  color: '#444', fontSize: '13px', textAlign: 'left',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
  transition: 'background 0.2s'
};

export default PagesPanel;
