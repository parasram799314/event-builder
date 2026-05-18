"use client";

import React, { useState } from 'react';
import styles from './SettingsPanel.module.css';
import GoogleMapPicker from './GoogleMapPicker';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface GlobalSettingsPanelProps {
  profiles: any[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: any) => void;
  onUpdateProfile: (id: string, newData: any) => void;
  onUpdateSection: (id: string, newData: any) => void;
  onClose: () => void;
  onSave?: () => void;
}

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onAddProfile,
  onUpdateProfile,
  onUpdateSection, 
  onClose 
}) => {
  const [view, setView] = useState<'DASHBOARD' | 'EDIT_PROFILE'>('DASHBOARD');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('HOME');

  const editingProfile = profiles.find(p => p.id === editingProfileId) || profiles[0];
  
  const getSectionData = (type: string) => editingProfile?.sections?.find((s: any) => s.type === type)?.data || {};
  const getSectionId = (type: string) => editingProfile?.sections?.find((s: any) => s.type === type)?.id;

  const handleUpdate = (type: string, newData: any) => {
    const id = getSectionId(type);
    if (id) onUpdateSection(id, newData);
  };

  const createNewProfile = () => {
    const id = `profile_${Date.now()}`;
    const newProfile = {
      id,
      name: `New Event Profile ${profiles.length + 1}`,
      isDefault: false,
      sections: JSON.parse(JSON.stringify(profiles[0].sections)) // Clone structure
    };
    onAddProfile(newProfile);
    setEditingProfileId(id);
    setView('EDIT_PROFILE');
  };

  const renderHomeSettings = () => {
    const data = getSectionData('HERO');
    const slide = data.slides?.[0] || {};
    const dt = data.dateTimeSettings || {};
    
    const triggerLogoUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleUpdate('HERO', { ...data, logo: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    return (
      <div className={styles.tabContent}>
        <div className={styles.section}>
          <label className={styles.label}>Profile Name</label>
          <input 
            type="text" className={styles.select} value={editingProfile.name} 
            onChange={(e) => onUpdateProfile(editingProfile.id, { name: e.target.value })}
          />
        </div>
        <div className={styles.section}>
          <label className={styles.label}>Website Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
            {data.logo ? (
              <img src={data.logo} alt="Logo" style={{ height: '40px', maxWidth: '120px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px', padding: '5px' }} />
            ) : (
              <div style={{ height: '40px', width: '100px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>
                NO LOGO
              </div>
            )}
            <button onClick={triggerLogoUpload} className={styles.tealLink}>Upload Logo</button>
            {data.logo && <button onClick={() => handleUpdate('HERO', { ...data, logo: null })} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Remove</button>}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Event Title</label>
          <input 
            type="text" className={styles.select} value={slide.title || ''} 
            onChange={(e) => {
              const newSlides = [...(data.slides || [{ id: 1 }])];
              newSlides[0] = { ...newSlides[0], title: e.target.value };
              handleUpdate('HERO', { ...data, slides: newSlides });
            }}
          />
        </div>
        <div className={styles.section}>
          <label className={styles.label}>Subtitle / Tagline</label>
          <textarea 
            className={styles.select} value={slide.subtitle || ''} 
            onChange={(e) => {
              const newSlides = [...(data.slides || [{ id: 1 }])];
              newSlides[0] = { ...newSlides[0], subtitle: e.target.value };
              handleUpdate('HERO', { ...data, slides: newSlides });
            }}
          />
        </div>
        <div className={styles.section}>
          <label className={styles.label}>Event Date & Time</label>
          <input 
            type="datetime-local" className={styles.select} value={dt.eventDate || ''} 
            onChange={(e) => handleUpdate('HERO', { ...data, dateTimeSettings: { ...dt, eventDate: e.target.value } })}
          />
        </div>
      </div>
    );
  };

  const renderWhyAttendSettings = () => {
    const data = getSectionData('WHY_ATTEND');
    const highlights = data.highlights || [
      { title: 'Networking', desc: 'Connect with industry leaders.' },
      { title: 'Learning', desc: 'Gain insights from experts.' },
      { title: 'Innovation', desc: 'Discover latest trends.' }
    ];

    const triggerWhyAttendImageUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleUpdate('WHY_ATTEND', { ...data, image: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    return (
      <div className={styles.tabContent}>
        <div className={styles.section}>
          <label className={styles.label}>Section Title</label>
          <input 
            type="text" className={styles.select} value={data.title || ''} 
            onChange={(e) => handleUpdate('WHY_ATTEND', { ...data, title: e.target.value })}
          />
        </div>
        <div className={styles.section}>
          <label className={styles.label}>Main Description</label>
          <textarea 
            className={styles.select} rows={4} value={data.description || ''} 
            onChange={(e) => handleUpdate('WHY_ATTEND', { ...data, description: e.target.value })}
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Section Image</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
            <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <img src={data.image || 'https://via.placeholder.com/300x200'} alt="Why Attend" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button onClick={triggerWhyAttendImageUpload} className={styles.tealLink}>Upload Image</button>
          </div>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>Key Highlights / Points</label>
            <button className={styles.tealLink} style={{ fontSize: '12px' }} onClick={() => {
              const newHighlights = [...highlights, { title: 'New Point', desc: 'Description here' }];
              handleUpdate('WHY_ATTEND', { ...data, highlights: newHighlights });
            }}>+ Add Point</button>
          </div>

          {highlights.map((item: any, i: number) => (
            <div key={i} style={{ padding: '15px', border: '1px solid #f1f5f9', borderRadius: '10px', marginBottom: '10px', background: '#fcfcfc' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" className={styles.select} style={{ marginBottom: 0, fontWeight: 700 }} placeholder="Point Title" value={item.title} 
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[i] = { ...newHighlights[i], title: e.target.value };
                    handleUpdate('WHY_ATTEND', { ...data, highlights: newHighlights });
                  }}
                />
                <button onClick={() => {
                  const newHighlights = highlights.filter((_: any, idx: number) => idx !== i);
                  handleUpdate('WHY_ATTEND', { ...data, highlights: newHighlights });
                }} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
              </div>
              <textarea 
                className={styles.select} style={{ marginBottom: 0, fontSize: '13px' }} rows={2} placeholder="Brief description..." value={item.desc} 
                onChange={(e) => {
                  const newHighlights = [...highlights];
                  newHighlights[i] = { ...newHighlights[i], desc: e.target.value };
                  handleUpdate('WHY_ATTEND', { ...data, highlights: newHighlights });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSpeakersSettings = () => {
    const data = getSectionData('SPEAKERS');
    const items = data.items || [];
    
    return (
      <div className={styles.tabContent}>
        <button className={styles.tealLink} style={{ marginBottom: '20px' }} onClick={() => {
           const newItems = [...items, { 
             name: 'New Speaker', 
             role: 'Role', 
             company: 'Company',
             bio: '',
             image: 'https://via.placeholder.com/400',
             socials: { linkedin: '', twitter: '' }
           }];
           handleUpdate('SPEAKERS', { ...data, items: newItems });
        }}>+ Add New Speaker</button>
        
        {items.map((sp: any, i: number) => {
          const triggerSpeakerImageUpload = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const newItems = [...items];
                  newItems[i] = { ...newItems[i], image: reader.result as string };
                  handleUpdate('SPEAKERS', { ...data, items: newItems });
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          };

          return (
            <div key={i} style={{ padding: '25px', border: '1px solid #eee', borderRadius: '15px', marginBottom: '25px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                 <span style={{ fontWeight: 800, color: '#1e293b' }}>Speaker #{i+1}</span>
                 <button onClick={() => {
                   const newItems = items.filter((_: any, idx: number) => idx !== i);
                   handleUpdate('SPEAKERS', { ...data, items: newItems });
                 }} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', 
                    border: '1px solid #e2e8f0', background: '#f8fafc', marginBottom: '10px' 
                  }}>
                    <img src={sp.image} alt="Speaker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button onClick={triggerSpeakerImageUpload} className={styles.tealLink} style={{ fontSize: '12px' }}>Change Photo</button>
                </div>

                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '12px' }}>Full Name</label>
                  <input 
                    type="text" className={styles.select} placeholder="e.g. Sarah Johnson" value={sp.name} 
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[i] = { ...newItems[i], name: e.target.value };
                      handleUpdate('SPEAKERS', { ...data, items: newItems });
                    }}
                  />
                  
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label className={styles.label} style={{ fontSize: '12px' }}>Role / Designation</label>
                      <input 
                        type="text" className={styles.select} placeholder="e.g. CEO" value={sp.role} 
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[i] = { ...newItems[i], role: e.target.value };
                          handleUpdate('SPEAKERS', { ...data, items: newItems });
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className={styles.label} style={{ fontSize: '12px' }}>Company</label>
                      <input 
                        type="text" className={styles.select} placeholder="e.g. TechFlow" value={sp.company || ''} 
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[i] = { ...newItems[i], company: e.target.value };
                          handleUpdate('SPEAKERS', { ...data, items: newItems });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className={styles.label} style={{ fontSize: '12px' }}>Biography</label>
                <textarea 
                  className={styles.select} rows={3} placeholder="Tell us about the speaker..." value={sp.bio || ''} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], bio: e.target.value };
                    handleUpdate('SPEAKERS', { ...data, items: newItems });
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '12px' }}>LinkedIn Profile</label>
                  <input 
                    type="text" className={styles.select} placeholder="https://linkedin.com/in/..." value={sp.socials?.linkedin || ''} 
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[i] = { ...newItems[i], socials: { ...sp.socials, linkedin: e.target.value } };
                      handleUpdate('SPEAKERS', { ...data, items: newItems });
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '12px' }}>Twitter (X)</label>
                  <input 
                    type="text" className={styles.select} placeholder="https://twitter.com/..." value={sp.socials?.twitter || ''} 
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[i] = { ...newItems[i], socials: { ...sp.socials, twitter: e.target.value } };
                      handleUpdate('SPEAKERS', { ...data, items: newItems });
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSessionsSettings = () => {
    const data = getSectionData('SESSIONS') || getSectionData('AGENDA');
    const items = data.items || [];
    
    return (
      <div className={styles.tabContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Schedule</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{items.length} sessions planned</p>
          </div>
          <button className={styles.tealLink} style={{ 
            background: '#f0fdfa', padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccfbf1'
          }} onClick={() => {
             const newItems = [...items, { time: '09:00 AM', title: 'New Session', desc: 'Brief description of the session', speaker: '', location: '' }];
             handleUpdate('SESSIONS', { ...data, items: newItems });
          }}>+ Add Session</button>
        </div>
        
        {items.map((item: any, i: number) => (
          <div key={i} style={{ 
            padding: '20px', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>Session #{i + 1}</span>
              <button onClick={() => {
                const newItems = items.filter((_: any, idx: number) => idx !== i);
                handleUpdate('SESSIONS', { ...data, items: newItems });
              }} style={{ 
                color: '#ef4444', border: 'none', background: '#fef2f2', 
                padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', 
                fontSize: '11px', fontWeight: 600 
              }}>Remove</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className={styles.label} style={{ fontSize: '11px' }}>Time</label>
                <input 
                  type="text" className={styles.select} placeholder="e.g. 09:00 AM" value={item.time} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], time: e.target.value };
                    handleUpdate('SESSIONS', { ...data, items: newItems });
                  }}
                />
              </div>
              <div>
                <label className={styles.label} style={{ fontSize: '11px' }}>Session Title</label>
                <input 
                  type="text" className={styles.select} placeholder="e.g. Opening Keynote" value={item.title} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], title: e.target.value };
                    handleUpdate('SESSIONS', { ...data, items: newItems });
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className={styles.label} style={{ fontSize: '11px' }}>Speaker (Optional)</label>
                <input 
                  type="text" className={styles.select} placeholder="Speaker Name" value={item.speaker || ''} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], speaker: e.target.value };
                    handleUpdate('SESSIONS', { ...data, items: newItems });
                  }}
                />
              </div>
              <div>
                <label className={styles.label} style={{ fontSize: '11px' }}>Location / Room</label>
                <input 
                  type="text" className={styles.select} placeholder="e.g. Main Hall" value={item.location || ''} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], location: e.target.value };
                    handleUpdate('SESSIONS', { ...data, items: newItems });
                  }}
                />
              </div>
            </div>

            <div>
              <label className={styles.label} style={{ fontSize: '11px' }}>Description</label>
              <textarea 
                className={styles.select} rows={2} placeholder="Brief summary of what this session covers..." value={item.desc || ''} 
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[i] = { ...newItems[i], desc: e.target.value };
                  handleUpdate('SESSIONS', { ...data, items: newItems });
                }}
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>No sessions added yet.</p>
            <button className={styles.tealLink} style={{ marginTop: '12px' }} onClick={() => {
               const newItems = [{ time: '09:00 AM', title: 'Opening Session', desc: '', speaker: '', location: '' }];
               handleUpdate('SESSIONS', { ...data, items: newItems });
            }}>Click to add your first session</button>
          </div>
        )}
      </div>
    );
  };

  const renderVenueSettings = () => {
    const data = getSectionData('VENUE');
    
    const triggerVenueImageUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleUpdate('VENUE', { ...data, image: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    return (
      <div className={styles.tabContent}>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Venue Information</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Provide details about where your event will take place.</p>
        </div>

        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
          <label className={styles.label} style={{ fontSize: '11px' }}>Venue Cover Image</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
            <div style={{ width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
              <img 
                src={data.image || 'https://via.placeholder.com/400x240?text=No+Image'} 
                alt="Venue" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div>
              <button onClick={triggerVenueImageUpload} className={styles.tealLink} style={{ display: 'block', marginBottom: '8px' }}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '8px' }}></i> Upload Venue Photo
              </button>
              <p style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '200px' }}>High-resolution photos of the exterior or main hall work best.</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label} style={{ fontSize: '11px' }}>Venue Name</label>
          <input 
            type="text" className={styles.select} placeholder="e.g. Grand Plaza Convention Center" value={data.name || ''} 
            onChange={(e) => handleUpdate('VENUE', { ...data, name: e.target.value })}
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label} style={{ fontSize: '11px' }}>Full Address & Map Location</label>
          <GoogleMapPicker 
            apiKey={GOOGLE_MAPS_API_KEY}
            address={data.address || ''}
            onLocationSelect={(address, lat, lng, imageUrl) => {
              const updatedData = { ...data, address, lat, lng };
              if (imageUrl) updatedData.image = imageUrl;
              handleUpdate('VENUE', updatedData);
            }}
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label} style={{ fontSize: '11px' }}>Location Description / Directions</label>
          <textarea 
            className={styles.select} rows={4} placeholder="Describe the venue or provide specific directions for attendees..." value={data.description || ''} 
            onChange={(e) => handleUpdate('VENUE', { ...data, description: e.target.value })}
          />
        </div>

        <div style={{ marginTop: '32px', padding: '20px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
          <i className="fa-solid fa-circle-info" style={{ color: '#0ea5e9', marginTop: '3px' }}></i>
          <p style={{ fontSize: '12px', color: '#0369a1', lineHeight: 1.5 }}>
            <strong>Pro Tip:</strong> Professional venues often include parking information and nearby public transport details in the description to help attendees.
          </p>
        </div>
      </div>
    );
  };

  const renderContactSettings = () => {
    const data = getSectionData('GET_IN_TOUCH');
    const socials = data.socials || {};

    const updateSocial = (key: string, value: string) => {
      handleUpdate('GET_IN_TOUCH', { ...data, socials: { ...socials, [key]: value } });
    };

    return (
      <div className={styles.tabContent}>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Contact Information</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Provide multiple ways for attendees to connect with you.</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <div className={styles.section}>
            <label className={styles.label} style={{ fontSize: '11px' }}>Support Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" className={styles.select} placeholder="e.g. support@event.com" value={data.email || ''} 
                onChange={(e) => handleUpdate('GET_IN_TOUCH', { ...data, email: e.target.value })}
                style={{ paddingLeft: '40px' }}
              />
              <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
            </div>
          </div>

          <div className={styles.section} style={{ marginBottom: 0 }}>
            <label className={styles.label} style={{ fontSize: '11px' }}>Support Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" className={styles.select} placeholder="e.g. +1 (555) 000-0000" value={data.phone || ''} 
                onChange={(e) => handleUpdate('GET_IN_TOUCH', { ...data, phone: e.target.value })}
                style={{ paddingLeft: '40px' }}
              />
              <i className="fa-solid fa-phone" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Social Media Profiles</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Connect your event to social platforms.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className={styles.section}>
            <label className={styles.label} style={{ fontSize: '11px' }}>LinkedIn</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" className={styles.select} placeholder="LinkedIn URL" value={socials.linkedin || ''} 
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <i className="fa-brands fa-linkedin" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#0077b5' }}></i>
            </div>
          </div>
          <div className={styles.section}>
            <label className={styles.label} style={{ fontSize: '11px' }}>Twitter (X)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" className={styles.select} placeholder="Twitter URL" value={socials.twitter || ''} 
                onChange={(e) => updateSocial('twitter', e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <i className="fa-brands fa-x-twitter" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#000' }}></i>
            </div>
          </div>
          <div className={styles.section}>
            <label className={styles.label} style={{ fontSize: '11px' }}>Facebook</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" className={styles.select} placeholder="Facebook URL" value={socials.facebook || ''} 
                onChange={(e) => updateSocial('facebook', e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <i className="fa-brands fa-facebook" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#1877f2' }}></i>
            </div>
          </div>
          <div className={styles.section}>
            <label className={styles.label} style={{ fontSize: '11px' }}>Instagram</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" className={styles.select} placeholder="Instagram URL" value={socials.instagram || ''} 
                onChange={(e) => updateSocial('instagram', e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <i className="fa-brands fa-instagram" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#e4405f' }}></i>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
           <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
             Social links will appear as icons in your website's footer and contact sections.
           </p>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'HOME', label: 'Home' },
    { id: 'WHY_ATTEND', label: 'Why Attend' },
    { id: 'SPEAKERS', label: 'Speakers' },
    { id: 'SESSIONS', label: 'Sessions' },
    { id: 'VENUE', label: 'Venue' },
    { id: 'CONTACT', label: 'Contact' }
  ];

  if (view === 'DASHBOARD') {
    return (
      <div style={{ flex: 1, height: '100%', background: '#ffffff', padding: '60px 80px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>Event Profiles</h1>
              <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Manage and switch between different event configurations.</p>
            </div>
            <button onClick={createNewProfile} style={{ 
              background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', 
              borderRadius: '10px', fontWeight: 600, cursor: 'pointer', 
              fontSize: '14px', transition: 'all 0.2s'
            }}>
              + New Profile
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
            {profiles.map(profile => (
              <div 
                key={profile.id} 
                style={{ 
                  background: '#fff', padding: '32px', borderRadius: '20px', border: activeProfileId === profile.id ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  boxShadow: activeProfileId === profile.id ? '0 10px 25px -5px rgba(37, 99, 235, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  position: 'relative', transition: 'all 0.2s ease'
                }}
              >
                {activeProfileId === profile.id && (
                  <div style={{ position: 'absolute', top: '24px', right: '24px', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active
                  </div>
                )}
                <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '20px', color: '#64748b', border: '1px solid #e2e8f0' }}>
                   <i className="fa-solid fa-folder-open"></i>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>{profile.name}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>Configuration for speakers, schedule, and event details.</p>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                       setEditingProfileId(profile.id);
                       onSelectProfile(profile.id);
                       setView('EDIT_PROFILE');
                    }}
                    style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: '#334155', fontSize: '13px' }}
                  >
                    Edit Data
                  </button>
                  {activeProfileId !== profile.id && (
                    <button 
                      onClick={() => onSelectProfile(profile.id)}
                      style={{ flex: 1, background: '#1e293b', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '60px', borderTop: '1px solid #f1f5f9', paddingTop: '30px' }}>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <i className="fa-solid fa-arrow-left"></i> Exit Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      height: '100%', 
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ background: '#fff', padding: '20px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <button onClick={() => setView('DASHBOARD')} style={{ border: '1px solid #e2e8f0', background: '#fff', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <i className="fa-solid fa-chevron-left"></i>
           </button>
           <div>
             <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profile Editor</span>
             <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{editingProfile.name}</h3>
           </div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>&times;</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar for Editing Tabs */}
        <div style={{ width: '240px', background: '#fff', borderRight: '1px solid #f1f5f9', padding: '30px 15px' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                width: '100%', padding: '12px 18px', border: 'none', background: activeTab === tab.id ? '#f8fafc' : 'transparent', 
                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '14px', marginBottom: '4px', transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Center Content Area */}
        <div style={{ flex: 1, padding: '50px 80px', overflowY: 'auto', background: '#fff' }}>
          <div style={{ maxWidth: '700px' }}>
             <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '32px' }}>{tabs.find(t => t.id === activeTab)?.label} Details</h2>
             {activeTab === 'HOME' && renderHomeSettings()}
             {activeTab === 'WHY_ATTEND' && renderWhyAttendSettings()}
             {activeTab === 'SPEAKERS' && renderSpeakersSettings()}
             {activeTab === 'SESSIONS' && renderSessionsSettings()}
             {activeTab === 'VENUE' && renderVenueSettings()}
             {activeTab === 'CONTACT' && renderContactSettings()}
             
             <div style={{ marginTop: '50px', padding: '32px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>All modifications are synchronized to your event profile.</p>
                <button 
                  onClick={() => {
                    onSave?.();
                    setView('DASHBOARD');
                  }} 
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                >
                  Save & Sync with Database
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsPanel;


