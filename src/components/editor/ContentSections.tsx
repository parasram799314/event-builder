"use client";

import React, { useState, useEffect } from 'react';
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
      <div className={`${styles.sectionContainer} ${styles.responsivePadding}`} style={{ '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <div className={styles.flexResponsive} style={{ flexDirection: (sectionData.layout === 'right' ? 'row-reverse' : 'row') as any, textAlign: 'left' }}>
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
      <div className={`${styles.sectionContainer} ${styles.responsivePadding} editable-element`} style={{ '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <div className={styles.responsiveGrid}>
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
      <div className={`${styles.sectionContainer} ${styles.responsivePadding} editable-element`} style={{ background: props.themeConfig?.primaryColor || '#ff5722', color: '#fff' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <div className={styles.counterGrid}>
           {sectionData.items.map((item: any, i: number) => (
             <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
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
      <div className={`${styles.sectionContainer} ${styles.responsivePadding} editable-element`} style={{ background: '#f8fafc' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>What People Say</h2>
        <div className={styles.responsiveGrid}>
           {sectionData.items.map((t: any, i: number) => (
             <div key={i} className={styles.testimonialCard}>
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
    targetDate: props.data?.targetDate || '2026-10-15T09:00',
    backgroundImage: props.data?.backgroundImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600'
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(sectionData.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [sectionData.targetDate]);

  const primaryColor = props.themeConfig?.primaryColor || '#ff6b00';

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
      {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="COUNTDOWN" data={sectionData} updateData={props.updateData!} />
      )}
      <div className={`${styles.responsivePadding} editable-element`} style={{ 
        background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('${sectionData.backgroundImage}') center/cover no-repeat fixed`,
        color: '#fff', 
        padding: '120px 20px', 
        textAlign: 'center',
        position: 'relative',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <h2
          style={{ 
            fontSize: '14px', 
            fontWeight: 800, 
            letterSpacing: '5px', 
            textTransform: 'uppercase', 
            color: primaryColor,
            marginBottom: '40px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
          contentEditable={!props.isReadOnly}
          suppressContentEditableWarning
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>

        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((unit, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.05)', 
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '35px 30px',
              borderRadius: '28px',
              minWidth: '150px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1, marginBottom: '12px', fontFamily: 'inherit', color: '#fff' }}>
                {String(unit.value).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: primaryColor }}>
                {unit.label}
              </div>
            </div>
          ))}
        </div>
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
      <div className={`${styles.sectionContainer} ${styles.responsivePadding}`} style={{ textAlign: 'center' }}>
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
      <div className={`${styles.sectionContainer} ${styles.responsivePadding}`} style={{ '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        {!props.isReadOnly && <div className="editable-element" style={{ marginBottom: '40px' }}><EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} /></div>}
        <div className={styles.responsiveGrid}>
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
      <div className={`editable-element ${styles.responsivePadding}`} style={{ padding: '20px 0', textAlign: 'center' }}>
        {!props.isReadOnly && <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />}
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '20px' }}>{sectionData.title}</h2>
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
           <iframe src={sectionData.embedUrl} style={{ width: '100%', height: '500px', borderRadius: '24px', border: 'none' }} title="Video" allowFullScreen className={styles.responsiveIframe}></iframe>
        </div>
      </div>
    </SectionWrapper>
  );
};

// 10. GALLERY
export const GallerySection: React.FC<ContentSectionProps> = (props) => {
  const sectionData = {
    ...props.data,
    title: props.data?.title || 'Event Gallery',
    badge: props.data?.badge || 'MOMENTS',
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', title: 'Grand Opening' },
      { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', title: 'Tech Talk' },
      { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', title: 'Networking' },
      { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', title: 'Closing Ceremony' }
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

  const addItem = () => {
    const newItems = [...sectionData.items, { image: 'https://via.placeholder.com/800x600', title: 'New Image' }];
    props.updateData?.({ ...sectionData, items: newItems });
  };

  const triggerUpload = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => updateItem(index, 'image', reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const primaryColor = props.themeConfig?.primaryColor || '#ff6b00';

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData}>
      <div className={`${styles.gallerySection} ${styles.responsivePadding}`}>
        <div className={styles.galleryHeader}>
           <div 
            style={{ display: 'inline-block', background: `${primaryColor}15`, color: primaryColor, padding: '6px 16px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', marginBottom: '16px' }}
            contentEditable={!props.isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) => props.updateData?.({ ...sectionData, badge: e.target.innerText })}
           >
             {sectionData.badge}
           </div>
           <h2 
            style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1px' }}
            contentEditable={!props.isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
           >
             {sectionData.title}
           </h2>
        </div>

        <div className={styles.galleryGrid}>
           {sectionData.items.map((item: any, i: number) => (
             <div key={i} className={styles.galleryItem}>
                <img src={item.image} alt={item.title} />
                <div className={styles.galleryOverlay}>
                   <div 
                    className={styles.galleryTitle}
                    contentEditable={!props.isReadOnly}
                    suppressContentEditableWarning
                    onBlur={(e) => updateItem(i, 'title', e.target.innerText)}
                   >
                     {item.title}
                   </div>
                </div>
                {!props.isReadOnly && (
                  <div className={styles.cardActions}>
                    <button className={styles.cardActionBtn} onClick={() => triggerUpload(i)} title="Change Image"><i className="fas fa-camera"></i></button>
                    <button className={styles.cardActionBtn} onClick={() => deleteItem(i)} title="Delete Image"><i className="fas fa-trash-alt"></i></button>
                  </div>
                )}
             </div>
           ))}
        </div>
        
        {!props.isReadOnly && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button className={styles.addItemBtn} onClick={addItem}>
              <i className="fas fa-plus"></i> Add Image to Gallery
            </button>
          </div>
        )}
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
          className={styles.subtitle}
          style={{ marginBottom: '40px', textAlign: 'center', opacity: 0.6, width: '100%' }}
          contentEditable={!props.isReadOnly} 
          suppressContentEditableWarning 
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>
        {!props.isReadOnly && <div style={{ marginBottom: '20px' }}><EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} /></div>}
        <div className={styles.flexCenter}>
          {sectionData.items.map((s: any, i: number) => (
            <div key={i} className={styles.movingLineItem}>
              <img src={s.image} className={styles.movingLineImage} style={{ height: '45px' }} alt={s.name} />
            </div>
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
             <h3 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 800, fontSize: '20px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>{cat.name} Sponsors</h3>
             <div className={styles.flexCenter} style={{ gap: '80px' }}>
                {cat.sponsors.map((s: any, j: number) => (
                  <img key={j} src={s.image} style={{ height: '40px', filter: 'grayscale(100%) opacity(0.7)' }} alt={s.name} />
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
    subtitle: props.data?.subtitle || 'Deep dive into the future of technology with our expert-led sessions.',
    items: (props.data?.items && props.data.items.length > 0) ? props.data.items : [
      { time: '09:00 AM', title: 'Opening Keynote: Future Vision', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', category: 'KEYNOTE' },
      { time: '11:30 AM', title: 'Strategic Growth & Scaling', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', category: 'WORKSHOP' },
      { time: '02:00 PM', title: 'AI & Machine Learning Deep Dive', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', category: 'TECH TALK' }
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
      { time: '04:00 PM', title: 'New Featured Session', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', category: 'SESSION' }
    ];
    props.updateData?.({ ...sectionData, items: newItems });
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={sectionData} onSettingsClick={() => setIsSidebarOpen(true)}>
       {!props.isReadOnly && (
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="AGENDA" data={sectionData} updateData={(newData) => props.updateData?.({ ...sectionData, ...newData })} />
      )}
      <div className={styles.featuredSectionContainer} style={{ '--primary': props.themeConfig?.primaryColor || '#ff5722' } as any}>
        <div className={styles.featuredHeader}>
          <h2 
            className={styles.featuredMainTitle}
            contentEditable={!props.isReadOnly} 
            suppressContentEditableWarning 
            onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
          >
            {sectionData.title}
          </h2>
          <p 
            className={styles.featuredSubtitle}
            contentEditable={!props.isReadOnly} 
            suppressContentEditableWarning 
            onBlur={(e) => props.updateData?.({ ...sectionData, subtitle: e.target.innerText })}
          >
            {sectionData.subtitle}
          </p>
        </div>

        {!props.isReadOnly && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <EditToolbar onSettingsClick={() => setIsSidebarOpen(true)} />
          </div>
        )}

        <div className={styles.featuredGrid}>
          {sectionData.items?.map((item: any, i: number) => (
            <div key={i} className={styles.featuredCard}>
              {!props.isReadOnly && (
                <div className={styles.cardActions}>
                  <button className={styles.cardActionBtn} onClick={() => deleteItem(i)} title="Delete Session">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              )}
              
              <div className={styles.featuredImageArea}>
                <img src={item.image} alt={item.title} />
                <div className={styles.featuredOverlay}></div>
                <div className={styles.featuredBadge} style={{ background: props.themeConfig?.primaryColor || '#ff5722' }}>
                   <span contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => updateItem(i, 'category', e.target.innerText)}>{item.category || 'SESSION'}</span>
                </div>
                {!props.isReadOnly && (
                  <div className={styles.featuredUploadBtn} onClick={() => triggerImageUpload(i)}>
                    <i className="fas fa-camera"></i>
                  </div>
                )}
                <input type="file" id={`featured-session-img-${i}`} hidden accept="image/*" onChange={(e) => handleImageChange(i, e)} />
              </div>

              <div className={styles.featuredContent}>
                <div className={styles.featuredTimeRow}>
                   <i className="far fa-clock"></i>
                   <span contentEditable={!props.isReadOnly} suppressContentEditableWarning onBlur={(e) => updateItem(i, 'time', e.target.innerText)}>{item.time}</span>
                </div>
                <h3 
                  className={styles.featuredCardTitle}
                  contentEditable={!props.isReadOnly} 
                  suppressContentEditableWarning 
                  onBlur={(e) => updateItem(i, 'title', e.target.innerText)}
                >
                  {item.title}
                </h3>
                <div className={styles.featuredArrow}>
                   <i className="fas fa-arrow-right"></i>
                </div>
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
      <div style={{ padding: '20px 60px', textAlign: 'center' }}>
        <h2 
          style={{ fontSize: '32px', fontWeight: 800 }}
          contentEditable={!props.isReadOnly} 
          suppressContentEditableWarning 
          onBlur={(e) => props.updateData?.({ ...sectionData, title: e.target.innerText })}
        >
          {sectionData.title}
        </h2>
        <img src={sectionData.image} style={{ width: '100%', maxWidth: '1000px', marginTop: '20px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} alt="Floor Plan" />
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
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="SECTION" data={sectionData} updateData={props.updateData!} />
      )}
      <div style={{ padding: '20px 60px', background: '#f8fafc' }}>
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
        <SettingsPanel isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} mode="SECTION" data={sectionData} updateData={props.updateData!} />
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
  const { data = {}, updateData, isReadOnly = false, themeConfig } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const items = (data?.items && data.items.length > 0) ? data.items : [
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
    { type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }
  ];

  const speed = data?.speed || 40;
  const direction = data?.direction || 'left';
  const gap = data?.gap || 80;
  const backgroundColor = data?.backgroundColor || '#ffffff';
  const textColor = data?.textColor || '#0f172a';
  const fontSize = data?.fontSize || '24px';
  const grayscaleImages = data?.grayscaleImages ?? true;

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
          padding: '40px 0',
          '--item-gap': `${gap}px`,
          '--image-filter': grayscaleImages ? 'grayscale(100%) opacity(0.6)' : 'none',
          '--speed': `${speed}s`,
          '--bg-color': backgroundColor
        } as any}
      >
        <div 
          className={styles.movingLineTrack} 
          style={{ 
            animationDuration: `${speed}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
            gap: `${gap}px`
          }}
        >
          {displayItems.map((item: any, i: number) => (
            <div key={i} className={styles.movingLineItem} style={{ color: textColor, fontSize: fontSize }}>
              {item.type === 'image' ? (
                <img src={item.content} alt="Logo" className={styles.movingLineImage} />
              ) : (
                <span className={styles.movingLineText}>{item.content}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

