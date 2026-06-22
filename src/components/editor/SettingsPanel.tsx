"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './SettingsPanel.module.css';
import GoogleMapPicker from './GoogleMapPicker';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export type SettingsMode = 'HERO' | 'BUTTON' | 'SECTION' | 'VENUE' | 'SPEAKER' | 'SPONSOR' | 'TEXT' | 'AGENDA' | 'MEDIA_TEXT' | 'COUNTER' | 'TESTIMONIALS' | 'COUNTDOWN' | 'WIDGET' | 'CUSTOM_HTML' | 'FLOOR_PLAN' | 'SPONSOR_CAT' | 'MEDIA_GROUP' | 'MOVING_LINE' | 'NONE';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: SettingsMode;
  data: any;
  updateData: (newData: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  mode,
  data,
  updateData
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ ...data, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMovingLineSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Manage Marquee Items</label>
        {data.items?.map((item: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '15px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <select 
                value={item.type || 'text'} 
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].type = e.target.value;
                  updateData({ ...data, items: newItems });
                }}
                style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}
              >
                <option value="text">Text</option>
                <option value="image">Image (Logo)</option>
              </select>
              <button className={styles.deleteIcon} onClick={() => {
                const newItems = data.items.filter((_: any, i: number) => i !== idx);
                updateData({ ...data, items: newItems });
              }}><i className="fas fa-trash"></i></button>
            </div>
            
            {item.type === 'image' ? (
              <div 
                className={styles.imageUploadBox}
                style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#fff' }}
                onClick={() => document.getElementById(`marquee-item-img-${idx}`)?.click()}
              >
                <input 
                  type="file" id={`marquee-item-img-${idx}`} style={{ display: 'none' }} accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newItems = [...data.items];
                        newItems[idx].content = reader.result as string;
                        updateData({ ...data, items: newItems });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
                {item.content ? <img src={item.content} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '11px', color: '#94a3b8' }}>Upload Logo</span>}
              </div>
            ) : (
              <input 
                className={styles.select} 
                style={{ marginBottom: 0 }}
                placeholder="Enter text..." 
                value={item.content || ''} 
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].content = e.target.value;
                  updateData({ ...data, items: newItems });
                }} 
              />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { type: 'text', content: 'New Text' }] })}>+ Add Text</button>
          <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { type: 'image', content: '' }] })}>+ Add Logo</button>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Item Gap (Pixels)</label>
        <input 
          type="range" min="10" max="200" step="10"
          value={data.gap || 60} 
          onChange={(e) => updateData({ ...data, gap: parseInt(e.target.value) })} 
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
          <span>10px</span><span>{data.gap || 60}px</span><span>200px</span>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Scroll Speed (Seconds)</label>
        <input 
          type="range" min="5" max="100" step="5"
          value={data.speed || 30} 
          onChange={(e) => updateData({ ...data, speed: parseInt(e.target.value) })} 
          style={{ width: '100%' }}
        />
      </div>

      <div className={styles.section} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className={styles.label} style={{ marginBottom: 0 }}>Grayscale Logos</label>
        <button 
          style={{ 
            width: '40px', height: '22px', borderRadius: '20px', position: 'relative', cursor: 'pointer', border: 'none',
            background: data.grayscaleImages !== false ? '#2563eb' : '#cbd5e1', transition: '0.3s'
          }}
          onClick={() => updateData({ ...data, grayscaleImages: data.grayscaleImages === false })}
        >
          <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: data.grayscaleImages !== false ? '21px' : '3px', transition: '0.3s' }}></div>
        </button>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Background Color</label>
        <input type="color" value={data.backgroundColor || '#ffffff'} onChange={(e) => updateData({ ...data, backgroundColor: e.target.value })} />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Text Color</label>
        <input type="color" value={data.textColor || '#0f172a'} onChange={(e) => updateData({ ...data, textColor: e.target.value })} />
      </div>
    </>
  );

  const renderMediaTextSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Layout Orientation</label>
        <select 
          className={styles.select}
          value={data.layout || 'left'}
          onChange={(e) => updateData({ ...data, layout: e.target.value })}
        >
          <option value="left">Image Left / Text Right</option>
          <option value="right">Text Left / Image Right</option>
        </select>
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Section Image</label>
        <div 
          className={styles.imageUploadBox}
          style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#f8fafc' }}
          onClick={() => document.getElementById('media-img-input')?.click()}
        >
          <input type="file" id="media-img-input" style={{ display: 'none' }} accept="image/*" onChange={handleImageFile} />
          {data.image ? <img src={data.image} alt="Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', color: '#94a3b8' }}><i className="fas fa-image" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}></i><span>Upload Image</span></div>}
        </div>
      </div>
    </>
  );

  const renderCounterSettings = () => (
    <>
      <label className={styles.label}>Manage Counters</label>
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input className={styles.select} style={{ marginBottom: 0 }} placeholder="Value" value={item.value} onChange={(e) => {
              const newItems = [...data.items];
              newItems[idx].value = e.target.value;
              updateData({ ...data, items: newItems });
            }} />
            <button className={styles.deleteIcon} onClick={() => {
              const newItems = data.items.filter((_: any, i: number) => i !== idx);
              updateData({ ...data, items: newItems });
            }}><i className="fas fa-times"></i></button>
          </div>
          <input className={styles.select} style={{ marginBottom: 0 }} placeholder="Label" value={item.label} onChange={(e) => {
            const newItems = [...data.items];
            newItems[idx].label = e.target.value;
            updateData({ ...data, items: newItems });
          }} />
        </div>
      ))}
      <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { label: 'NEW', value: '0' }] })}>+ Add Counter</button>
    </>
  );

  const renderCountdownSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Target Date & Time</label>
        <input type="datetime-local" className={styles.select} value={data.targetDate || ''} onChange={(e) => updateData({ ...data, targetDate: e.target.value })} />
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Background Image</label>
        <div 
          className={styles.imageUploadBox}
          style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#f8fafc' }}
          onClick={() => document.getElementById('countdown-bg-input')?.click()}
        >
          <input 
            type="file" id="countdown-bg-input" style={{ display: 'none' }} accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => updateData({ ...data, backgroundImage: reader.result as string });
                reader.readAsDataURL(file);
              }
            }} 
          />
          {data.backgroundImage ? (
            <img src={data.backgroundImage} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <i className="fas fa-image" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}></i>
              <span>Upload Background</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderTestimonialsSettings = () => (
    <>
      <label className={styles.label}>Manage Testimonials</label>
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <label style={{ fontSize: '11px', fontWeight: 700 }}>TESTIMONIAL {idx + 1}</label>
             <button className={styles.deleteIcon} onClick={() => {
                const newItems = data.items.filter((_: any, i: number) => i !== idx);
                updateData({ ...data, items: newItems });
             }}><i className="fas fa-trash"></i></button>
          </div>
          <textarea className={styles.select} rows={3} placeholder="Quote" value={item.quote} onChange={(e) => {
            const newItems = [...data.items];
            newItems[idx].quote = e.target.value;
            updateData({ ...data, items: newItems });
          }} />
          <input className={styles.select} placeholder="Author" value={item.author} onChange={(e) => {
            const newItems = [...data.items];
            newItems[idx].author = e.target.value;
            updateData({ ...data, items: newItems });
          }} />
        </div>
      ))}
      <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { quote: '', author: '', role: '' }] })}>+ Add Testimonial</button>
    </>
  );

  const renderHTMLSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Custom HTML</label>
        <textarea className={styles.select} style={{ height: '300px', fontFamily: 'monospace' }} value={data.html || ''} onChange={(e) => updateData({ ...data, html: e.target.value })} />
      </div>
    </>
  );

  const renderWidgetSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Embed URL</label>
        <input type="text" className={styles.select} placeholder="URL" value={data.embedUrl || ''} onChange={(e) => updateData({ ...data, embedUrl: e.target.value })} />
      </div>
    </>
  );

  const renderMediaGroupSettings = () => (
    <>
      <label className={styles.label}>Manage Group Items</label>
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <label style={{ fontSize: '11px', fontWeight: 700 }}>ITEM {idx + 1}</label>
             <button className={styles.deleteIcon} onClick={() => {
                const newItems = data.items.filter((_: any, i: number) => i !== idx);
                updateData({ ...data, items: newItems });
             }}><i className="fas fa-trash"></i></button>
          </div>
          <input 
            className={styles.select} 
            placeholder="Title"
            value={item.title || ''} 
            onChange={(e) => {
               const newItems = [...data.items];
               newItems[idx].title = e.target.value;
               updateData({ ...data, items: newItems });
            }} 
          />
          <div className={styles.section}>
            <label className={styles.label}>Item Image</label>
            <div 
              className={styles.imageUploadBox}
              style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#fff' }}
              onClick={() => document.getElementById(`media-group-item-img-${idx}`)?.click()}
            >
              <input 
                type="file" id={`media-group-item-img-${idx}`} style={{ display: 'none' }} accept="image/*" 
                onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                       const newItems = [...data.items];
                       newItems[idx].image = reader.result as string;
                       updateData({ ...data, items: newItems });
                     };
                     reader.readAsDataURL(file);
                   }
                }} 
              />
              {item.image ? <img src={item.image} alt="Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '12px', color: '#94a3b8' }}>Upload Image</span>}
            </div>
          </div>
        </div>
      ))}
      <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { title: 'New Item', image: 'https://via.placeholder.com/400' }] })}>+ Add Item</button>
    </>
  );

  const renderAgendaSettings = () => (
    <>
      <label className={styles.label}>Manage Sessions</label>
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <label style={{ fontSize: '11px', fontWeight: 700 }}>SESSION {idx + 1}</label>
             <button className={styles.deleteIcon} onClick={() => {
                const newItems = data.items.filter((_: any, i: number) => i !== idx);
                updateData({ ...data, items: newItems });
             }}><i className="fas fa-trash"></i></button>
          </div>
          
          <div className={styles.section}>
            <label className={styles.label}>Time Slot</label>
            <div style={{ display: 'flex', gap: '8px' }}>
               <input 
                type="time" 
                className={styles.select} 
                style={{ width: '120px', marginBottom: 0 }}
                onChange={(e) => {
                  if (!e.target.value) return;
                  const [hours, minutes] = e.target.value.split(':');
                  const hour = parseInt(hours);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const hour12 = hour % 12 || 12;
                  const time12 = `${hour12}:${minutes} ${ampm}`;
                  const newItems = [...data.items];
                  newItems[idx].time = time12;
                  updateData({ ...data, items: newItems });
                }} 
              />
              <input 
                type="text" 
                className={styles.select} 
                style={{ marginBottom: 0 }}
                placeholder="e.g. 09:00 AM"
                value={item.time || ''} 
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].time = e.target.value;
                  updateData({ ...data, items: newItems });
                }} 
              />
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Title</label>
            <input 
              type="text" 
              className={styles.select} 
              value={item.title || ''} 
              onChange={(e) => {
                const newItems = [...data.items];
                newItems[idx].title = e.target.value;
                updateData({ ...data, items: newItems });
              }} 
            />
          </div>

          {item.desc !== undefined && (
            <div className={styles.section}>
              <label className={styles.label}>Description</label>
              <textarea 
                className={styles.select} 
                rows={2} 
                value={item.desc || ''} 
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].desc = e.target.value;
                  updateData({ ...data, items: newItems });
                }} 
              />
            </div>
          )}

          <div className={styles.section}>
            <label className={styles.label}>Image / Thumbnail</label>
            <div 
              className={styles.imageUploadBox}
              style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#fff' }}
              onClick={() => document.getElementById(`agenda-item-img-${idx}`)?.click()}
            >
              <input 
                type="file" id={`agenda-item-img-${idx}`} style={{ display: 'none' }} accept="image/*" 
                onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                       const newItems = [...data.items];
                       newItems[idx].image = reader.result as string;
                       updateData({ ...data, items: newItems });
                     };
                     reader.readAsDataURL(file);
                   }
                }} 
              />
              {item.image ? <img src={item.image} alt="Session" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '12px', color: '#94a3b8' }}>Upload Image</span>}
            </div>
          </div>
        </div>
      ))}
      <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { time: '09:00 AM', title: 'New Session', image: 'https://via.placeholder.com/400' }] })}>+ Add Session</button>
    </>
  );

  const renderHeroSettings = () => {
    const currentSlide = data.slides?.[data.currentSlideIndex || 0];
    if (!currentSlide) return <p>No slide selected</p>;

    return (
      <>
        <div className={styles.section}>
          <label className={styles.label}>Manage Images (Active Slide)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
            {currentSlide.images?.map((img: string, idx: number) => (
              <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Slide" />
                <button 
                  style={{ position: 'absolute', top: '5px', right: '5px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                  onClick={() => {
                    const newSlides = [...data.slides];
                    newSlides[data.currentSlideIndex || 0].images = newSlides[data.currentSlideIndex || 0].images.filter((_: any, i: number) => i !== idx);
                    updateData({ ...data, slides: newSlides });
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
            <div 
              style={{ height: '80px', borderRadius: '8px', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc' }}
              onClick={() => document.getElementById('hero-sidebar-img-upload')?.click()}
            >
              <i className="fas fa-plus" style={{ color: '#64748b' }}></i>
              <input 
                type="file" id="hero-sidebar-img-upload" style={{ display: 'none' }} accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newSlides = [...data.slides];
                      newSlides[data.currentSlideIndex || 0].images = [...(newSlides[data.currentSlideIndex || 0].images || []), reader.result as string];
                      updateData({ ...data, slides: newSlides });
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Slide Layout</label>
          <select 
            className={styles.select}
            value={currentSlide.layout || 'split-left'}
            onChange={(e) => {
              const newSlides = [...data.slides];
              newSlides[data.currentSlideIndex || 0].layout = e.target.value;
              updateData({ ...data, slides: newSlides });
            }}
          >
            <option value="split-left">Split: Image Left</option>
            <option value="split-right">Split: Image Right</option>
            <option value="stack-top">Stack: Image Top</option>
            <option value="stack-bottom">Stack: Image Bottom</option>
            <option value="full-bg">Full Background Image</option>
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Text Alignment</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['left', 'center', 'right'].map(align => (
              <button 
                key={align}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: currentSlide.textAlignment === align ? '#3d35c8' : '#fff', color: currentSlide.textAlignment === align ? '#fff' : '#333', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                onClick={() => {
                  const newSlides = [...data.slides];
                  newSlides[data.currentSlideIndex || 0].textAlignment = align;
                  updateData({ ...data, slides: newSlides });
                }}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Content Position (Vertical)</label>
          <select 
            className={styles.select}
            value={currentSlide.verticalPosition || 'center'}
            onChange={(e) => {
              const newSlides = [...data.slides];
              newSlides[data.currentSlideIndex || 0].verticalPosition = e.target.value;
              updateData({ ...data, slides: newSlides });
            }}
          >
            <option value="flex-start">Top</option>
            <option value="center">Middle</option>
            <option value="flex-end">Bottom</option>
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Image / Content Ratio (%)</label>
          <input 
            type="range" min="30" max="70" step="5"
            value={currentSlide.imageWidth || 50}
            onChange={(e) => {
              const newSlides = [...data.slides];
              newSlides[data.currentSlideIndex || 0].imageWidth = parseInt(e.target.value);
              updateData({ ...data, slides: newSlides });
            }}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
            <span>Small</span><span>Equal</span><span>Large</span>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Overlay Darkness</label>
          <input 
            type="range" min="0" max="0.9" step="0.1"
            value={currentSlide.overlayOpacity !== undefined ? currentSlide.overlayOpacity : 0.5}
            onChange={(e) => {
              const newSlides = [...data.slides];
              newSlides[data.currentSlideIndex || 0].overlayOpacity = parseFloat(e.target.value);
              updateData({ ...data, slides: newSlides });
            }}
            style={{ width: '100%' }}
          />
        </div>

        <div className={styles.section} style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
          <label className={styles.label} style={{ color: '#2563eb', fontSize: '12px', fontWeight: 800 }}>PRIMARY BUTTON</label>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Button Label</label>
              <input 
                type="text" className={styles.select} style={{ marginBottom: '8px' }}
                value={currentSlide.primaryBtnLabel || 'REGISTER NOW'} 
                onChange={(e) => {
                  const newSlides = [...data.slides];
                  newSlides[data.currentSlideIndex || 0].primaryBtnLabel = e.target.value;
                  updateData({ ...data, slides: newSlides });
                }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Link URL (https://...)</label>
              <input 
                type="text" className={styles.select} style={{ marginBottom: 0 }}
                placeholder="https://event.com/register"
                value={currentSlide.primaryBtnLink || ''} 
                onChange={(e) => {
                  const newSlides = [...data.slides];
                  newSlides[data.currentSlideIndex || 0].primaryBtnLink = e.target.value;
                  updateData({ ...data, slides: newSlides });
                }} 
              />
            </div>
          </div>
        </div>

        <div className={styles.section} style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
          <label className={styles.label} style={{ color: '#64748b', fontSize: '12px', fontWeight: 800 }}>SECONDARY BUTTON</label>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Button Label</label>
              <input 
                type="text" className={styles.select} style={{ marginBottom: '8px' }}
                value={currentSlide.secondaryBtnLabel || 'VIEW AGENDA'} 
                onChange={(e) => {
                  const newSlides = [...data.slides];
                  newSlides[data.currentSlideIndex || 0].secondaryBtnLabel = e.target.value;
                  updateData({ ...data, slides: newSlides });
                }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Link URL (https://...)</label>
              <input 
                type="text" className={styles.select} style={{ marginBottom: 0 }}
                placeholder="https://event.com/agenda"
                value={currentSlide.secondaryBtnLink || ''} 
                onChange={(e) => {
                  const newSlides = [...data.slides];
                  newSlides[data.currentSlideIndex || 0].secondaryBtnLink = e.target.value;
                  updateData({ ...data, slides: newSlides });
                }} 
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Event Countdown</label>
          <input type="datetime-local" className={styles.select} value={data.dateTimeSettings?.eventDate || ''} onChange={(e) => updateData({ ...data, dateTimeSettings: { ...data.dateTimeSettings, eventDate: e.target.value } })} />
        </div>
      </>
    );
  };

  const renderVenueSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Venue Name</label>
        <input type="text" className={styles.select} value={data.name || ''} onChange={(e) => updateData({ ...data, name: e.target.value })} />
      </div>
      <GoogleMapPicker 
        apiKey={GOOGLE_MAPS_API_KEY} 
        address={data.address || ''} 
        onLocationSelect={(address, lat, lng, imageUrl) => {
          const update: any = { address, lat, lng };
          if (imageUrl) update.image = imageUrl;
          updateData({ ...data, ...update });
        }} 
      />
      <textarea className={styles.select} placeholder="Description" value={data.description || ''} onChange={(e) => updateData({ ...data, description: e.target.value })} />
    </>
  );

  const renderSpeakerSettings = () => (
    <>
      <label className={styles.label}>Manage Speakers</label>
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <label style={{ fontSize: '11px', fontWeight: 700 }}>SPEAKER {idx + 1}</label>
             <button className={styles.deleteIcon} onClick={() => {
                const newItems = data.items.filter((_: any, i: number) => i !== idx);
                updateData({ ...data, items: newItems });
             }}><i className="fas fa-trash"></i></button>
          </div>
          <input 
            className={styles.select} 
            placeholder="Name" 
            value={item.name || ''} 
            onChange={(e) => {
              const newItems = [...data.items];
              newItems[idx].name = e.target.value;
              updateData({ ...data, items: newItems });
            }} 
          />
          <input 
            className={styles.select} 
            placeholder="Role" 
            value={item.role || ''} 
            onChange={(e) => {
              const newItems = [...data.items];
              newItems[idx].role = e.target.value;
              updateData({ ...data, items: newItems });
            }} 
          />
          <div className={styles.section}>
            <label className={styles.label}>Speaker Image</label>
            <div 
              className={styles.imageUploadBox}
              style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#fff' }}
              onClick={() => document.getElementById(`speaker-item-img-${idx}`)?.click()}
            >
              <input 
                type="file" id={`speaker-item-img-${idx}`} style={{ display: 'none' }} accept="image/*" 
                onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                       const newItems = [...data.items];
                       newItems[idx].image = reader.result as string;
                       updateData({ ...data, items: newItems });
                     };
                     reader.readAsDataURL(file);
                   }
                }} 
              />
              {item.image ? <img src={item.image} alt="Speaker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '12px', color: '#94a3b8' }}>Upload Image</span>}
            </div>
          </div>
        </div>
      ))}
      <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { name: 'New Speaker', role: 'Role', image: 'https://via.placeholder.com/400' }] })}>+ Add Speaker</button>
    </>
  );

  const renderSponsorSettings = () => (
    <>
      <label className={styles.label}>Manage Sponsors</label>
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <label style={{ fontSize: '11px', fontWeight: 700 }}>SPONSOR {idx + 1}</label>
             <button className={styles.deleteIcon} onClick={() => {
                const newItems = data.items.filter((_: any, i: number) => i !== idx);
                updateData({ ...data, items: newItems });
             }}><i className="fas fa-trash"></i></button>
          </div>
          <input 
            className={styles.select} 
            placeholder="Name" 
            value={item.name || ''} 
            onChange={(e) => {
              const newItems = [...data.items];
              newItems[idx].name = e.target.value;
              updateData({ ...data, items: newItems });
            }} 
          />
          <div className={styles.section}>
            <label className={styles.label}>Logo</label>
            <div 
              className={styles.imageUploadBox}
              style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#fff' }}
              onClick={() => document.getElementById(`sponsor-item-img-${idx}`)?.click()}
            >
              <input 
                type="file" id={`sponsor-item-img-${idx}`} style={{ display: 'none' }} accept="image/*" 
                onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                       const newItems = [...data.items];
                       newItems[idx].image = reader.result as string;
                       updateData({ ...data, items: newItems });
                     };
                     reader.readAsDataURL(file);
                   }
                }} 
              />
              {item.image ? <img src={item.image} alt="Sponsor" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} /> : <span style={{ fontSize: '12px', color: '#94a3b8' }}>Upload Logo</span>}
            </div>
          </div>
        </div>
      ))}
      <button className={styles.tealLink} onClick={() => updateData({ ...data, items: [...(data.items || []), { name: 'New Sponsor', image: '' }] })}>+ Add Sponsor</button>
    </>
  );

  const renderTextSettings = () => (
    <>
      <div className={styles.section}>
        <label className={styles.label}>Font Family</label>
        <select 
          className={styles.select}
          value={data.fontFamily || 'inherit'}
          onChange={(e) => updateData({ ...data, fontFamily: e.target.value })}
        >
          <option value="inherit">Default (Inherit)</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Montserrat', sans-serif">Montserrat</option>
          <option value="'Poppins', sans-serif">Poppins</option>
          <option value="'Playfair Display', serif">Playfair Display</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Bebas Neue', cursive">Bebas Neue</option>
          <option value="'Pacifico', cursive">Pacifico</option>
        </select>
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Font Size</label>
        <input type="range" min="12" max="100" value={parseInt(data.fontSize) || 16} onChange={(e) => updateData({ ...data, fontSize: e.target.value + 'px' })} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>
          <span>12px</span><span>{data.fontSize || '16px'}</span><span>100px</span>
        </div>
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Font Weight</label>
        <select 
          className={styles.select}
          value={data.fontWeight || 'normal'}
          onChange={(e) => updateData({ ...data, fontWeight: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi Bold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
          <option value="900">Black</option>
        </select>
      </div>
      <div className={styles.section}>
        <label className={styles.label}>Color</label>
        <input type="color" value={data.color || '#000000'} onChange={(e) => updateData({ ...data, color: e.target.value })} />
      </div>
    </>
  );

  const renderCommonSettings = () => (
    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #f1f5f9' }}>
      <label className={styles.label} style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
        <i className="fas fa-arrows-alt-v"></i> Section Spacing & Size
      </label>

      <div className={styles.section} style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <label className={styles.label}>Vertical Padding (Height)</label>
        <input 
          type="range" min="0" max="300" step="10"
          value={data.verticalPadding !== undefined ? data.verticalPadding : 100} 
          onChange={(e) => updateData({ ...data, verticalPadding: parseInt(e.target.value) })} 
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
          <span>Thin (0)</span><span>0px</span><span>Large (300)</span>
        </div>
      </div>

      <label className={styles.label} style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fas fa-external-link-alt"></i> Section Action Button
      </label>
      
      <div className={styles.section} style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Enable Button</span>
          <button 
            style={{ 
              width: '40px', height: '22px', borderRadius: '20px', position: 'relative', cursor: 'pointer', border: 'none',
              background: data.showButton ? '#2563eb' : '#cbd5e1', transition: '0.3s'
            }}
            onClick={() => updateData({ ...data, showButton: !data.showButton })}
          >
            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: data.showButton ? '21px' : '3px', transition: '0.3s' }}></div>
          </button>
        </div>

        {data.showButton && (
          <>
            <div className={styles.section}>
              <label className={styles.label}>Button Text</label>
              <input 
                type="text" className={styles.select} placeholder="Click Here" 
                value={data.buttonLabel || ''} onChange={(e) => updateData({ ...data, buttonLabel: e.target.value })} 
              />
            </div>
            <div className={styles.section}>
              <label className={styles.label}>Button Link</label>
              <input 
                type="text" className={styles.select} placeholder="https://..." 
                value={data.buttonLink || ''} onChange={(e) => updateData({ ...data, buttonLink: e.target.value })} 
              />
            </div>
            <div className={styles.section}>
              <label className={styles.label}>Button Position</label>
              <div style={{ display: 'flex', gap: '5px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                {['left', 'center', 'right'].map(pos => (
                  <button 
                    key={pos}
                    style={{ 
                      flex: 1, padding: '8px', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                      background: (data.buttonPosition || 'center') === pos ? '#fff' : 'transparent',
                      color: (data.buttonPosition || 'center') === pos ? '#0f172a' : '#64748b',
                      boxShadow: (data.buttonPosition || 'center') === pos ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                    onClick={() => updateData({ ...data, buttonPosition: pos })}
                  >
                    {pos.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.section}>
              <label className={styles.label}>Button Colour</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#2563eb', '#ff6b00', '#10b981', '#ef4444', '#0f172a', '#6366f1'].map(color => (
                  <div 
                    key={color} 
                    onClick={() => updateData({ ...data, buttonColor: color })}
                    style={{ 
                      width: '30px', height: '30px', borderRadius: '50%', background: color, cursor: 'pointer',
                      border: (data.buttonColor || '#2563eb') === color ? '3px solid #fff' : 'none',
                      boxShadow: (data.buttonColor || '#2563eb') === color ? '0 0 0 2px #2563eb' : 'none'
                    }}
                  />
                ))}
                <input 
                  type="color" 
                  value={data.buttonColor || '#2563eb'} 
                  onChange={(e) => updateData({ ...data, buttonColor: e.target.value })}
                  style={{ width: '30px', height: '30px', border: 'none', background: 'none', cursor: 'pointer' }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const panelContent = (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} onClick={onClose} />
      <div className={`${styles.panel} ${styles.panelFixed} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>{mode} SETTINGS</h3>
          <button className={styles.closeBtn} onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className={styles.content}>
          {mode === 'HERO' && renderHeroSettings()}
          {mode === 'VENUE' && renderVenueSettings()}
          {mode === 'SPEAKER' && renderSpeakerSettings()}
          {mode === 'SPONSOR' && renderSponsorSettings()}
          {mode === 'TEXT' && renderTextSettings()}
          {mode === 'AGENDA' && renderAgendaSettings()}
          {mode === 'MEDIA_TEXT' && renderMediaTextSettings()}
          {mode === 'COUNTER' && renderCounterSettings()}
          {mode === 'TESTIMONIALS' && renderTestimonialsSettings()}
          {mode === 'COUNTDOWN' && renderCountdownSettings()}
          {mode === 'WIDGET' && renderWidgetSettings()}
          {mode === 'CUSTOM_HTML' && renderHTMLSettings()}
          {mode === 'MEDIA_GROUP' && renderMediaGroupSettings()}
          {mode === 'MOVING_LINE' && renderMovingLineSettings()}

          {/* Universal Section Settings */}
          {mode !== 'NONE' && renderCommonSettings()}
        </div>
        <div className={styles.footer}>
          <button className={styles.tealLink} onClick={onClose}>Apply Changes</button>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;

  return createPortal(panelContent, document.body);
};

export default SettingsPanel;