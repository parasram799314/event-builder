"use client";

import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import EditToolbar from './EditToolbar';
import ButtonEditorModal from './ButtonEditorModal';
import SettingsPanel from './SettingsPanel';
import styles from './ContentSections.module.css';
import GoogleMapDisplay from './GoogleMapDisplay';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const SectionThemedWrapper = ({ themeConfig, children, style }: any) => {
  const primary = themeConfig?.primaryColor || '#ff5722';
  const text = themeConfig?.textColor || '#1e293b';
  const bg = themeConfig?.backgroundColor || '#ffffff';
  const fontFamily = themeConfig?.fontFamily || 'inherit';

  return (
    <div style={{ 
      '--primary': primary,
      '--text': text,
      '--background': bg,
      fontFamily: fontFamily,
      ...style
    } as any}>
      {children}
    </div>
  );
};

interface ContentSectionProps {
  id?: string;
  isVisible?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isReadOnly?: boolean;
  data?: any;
  updateData?: (newData: any) => void;
  themeConfig?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

const EditableButton = ({ 
  label: initialLabel, 
  link: initialLink, 
  className,
  isReadOnly = false,
  themeConfig
}: { 
  label: string, 
  link: string, 
  className: string,
  isReadOnly?: boolean,
  themeConfig?: any
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [link, setLink] = useState(initialLink);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="editable-element" style={{ width: 'fit-content', margin: '0 auto' }}>
      {!isReadOnly && (
        <EditToolbar 
          onSettingsClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
        />
      )}
      <button 
        className={className}
        onClick={() => link !== '#' && window.open(link, '_blank')}
        style={{ 
          backgroundColor: themeConfig?.primaryColor || '#ff5722',
          color: '#ffffff'
        }}
      >
        {label}
      </button>
      {!isReadOnly && (
        <ButtonEditorModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          buttonData={{ label, link }}
          onSave={(newLabel, newLink) => {
            setLabel(newLabel);
            setLink(newLink);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// 2. MEDIA WITH TEXT
export const MediaTextSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Unlock Innovation & Growth',
    description: props.data?.description || 'Experience a transformative journey through the latest industry trends, expert-led workshops, and unparalleled networking opportunities designed to elevate your professional path.',
    image: props.data?.image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    layout: props.data?.layout || 'left'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="MEDIA_TEXT" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={styles.sectionContainer} style={{ paddingLeft: '60px', paddingRight: '60px', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <div style={{ display: 'flex', flexDirection: (sectionData.layout === 'right' ? 'row-reverse' : 'row') as any, alignItems: 'center', gap: '60px', textAlign: 'left' }}>
          <div style={{ flex: 1 }} className="editable-element">
             {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
             <img src={sectionData.image} style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} alt="Media" />
          </div>
          <div style={{ flex: 1 }}>
             <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px', color: props.themeConfig?.textColor || 'inherit' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e: any) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
             <p style={{ fontSize: '18px', color: props.themeConfig?.textColor === '#ffffff' ? '#cbd5e1' : '#64748b' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e: any) => props.updateData?.({ ...sectionData, description: e.target.innerText })}>{sectionData.description}</p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

// 3. MEDIA TEXT GROUP (MEDIA_GROUP)
export const MediaGroupSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { title: 'Global Connectivity', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400' },
      { title: 'Scalable Solutions', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400' },
      { title: 'Sustainable Growth', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400' }
    ]
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const deleteItem = (index: number) => {
    const newItems = sectionData.items.filter((_: any, i: number) => i !== index);
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const triggerImageUpload = (index: number) => {
    document.getElementById(`media-group-img-${index}`)?.click();
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateItem(index, 'image', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    const newItems = [...sectionData.items, { title: 'New Item', image: 'https://via.placeholder.com/400' }];
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="MEDIA_GROUP" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={`${styles.sectionContainer} editable-element`} style={{ paddingLeft: '60px', paddingRight: '60px', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', width: '100%' }}>
           {sectionData.items.map((item: any, i: number) => (
             <div key={i} className={styles.mediaGroupItem}>
                {!props.isReadOnly && (
                  <div className={styles.cardActions}>
                    <button className={styles.cardActionBtn} onClick={() => deleteItem(i)} title="Delete Item">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                )}
                <div className={styles.speakerImgWrapper} style={{ borderRadius: '20px', width: '100%', height: '250px' }}>
                  <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} alt={item.title} />
                  {!props.isReadOnly && (
                    <>
                      <div className={styles.imageOverlay} onClick={() => triggerImageUpload(i)}>
                        <i className="fas fa-camera"></i>
                      </div>
                      <input 
                        type="file" 
                        id={`media-group-img-${i}`} 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(i, e)} 
                      />
                    </>
                  )}
                </div>
                <h3 
                  style={{ fontSize: '20px', fontWeight: 800, marginTop: '20px' }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'title', e.target.innerText)}
                >
                  {item.title}
                </h3>
             </div>
           ))}
        </div>
        {!props.isReadOnly && (
          <button className={styles.addItemBtn} onClick={addItem}>
            <i className="fas fa-plus"></i> Add New Item
          </button>
        )}
      </div>
    </SectionWrapper>
  );
};

// 4. NUMBER COUNTER
export const NumberCounterSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { label: 'ATTENDEES', value: '5000+' },
      { label: 'SPEAKERS', value: '120+' },
      { label: 'SESSIONS', value: '45' },
      { label: 'COUNTRIES', value: '30+' }
    ]
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="COUNTER" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={`${styles.sectionContainer} editable-element`} style={{ background: props.themeConfig?.primaryColor || '#ff5722', color: '#fff', paddingLeft: '60px', paddingRight: '60px' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
           {sectionData.items.map((item: any, i: number) => (
             <div key={i} style={{ textAlign: 'center' }}>
                <div 
                  style={{ fontSize: '48px', fontWeight: 800 }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'value', e.target.innerText)}
                >
                  {item.value}
                </div>
                <div 
                  style={{ fontSize: '14px', opacity: 0.8 }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'label', e.target.innerText)}
                >
                  {item.label}
                </div>
             </div>
           ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// 5. TESTIMONIALS
export const TestimonialsSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { quote: "The best tech event I've attended in years. The networking was incredible!", author: "David Miller", role: "CTO, NextGen" },
      { quote: "Seamless organization and top-tier speakers. Highly recommend to everyone.", author: "Linda Garcia", role: "Product Lead, Innovate" }
    ]
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="TESTIMONIALS" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={`${styles.sectionContainer} editable-element`} style={{ paddingLeft: '60px', paddingRight: '60px', background: '#f8fafc' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '60px' }}>What People Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', width: '100%' }}>
           {sectionData.items.map((t: any, i: number) => (
             <div key={i} style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'left' }}>
                <i className="fas fa-quote-left" style={{ fontSize: '32px', color: props.themeConfig?.primaryColor || '#ff5722', marginBottom: '20px', display: 'block' }}></i>
                <p 
                  style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'quote', e.target.innerText)}
                >
                  "{t.quote}"
                </p>
                <div 
                  style={{ fontWeight: 800 }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'author', e.target.innerText)}
                >
                  {t.author}
                </div>
                <div 
                  style={{ fontSize: '14px', color: '#64748b' }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'role', e.target.innerText)}
                >
                  {t.role}
                </div>
             </div>
           ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// 6. COUNTDOWN
export const CountdownSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'THE EVENT STARTS IN',
    targetDate: props.data?.targetDate || '2026-10-15T09:00'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="COUNTDOWN" data={sectionData} updateData={props.updateData!} />
      )}
      <div className="editable-element" style={{ background: '#0f172a', color: '#fff', paddingLeft: '60px', paddingRight: '60px', textAlign: 'center' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <h2 
          style={{ marginBottom: '40px' }}
          contentEditable={!props.isReadOnly} 
          suppressContentEditableWarning 
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>
        <div style={{ fontSize: '48px', fontWeight: 800 }}>{sectionData.targetDate ? sectionData.targetDate.replace('T', ' ') : '2026-10-15 09:00'}</div>
      </div>
    </SectionWrapper>
  );
};

// 7. TEXT
export const TextSection: React.FC<ContentSectionProps> = (props) => {
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Event Vision & Mission',
    content: props.data?.content || 'Our mission is to bring together the most innovative minds in the industry to share knowledge, inspire creativity, and build lasting connections that drive global change.'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData}>
      <div className={styles.sectionContainer} style={{ paddingLeft: '60px', paddingRight: '60px', textAlign: 'center' }}>
        <div className="editable-element">
           {!props.isReadOnly && <EditToolbar />}
           <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '24px' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
        </div>
        <div className="editable-element">
           {!props.isReadOnly && <EditToolbar />}
           <div style={{ fontSize: '20px', lineHeight: 1.8, color: '#475569', maxWidth: '900px', margin: '0 auto' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, content: e.target.innerText })}>{sectionData.content}</div>
        </div>
      </div>
    </SectionWrapper>
  );
};

// 8. LIST
export const ListSection: React.FC<ContentSectionProps> = (props) => {
  const sectionData = {
    ...props.data,
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { title: 'Innovation First', desc: 'We prioritize groundbreaking ideas that change the world.' },
      { title: 'Expert Guidance', desc: 'Learn directly from industry leaders and pioneers.' },
      { title: 'Global Networking', desc: 'Connect with thousands of peers from around the globe.' }
    ]
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData}>
       {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="MEDIA_GROUP" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={styles.sectionContainer} style={{ paddingLeft: '60px', paddingRight: '60px', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        {!props.isReadOnly && <div className="editable-element" style={{ marginBottom: '40px' }}><EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} /></div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', width: '100%' }}>
           {sectionData.items.map((item: any, i: number) => (
             <div key={i} className="editable-element" style={{ textAlign: 'left', padding: '30px', background: '#f8fafc', borderRadius: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${props.themeConfig?.primaryColor || '#ff5722'}15`, color: props.themeConfig?.primaryColor || '#ff5722', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>
                   <i className="fas fa-check"></i>
                </div>
                <h3 
                  style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'title', e.target.innerText)}
                >
                  {item.title}
                </h3>
                <p 
                  style={{ color: '#64748b', lineHeight: 1.6 }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'desc', e.target.innerText)}
                >
                  {item.desc}
                </p>
             </div>
           ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// 9. EMBED WIDGET
export const EmbedWidgetSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Featured Sessions',
    embedUrl: props.data?.embedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="WIDGET" data={sectionData} updateData={props.updateData!} />
      )}
      <div className="editable-element" style={{ paddingLeft: '60px', paddingRight: '60px', textAlign: 'center' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>{sectionData.title}</h2>
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
           <iframe src={sectionData.embedUrl} style={{ width: '100%', height: '500px', borderRadius: '24px', border: 'none' }} title="Video" allowFullScreen></iframe>
        </div>
      </div>
    </SectionWrapper>
  );
};

// 10. GALLERY
export const GallerySection: React.FC<ContentSectionProps> = (props) => {
  const sectionData = {
    ...props.data,
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
      { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400' },
      { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400' },
      { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400' }
    ]
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => {}}>
      <div className={styles.sectionContainer} style={{ paddingLeft: '60px', paddingRight: '60px', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '60px', textAlign: 'center' }}>Event Gallery</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%' }}>
           {sectionData.items.map((item: any, i: number) => (
             <img key={i} src={item.image} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px' }} alt={`Gallery ${i}`} />
           ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// 11. SPEAKERS
export const SpeakersSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Our Speakers',
    subtitle: props.data?.subtitle || 'Industry leaders sharing their vision for the future.',
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { name: 'Sarah Johnson', role: 'CEO, TechFlow', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
      { name: 'Michael Chen', role: 'Lead Architect, Google', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
      { name: 'Elena Rodriguez', role: 'AI Ethics, OpenAI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }
    ]
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const deleteItem = (index: number) => {
    const newItems = sectionData.items.filter((_: any, i: number) => i !== index);
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const triggerImageUpload = (index: number) => {
    const input = document.getElementById(`speaker-img-${index}`) as HTMLInputElement;
    input?.click();
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateItem(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpeaker = () => {
    const newItems = [
      ...sectionData.items,
      { 
        name: 'New Speaker', 
        role: 'Speaker Role', 
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' 
      }
    ];
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="SPEAKER" data={sectionData} updateData={(newData) => props.updateData?.({ ...sectionData, ...newData })} />
      )}
      <div className={styles.speakersSection} style={{ '--primary': props.themeConfig?.primaryColor || '#ff6b00' } as any}>
        <div className={styles.speakersHeader}>
          <div className="editable-element">
             {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
             <h2 style={{ color: props.themeConfig?.primaryColor || '#ff6b00' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
          </div>
          <div className="editable-element">
             <p className={styles.speakersSubtitle} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, subtitle: e.target.innerText })}>{sectionData.subtitle}</p>
          </div>
        </div>

        <div className={styles.speakersGrid}>
          {sectionData.items?.map((s: any, i: number) => (
            <div key={i} className={styles.speakerCard}>
              {!props.isReadOnly && (
                <div className={styles.cardActions}>
                  <button className={styles.cardActionBtn} onClick={() => deleteItem(i)} title="Delete Speaker">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              )}
              <div className={styles.speakerImgWrapper}>
                <img src={s.image} alt={s.name} />
                {!props.isReadOnly && (
                  <>
                    <div className={styles.imageOverlay} onClick={() => triggerImageUpload(i)}>
                      <i className="fas fa-camera"></i>
                    </div>
                    <input 
                      type="file" 
                      id={`speaker-img-${i}`} 
                      hidden 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(i, e)} 
                    />
                  </>
                )}
              </div>
              <h3 
                className={styles.speakerName}
                contentEditable={!props.isReadOnly} 
                suppressContentEditableWarning 
                onBlur={(e) => updateItem(i, 'name', e.target.innerText)}
              >
                {s.name}
              </h3>
              <p 
                className={styles.speakerRole}
                contentEditable={!props.isReadOnly} 
                suppressContentEditableWarning 
                onBlur={(e) => updateItem(i, 'role', e.target.innerText)}
              >
                {s.role}
              </p>
            </div>
          ))}
        </div>
        {!props.isReadOnly && (
          <button className={styles.addSpeakerBtn} onClick={addSpeaker}>
            <i className="fas fa-plus"></i> Add New Speaker
          </button>
        )}
      </div>
    </SectionWrapper>
  );
};

// 12. SPONSORS
export const SponsorsSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'OFFICIAL PARTNERS',
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { name: 'Microsoft', image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
      { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { name: 'Amazon', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
      { name: 'Meta', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' }
    ]
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="SPONSOR" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={styles.sponsorsSection} style={{ '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <h2 
          style={{ fontSize: '24px', fontWeight: 800, marginBottom: '60px', textAlign: 'center', opacity: 0.5 }}
          contentEditable={!props.isReadOnly} 
          suppressContentEditableWarning 
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', justifyContent: 'center', alignItems: 'center' }}>
          {sectionData.items.map((s: any, i: number) => (
            <img key={i} src={s.image} style={{ height: '50px', filter: 'grayscale(100%) opacity(0.6)', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.filter = 'none'} onMouseOut={e => e.currentTarget.style.filter = 'grayscale(100%) opacity(0.6)'} alt={s.name} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// 13. SPONSOR CATEGORY
export const SponsorCategorySection: React.FC<ContentSectionProps> = (props) => {
  const sectionData = {
    ...props.data,
    categories: (props.data?.categories && props.data.categories.length > 0) ? props.data.categories : [
      { 
        name: 'Platinum', 
        sponsors: [
          { name: 'Microsoft', image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
          { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' }
        ] 
      },
      { 
        name: 'Gold', 
        sponsors: [
          { name: 'Amazon', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
        ] 
      }
    ]
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => {}}>
      <div className={styles.sectionContainer} style={{ paddingLeft: '60px', paddingRight: '60px', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        {sectionData.categories.map((cat: any, i: number) => (
          <div key={i} style={{ marginBottom: '60px', width: '100%' }}>
             <h3 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 800, fontSize: '24px' }}>{cat.name} Sponsors</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', alignItems: 'center' }}>
                {cat.sponsors.map((s: any, j: number) => (
                  <img key={j} src={s.image} style={{ height: '40px' }} alt={s.name} />
                ))}
             </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

// 14. FEATURED SESSIONS
export const FeaturedSessionsSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Featured Sessions',
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { time: '09:00 AM', title: 'Opening Keynote: Future Vision', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
      { time: '11:30 AM', title: 'Strategic Growth & Scaling', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400' },
      { time: '02:00 PM', title: 'AI & Machine Learning Deep Dive', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400' }
    ]
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const deleteItem = (index: number) => {
    const newItems = sectionData.items.filter((_: any, i: number) => i !== index);
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const triggerImageUpload = (index: number) => {
    document.getElementById(`featured-session-img-${index}`)?.click();
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateItem(index, 'image', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSession = () => {
    const newItems = [
      ...sectionData.items,
      { time: '04:00 PM', title: 'New Featured Session', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400' }
    ];
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
       {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="AGENDA" data={sectionData} updateData={(newData) => props.updateData?.({ ...sectionData, ...newData })} />
      )}
      <div className={styles.sectionContainer} style={{ paddingLeft: '60px', paddingRight: '60px', width: '100%' }}>
        <h2 
          style={{ fontSize: '32px', fontWeight: 800, marginBottom: '60px', textAlign: 'center' }}
          contentEditable={!props.isReadOnly} 
          suppressContentEditableWarning 
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '100%' }}>
          {sectionData.items?.map((item: any, i: number) => (
            <div key={i} className={styles.speakerCard} style={{ textAlign: 'left', padding: '0', overflow: 'hidden' }}>
              {!props.isReadOnly && (
                <div className={styles.cardActions}>
                  <button className={styles.cardActionBtn} onClick={() => deleteItem(i)} title="Delete Session">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              )}
              <div className={styles.speakerImgWrapper} style={{ width: '100%', height: '200px', borderRadius: '0', margin: '0' }}>
                <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} />
                {!props.isReadOnly && (
                  <>
                    <div className={styles.imageOverlay} onClick={() => triggerImageUpload(i)}>
                      <i className="fas fa-camera"></i>
                    </div>
                    <input 
                      type="file" 
                      id={`featured-session-img-${i}`} 
                      hidden 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(i, e)} 
                    />
                  </>
                )}
              </div>
              <div style={{ padding: '24px' }}>
                <div 
                  style={{ color: props.themeConfig?.primaryColor || '#ff6b00', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'time', e.target.innerText)}
                >
                  {item.time}
                </div>
                <h3 
                  style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'title', e.target.innerText)}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        {!props.isReadOnly && (
          <button className={styles.addItemBtn} onClick={addSession}>
            <i className="fas fa-plus"></i> Add Featured Session
          </button>
        )}
      </div>
    </SectionWrapper>
  );
};

// 15. FLOOR PLAN
export const FloorPlanSection: React.FC<ContentSectionProps> = (props) => {
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Exhibition Floor Plan',
    image: props.data?.image || 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData}>
      <div style={{ paddingLeft: '60px', paddingRight: '60px', textAlign: 'center' }}>
        <h2 
          style={{ fontSize: '32px', fontWeight: 800 }}
          contentEditable={!props.isReadOnly} 
          suppressContentEditableWarning 
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>
        <img src={sectionData.image} style={{ width: '100%', maxWidth: '1000px', marginTop: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} alt="Floor Plan" />
      </div>
    </SectionWrapper>
  );
};

// 16. CUSTOM HTML
export const CustomHTMLSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    html: props.data?.html || '<div style="padding:40px; text-align:center; background:#f8fafc; border-radius:20px;"><h3>Your Custom Content</h3><p>Edit this in settings.</p></div>'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="CUSTOM_HTML" data={sectionData} updateData={props.updateData!} />
      )}
      <div className="editable-element" style={{ padding: '40px' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <div dangerouslySetInnerHTML={{ __html: sectionData.html }} />
      </div>
    </SectionWrapper>
  );
};

// 17. SCHEDULE (AGENDA)
export const AgendaSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Event Schedule',
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { time: '09:00 AM', title: 'Opening Keynote: Future Vision', desc: 'Navigating the next decade of innovation.', speaker: 'Sarah Johnson' },
      { time: '11:30 AM', title: 'Strategic Growth & Scaling', desc: 'Real-world applications of scalable systems.', speaker: 'Michael Chen' },
      { time: '02:00 PM', title: 'AI & Machine Learning Deep Dive', desc: 'Practical implementations of modern AI models.', speaker: 'Elena Rodriguez' }
    ]
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="AGENDA" data={sectionData} updateData={(newData) => props.updateData?.({ ...sectionData, ...newData })} />
      )}
      <div className={styles.agendaSection}>
        <div className="editable-element" style={{ marginBottom: '60px', textAlign: 'center' }}>
           {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
           <h2 style={{ fontSize: '32px', fontWeight: 800, color: props.themeConfig?.primaryColor || '#ff6b00' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
        </div>
        <div className={styles.agendaTimeline}>
          {sectionData.items?.map((item: any, i: number) => (
            <div key={i} className={styles.agendaItem}>
              <div 
                className={styles.agendaTime}
                contentEditable={!props.isReadOnly} 
                suppressContentEditableWarning 
                onBlur={(e) => updateItem(i, 'time', e.target.innerText)}
              >
                {item.time}
              </div>
              <div className={styles.agendaDot} style={{ background: props.themeConfig?.primaryColor }}></div>
              <div className={styles.agendaContent}>
                <h3 
                  className={styles.agendaTitle}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'title', e.target.innerText)}
                >
                  {item.title}
                </h3>
                <p 
                  className={styles.agendaDesc}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'desc', e.target.innerText)}
                >
                  {item.desc}
                </p>
                <div className={styles.agendaMeta}>
                   <span 
                    style={{ fontWeight: 700, color: props.themeConfig?.primaryColor }}
                    contentEditable={!props.isReadOnly} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateItem(i, 'speaker', e.target.innerText)}
                   >
                     {item.speaker}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

// 18. CONTACT FORM
export const ContactFormSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Get in Touch',
    subtitle: props.data?.subtitle || 'Our team is here to help with any event inquiries.'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="CONTACT" data={sectionData} updateData={props.updateData!} />
      )}
      <div style={{ padding: '100px 60px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
           <h2 style={{ textAlign: 'center', marginBottom: '10px' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
           <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px' }}>{sectionData.subtitle}</p>
           <input placeholder="Name" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }} disabled />
           <input placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }} disabled />
           <textarea placeholder="Message" rows={4} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }} disabled></textarea>
           <button style={{ width: '100%', padding: '15px', background: props.themeConfig?.primaryColor || '#ff5722', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 800 }}>SEND MESSAGE</button>
        </div>
      </div>
    </SectionWrapper>
  );
};

// WHY ATTEND (Special handling)
export const WhyAttendSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Why Join the Summit?',
    description: props.data?.description || 'Discover the latest trends in technology, connect with industry leaders, and gain practical skills that will accelerate your professional growth. This event is designed to inspire and empower.'
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="WHY_ATTEND" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={styles.sectionContainer} style={{ textAlign: 'center', paddingLeft: '60px', paddingRight: '60px', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <div className="editable-element">
          {!props.isReadOnly && <EditToolbar />}
          <h2 className={styles.orangeTitle} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
        </div>
        <div className="editable-element">
          {!props.isReadOnly && <EditToolbar />}
          <div className={styles.description} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, description: e.target.innerText })}>{sectionData.description}</div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export const VenueSection: React.FC<ContentSectionProps> = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const DEFAULT_AUDITORIUM_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600';

  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Venue & Location',
    name: props.data?.name || 'Grand Innovation Hub',
    address: props.data?.address || '123 Tech Plaza, San Francisco, CA',
    description: props.data?.description || 'A world-class facility equipped with state-of-the-art technology and premium amenities for a superior event experience.',
    image: props.data?.image || DEFAULT_AUDITORIUM_IMAGE
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
       {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="VENUE" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={styles.venueSection} style={{ color: props.themeConfig?.textColor || '#1e293b', '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <div className={styles.speakersHeader}>
          <div className="editable-element">
             {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
             <h2 style={{ color: props.themeConfig?.primaryColor || '#ff6b00' }} contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}>{sectionData.title}</h2>
          </div>
        </div>

        <div className={styles.beautifulVenueContainer}>
          <div className={styles.venueMainCard}>
            <div className={styles.venueImageWrapper}>
              <img 
                src={sectionData.image} 
                alt={sectionData.name} 
                className={styles.venueImage} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_AUDITORIUM_IMAGE;
                }}
              />
              <div className={styles.venueBadge}><i className="fas fa-star"></i> PREMIUM VENUE</div>
            </div>
            
            <div className={styles.venueInfoCard}>
              <div className={styles.venueTitleGroup}>
                <span className={styles.venueCategory} style={{ color: props.themeConfig?.primaryColor || '#ff5722' }}>LOCATION DETAILS</span>
                <h3 
                  className={styles.venueNameText}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => props.updateData?.({ ...sectionData, name: e.target.innerText })}
                >
                  {sectionData.name}
                </h3>
              </div>

              <div className={styles.venueDetailRows}>
                <div className={styles.venueDetailRow}>
                  <div className={styles.venueIconBox} style={{ backgroundColor: `${props.themeConfig?.primaryColor || '#ff5722'}15` }}>
                    <i className="fas fa-map-marker-alt" style={{ color: props.themeConfig?.primaryColor || '#ff5722' }}></i>
                  </div>
                  <div className={styles.venueRowContent}>
                    <label>ADDRESS</label>
                    <p 
                      contentEditable={!props.isReadOnly} 
                      suppressContentEditableWarning 
                      onBlur={(e) => props.updateData?.({ ...sectionData, address: e.target.innerText })}
                    >
                      {sectionData.address}
                    </p>
                  </div>
                </div>

                <div className={styles.venueDetailRow}>
                  <div className={styles.venueIconBox} style={{ backgroundColor: '#f1f5f9' }}>
                    <i className="fas fa-info-circle" style={{ color: '#64748b' }}></i>
                  </div>
                  <div className={styles.venueRowContent}>
                    <label>ABOUT THE VENUE</label>
                    <p 
                      contentEditable={!props.isReadOnly} 
                      suppressContentEditableWarning 
                      onBlur={(e) => props.updateData?.({ ...sectionData, description: e.target.innerText })}
                    >
                      {sectionData.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.miniMapWrapper}>
                <GoogleMapDisplay apiKey={GOOGLE_MAPS_API_KEY} address={sectionData.address} lat={props.data?.lat} lng={props.data?.lng} />
                <div className={styles.mapOverlay}>
                  <button className={styles.mapActionBtn} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sectionData.address || sectionData.name)}`, '_blank')}>
                    <i className="fas fa-directions"></i> GET DIRECTIONS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export const MovingLineSection: React.FC<any> = (props) => {
  const { data, updateData, isReadOnly = false, themeConfig } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const items = (data.items && data.items.length > 0) ? data.items : [
    { type: 'text', content: 'LATEST NEWS' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { type: 'text', content: 'UPCOMING SESSIONS' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { type: 'text', content: 'GLOBAL SUMMIT 2026' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { type: 'text', content: 'REGISTER NOW' }
  ];

  const speed = data.speed || 30;
  const direction = data.direction || 'left';
  const gap = data.gap || 60;
  const backgroundColor = data.backgroundColor || '#ffffff';
  const textColor = data.textColor || '#0f172a';
  const fontSize = data.fontSize || '24px';
  const grayscaleImages = data.grayscaleImages ?? true;

  // Duplicate items for seamless loop
  const displayItems = [...items, ...items];

  return (
    <SectionWrapper {...props} data={data} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!isReadOnly && (
        <SettingsPanel 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          mode="MOVING_LINE" 
          data={{ ...data, items }} 
          updateData={updateData!} 
        />
      )}
      <div 
        className={styles.movingLineSection} 
        style={{ 
          backgroundColor: backgroundColor,
          border: 'none',
          padding: '20px 0',
          '--item-gap': `${gap}px`,
          '--image-filter': grayscaleImages ? 'grayscale(100%) opacity(0.7)' : 'none'
        } as any}
      >
        <div 
          className={styles.movingLineTrack} 
          style={{ 
            animationDuration: `${speed}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal'
          }}
        >
          {displayItems.map((item: any, i: number) => (
            <div key={i} className={styles.movingLineItem} style={{ color: textColor, fontSize: fontSize }}>
              {item.type === 'image' ? (
                <img src={item.content} alt="Logo" className={styles.movingLineImage} />
              ) : (
                <span>{item.content}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

