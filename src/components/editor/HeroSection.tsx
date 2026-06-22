"use client";

import React, { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';
import EditToolbar from './EditToolbar';
import SettingsPanel, { SettingsMode } from './SettingsPanel';
import SectionWrapper from './SectionWrapper';

interface HeroSectionProps {
  id?: string;
  isVisible?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isReadOnly?: boolean;
  data: any;
  updateData: (newData: any) => void;
  themeConfig?: any;
}

const HeroSection: React.FC<HeroSectionProps> = (props) => {
  const { data, updateData, isReadOnly = false, themeConfig } = props;
  
  // Ensure we have default values if data is empty (first load)
  const slides = (data.slides && data.slides.length > 0) ? data.slides : [
    {
      id: 1,
      badge: 'Limited Seats Available',
      title: 'Experience the Next Big Thing',
      subtitle: 'Join industry leaders and innovators for a three-day journey through the future of technology and networking.',
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'],
      currentImageIndex: 0,
      button: { label: 'RESERVE YOUR SPOT', link: '#', bgColor: '#0f172a', textColor: '#ffffff' },
      secondaryButton: { label: 'EXPLORE AGENDA', link: '#' },
      titleStyle: { color: '#0f172a', fontWeight: '800' },
      subtitleStyle: { color: '#475569' },
      layout: 'split-left',
      imageWidth: 45,
      textAlignment: 'left'
    }
  ];

  // ... (rest of the hooks remain the same)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(data.currentSlideIndex || 0);
  
  useEffect(() => {
    if (!isReadOnly) {
      setCurrentSlideIndex(data.currentSlideIndex || 0);
    }
  }, [data.currentSlideIndex, isReadOnly]);

  const visibility = data.visibility || {
    title: true,
    subtitle: true,
    meta: true,
    dateTimeVenue: true,
    register: true,
    countdown: true,
    social: true,
    media: true,
    badge: true
  };
  const dateTimeSettings = data.dateTimeSettings || {
    showDate: true,
    showTime: true,
    showVenue: true,
    eventDate: '2026-10-15T18:00',
    venueText: 'Grand Convention Center, San Francisco',
    widgetSize: 'Medium',
    showIcons: true,
    textColor: '#64748b'
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [sidebarState, setSidebarState] = useState<{ isOpen: boolean; mode: SettingsMode; sidebarData: any }>({
    isOpen: false,
    mode: 'NONE',
    sidebarData: {}
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play logic for main slides and inner images
  useEffect(() => {
    if (isPaused && !isReadOnly) return; // Only pause on hover in editor mode

    const interval = setInterval(() => {
      const currentSlide = slides[currentSlideIndex];
      
      // 1. Cycle inner images if they exist
      if (currentSlide && currentSlide.images && currentSlide.images.length > 1) {
        const nextImgIndex = ((currentSlide.currentImageIndex || 0) + 1) % currentSlide.images.length;
        const newSlides = [...slides];
        newSlides[currentSlideIndex] = { ...currentSlide, currentImageIndex: nextImgIndex };
        
        if (!isReadOnly) {
          // In editor, we update the data
          updateData({ ...data, slides: newSlides });
        } else {
          // In preview, we update the slides locally if parent doesn't handle it
          // But usually parent should handle it for consistency.
          // For now, let's just use the local state if it's preview.
          // Actually, let's keep it consistent.
          updateData({ ...data, slides: newSlides });
        }
      } 
      // 2. Cycle slides if they exist
      else if (slides.length > 1) {
        const nextSlide = (currentSlideIndex + 1) % slides.length;
        if (!isReadOnly) {
          updateData({ ...data, currentSlideIndex: nextSlide });
        } else {
          setCurrentSlideIndex(nextSlide);
        }
      }
    }, 4000); // 4 seconds for smoother experience

    return () => clearInterval(interval);
  }, [currentSlideIndex, slides.length, isPaused, isReadOnly, data, updateData]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(dateTimeSettings.eventDate).getTime();
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
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [dateTimeSettings.eventDate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, slideIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const newSlides = [...slides];
        newSlides[slideIdx].images = [...(newSlides[slideIdx].images || []), url];
        newSlides[slideIdx].currentImageIndex = newSlides[slideIdx].images.length - 1;
        updateData({ ...data, slides: newSlides });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const addSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSlide = {
      id: Date.now(),
      badge: 'New Opportunities',
      title: 'Innovate with Global Leaders',
      subtitle: 'Discover the latest trends and connect with experts from around the world.',
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'],
      currentImageIndex: 0,
      button: { label: 'JOIN NOW', link: '#' },
      secondaryButton: { label: 'LEARN MORE', link: '#' },
      layout: 'split-left',
      imageWidth: 45,
      textAlignment: 'left'
    };
    updateData({ ...data, slides: [...slides, newSlide], currentSlideIndex: slides.length });
  };

  const deleteSlide = (index: number) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_: any, i: number) => i !== index);
      updateData({ ...data, slides: newSlides, currentSlideIndex: Math.max(0, index - 1) });
    }
  };

  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>, slideIdx: number, imgIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const newSlides = [...slides];
        const slide = { ...newSlides[slideIdx] };
        slide.images = [...(slide.images || [])];
        slide.images[imgIdx] = url;
        newSlides[slideIdx] = slide;
        updateData({ ...data, slides: newSlides });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const triggerFileInput = (idx: number) => {
    document.getElementById(`hero-image-input-${idx}`)?.click();
  };

  const toggleVisibility = (key: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    updateData({ ...data, visibility: { ...visibility, [key]: !visibility[key] } });
  };

  const openHeroSettings = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSidebarState({
      isOpen: true,
      mode: 'HERO',
      sidebarData: { slides, currentSlideIndex, dateTimeSettings }
    });
  };

  const openButtonSettings = (idx: number, isSecondary = false) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const btnKey = isSecondary ? 'secondaryButton' : 'button';
    setSidebarState({
      isOpen: true,
      mode: 'BUTTON',
      sidebarData: { ...slides[idx][btnKey], index: idx, isSecondary }
    });
  };

  const openTextSettings = (slideIdx: number, styleKey: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarState({
      isOpen: true,
      mode: 'TEXT',
      sidebarData: { ...slides[slideIdx][styleKey], slideIdx, styleKey }
    });
  };

  const updateSidebarData = (newData: any) => {
    if (sidebarState.mode === 'HERO') {
      updateData({
        ...data,
        slides: newData.slides,
        currentSlideIndex: newData.currentSlideIndex,
        dateTimeSettings: newData.dateTimeSettings
      });
    } else if (sidebarState.mode === 'BUTTON') {
      const newSlides = [...slides];
      const btnKey = newData.isSecondary ? 'secondaryButton' : 'button';
      newSlides[newData.index][btnKey] = { label: newData.label, link: newData.link, bgColor: newData.bgColor, textColor: newData.textColor };
      updateData({ ...data, slides: newSlides });
    } else if (sidebarState.mode === 'TEXT') {
      const newSlides = [...slides];
      const { slideIdx, styleKey, ...styleData } = newData;
      newSlides[slideIdx][styleKey] = styleData;
      updateData({ ...data, slides: newSlides });
    }
    setSidebarState({ ...sidebarState, sidebarData: newData });
  };

  const getSlideStyles = (slide: any) => {
    const layout = slide.layout || 'split-left';
    const isStack = layout.startsWith('stack');
    const isFullBg = layout === 'full-bg';
    const textAlignment = slide.textAlignment || 'left';
    
    // Default colors for full-bg mode
    const defaultTitleColor = isFullBg ? '#ffffff' : (slide.titleStyle?.color || '#0f172a');
    const defaultSubtitleColor = isFullBg ? 'rgba(255, 255, 255, 0.9)' : (slide.subtitleStyle?.color || '#475569');
    const defaultBadgeColor = isFullBg ? '#facc15' : '#4f46e5';
    const defaultBadgeBg = isFullBg ? 'rgba(250, 204, 21, 0.15)' : 'rgba(99, 102, 241, 0.08)';
    const defaultBadgeBorder = isFullBg ? 'rgba(250, 204, 21, 0.3)' : 'rgba(99, 102, 241, 0.15)';
    const defaultMetaColor = isFullBg ? 'rgba(255, 255, 255, 0.8)' : (data.dateTimeSettings?.textColor || '#64748b');

    const textColor = slide.textColor || (isFullBg ? '#ffffff' : '#0f172a');
    const overlayColor = slide.overlayColor || '0,0,0';
    const overlayOpacity = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.6;
    
    return {
      frame: {
        flexDirection: (layout === 'split-right' ? 'row-reverse' :
                        layout === 'stack-top' ? 'column' :
                        layout === 'stack-bottom' ? 'column-reverse' : 'row') as any,
        padding: isFullBg ? '0' : isStack ? '20px 5%' : '0 10%',
        position: 'relative' as any,
        textAlign: textAlignment as any,
        justifyContent: isFullBg ? 'center' : isStack ? 'center' : 'space-between',
        alignItems: (slide.verticalPosition || 'center') as any,
        gap: isFullBg ? '0' : '80px',
        minHeight: 'inherit',
        height: 'inherit',
        backgroundImage: isFullBg ? `linear-gradient(rgba(${overlayColor},${overlayOpacity}), rgba(${overlayColor},${overlayOpacity})), url('${slide.images?.[slide.currentImageIndex || 0] || ""}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor // Apply base color to frame for inheritance
      } as React.CSSProperties,
      content: {
        flex: isFullBg ? 'none' : isStack ? 'none' : 1,
        maxWidth: isFullBg ? '1000px' : isStack ? '900px' : '680px',
        width: isStack || isFullBg ? '100%' : 'auto',
        alignItems: (textAlignment === 'center' ? 'center' : textAlignment === 'right' ? 'flex-end' : 'flex-start') as any,
        zIndex: 10,
        backgroundColor: 'transparent',
        padding: isFullBg ? '0 20px' : '0',
        display: 'flex',
        flexDirection: 'column' as any,
        textAlign: textAlignment as any,
        color: 'inherit' // Inherit from frame
      } as React.CSSProperties,
      media: {
        display: isFullBg ? 'none' : 'flex',
        flex: isStack ? 'none' : `0 0 ${slide.imageWidth || 45}%`,
        width: isStack ? `${slide.imageWidth || 100}%` : 'auto',
        height: 'auto',
        minHeight: isStack ? '300px' : '400px',
        position: 'relative' as any,
        zIndex: 5
      } as React.CSSProperties,

      badge: {
        color: defaultBadgeColor,
        backgroundColor: defaultBadgeBg,
        borderColor: defaultBadgeBorder
      },
      title: {
        color: defaultTitleColor
      },
      subtitle: {
        color: defaultSubtitleColor
      },
      meta: {
        color: defaultMetaColor
      }
    };
  };

  const handleSlideChange = (idx: number) => {
    if (!isReadOnly) updateData({ ...data, currentSlideIndex: idx });
    else setCurrentSlideIndex(idx);
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={data} onSettingsClick={() => openHeroSettings()}>
      <section 
        className={styles.heroSection}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <SettingsPanel 
          isOpen={sidebarState.isOpen} 
          onClose={() => setSidebarState({ ...sidebarState, isOpen: false })}
          mode={sidebarState.mode}
          data={sidebarState.sidebarData}
          updateData={updateSidebarData}
        />

        {slides.length > 1 && (
          <div className={styles.slideNav}>
            {slides.map((_: any, idx: number) => (
              <button 
                key={idx} 
                className={`${styles.dot} ${idx === currentSlideIndex ? styles.activeDot : ''}`}
                onClick={() => handleSlideChange(idx)}
              />
            ))}
          </div>
        )}

        <div 
          className={styles.sliderTrack} 
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {slides.map((slide: any, index: number) => {
            const slideStyles = getSlideStyles(slide);
            const overlayColor = slide.overlayColor || '0,0,0';
            const overlayOpacity = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.6;
            
            return (
              <div 
                key={slide.id} 
                className={styles.slideFrame} 
                style={{
                  ...slideStyles.frame,
                  '--bg-image': `url('${slide.images?.[slide.currentImageIndex || 0] || ""}')`,
                  '--overlay-color': overlayColor,
                  '--overlay-opacity': overlayOpacity
                } as React.CSSProperties}
              >
                <div className={styles.heroLeft} style={slideStyles.content}>
                  {visibility.badge && (
                    <div className={styles.badge} style={slideStyles.badge} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                      const newSlides = [...slides];
                      newSlides[index].badge = e.target.innerText;
                      updateData({ ...data, slides: newSlides });
                    }}>
                      <i className="fas fa-star" style={{ fontSize: '10px' }}></i>
                      {slide.badge || 'Exclusive Event 2026'}
                    </div>
                  )}

                  <div className="editable-element" style={{ width: '100%' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.title} onToggleVisibility={toggleVisibility('title')} onAddClick={addSlide} onSettingsClick={openHeroSettings} onTextSettingsClick={openTextSettings(index, 'titleStyle')} />}
                    {visibility.title ? (
                      <h1 className={styles.heroTitle} style={{ ...slide.titleStyle, color: slideStyles.title.color, textAlign: slide.textAlignment || 'left' }} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                        const newSlides = [...slides];
                        newSlides[index].title = e.target.innerText;
                        updateData({ ...data, slides: newSlides });
                      }}>{slide.title}</h1>
                    ) : null}
                  </div>

                  <div className="editable-element" style={{ width: '100%' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.subtitle} onToggleVisibility={toggleVisibility('subtitle')} onSettingsClick={openHeroSettings} onTextSettingsClick={openTextSettings(index, 'subtitleStyle')} />}
                    {visibility.subtitle ? (
                      <p className={styles.heroSubtitle} style={{ ...slide.subtitleStyle, color: slideStyles.subtitle.color, textAlign: slide.textAlignment || 'left' }} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                        const newSlides = [...slides];
                        newSlides[index].subtitle = e.target.innerText;
                        updateData({ ...data, slides: newSlides });
                      }}>{slide.subtitle}</p>
                    ) : null}
                  </div>
                  
                  <div className={`editable-element ${styles.eventMeta}`} style={{ width: '100%' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.meta} onToggleVisibility={toggleVisibility('meta')} onSettingsClick={openHeroSettings} />}
                    {visibility.meta ? (
                      <div style={{ display: 'flex', gap: '32px', color: slideStyles.meta.color, justifyContent: (slide.textAlignment === 'center' ? 'center' : slide.textAlignment === 'right' ? 'flex-end' : 'flex-start') as any, flexWrap: 'wrap', width: '100%' }}>
                        {dateTimeSettings.showDate && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                            {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}>📅</span>}
                            <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleDateString() : ''}</span>
                          </div>
                        )}
                        {dateTimeSettings.showTime && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                            {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}>🕒</span>}
                            <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        )}
                        {dateTimeSettings.showVenue && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                             {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}>📍</span>}
                             <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => updateData({ ...data, dateTimeSettings: { ...dateTimeSettings, venueText: e.target.innerText } })}>
                               {dateTimeSettings.venueText}
                             </span>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.buttonGroup}>
                    {visibility.register && (
                      <div className="editable-element">
                        {!isReadOnly && <EditToolbar isVisible={visibility.register} onToggleVisibility={toggleVisibility('register')} onSettingsClick={openButtonSettings(index)} />}
                        <button className={styles.registerBtn} style={{ backgroundColor: themeConfig?.primaryColor || slide.button?.bgColor }}>
                          <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                            const newSlides = [...slides];
                            newSlides[index].button = { ...newSlides[index].button, label: e.target.innerText };
                            updateData({ ...data, slides: newSlides });
                          }}>{slide.button?.label || 'REGISTER NOW'}</span>
                        </button>
                      </div>
                    )}
                    {slide.secondaryButton && (
                      <div className="editable-element">
                        {!isReadOnly && <EditToolbar onSettingsClick={openButtonSettings(index, true)} />}
                        <button className={styles.secondaryBtn}>
                          <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                            const newSlides = [...slides];
                            newSlides[index].secondaryButton = { ...newSlides[index].secondaryButton, label: e.target.innerText };
                            updateData({ ...data, slides: newSlides });
                          }}>{slide.secondaryButton?.label || 'VIEW AGENDA'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {visibility.countdown && (
                    <div className={styles.countdownBox}>
                      <div className={styles.timerUnit}>
                        <span className={styles.timerVal}>{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className={styles.timerLabel}>DAYS</span>
                      </div>
                      <div className={styles.timerUnit}>
                        <span className={styles.timerVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className={styles.timerLabel}>HOURS</span>
                      </div>
                      <div className={styles.timerUnit}>
                        <span className={styles.timerVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className={styles.timerLabel}>MINUTES</span>
                      </div>
                      <div className={styles.timerUnit}>
                        <span className={styles.timerVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className={styles.timerLabel}>SECONDS</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.heroRight} style={slideStyles.media}>
                   <div className={styles.mediaFrame}>
                      {/* Image Management Actions (Visible on Hover) */}
                      {!isReadOnly && (
                        <div className={styles.imageEditActions}>
                          <button 
                            className={styles.changeImageBtn} 
                            onClick={(e) => { e.stopPropagation(); triggerFileInput(index); }}
                            title="Add new image to this slide"
                          >
                            <i className="fas fa-plus"></i> Add
                          </button>
                          <button 
                            className={styles.replaceImageBtn} 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              document.getElementById(`hero-image-replace-input-${index}-${slide.currentImageIndex}`)?.click(); 
                            }}
                            title="Replace current image"
                          >
                            <i className="fas fa-sync-alt"></i> Change
                          </button>
                          {slide.images?.length > 1 && (
                            <button 
                              className={styles.deleteImageBtnSmall} 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSlides = [...slides];
                                const currentSlide = { ...newSlides[index] };
                                currentSlide.images = currentSlide.images.filter((_: any, imgIdx: number) => imgIdx !== currentSlide.currentImageIndex);
                                currentSlide.currentImageIndex = Math.max(0, (currentSlide.currentImageIndex || 0) - 1);
                                newSlides[index] = currentSlide;
                                updateData({ ...data, slides: newSlides });
                              }}
                              title="Delete current image"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Manual Navigation Arrows */}
                      {slide.images?.length > 1 && (
                        <>
                          <button 
                            className={styles.innerNavBtnPrev} 
                            onClick={(e) => {
                              e.stopPropagation();
                              const prevIdx = (slide.currentImageIndex - 1 + slide.images.length) % slide.images.length;
                              const newSlides = [...slides];
                              newSlides[index] = { ...slide, currentImageIndex: prevIdx };
                              updateData({ ...data, slides: newSlides });
                            }}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <button 
                            className={styles.innerNavBtnNext} 
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = (slide.currentImageIndex + 1) % slide.images.length;
                              const newSlides = [...slides];
                              newSlides[index] = { ...slide, currentImageIndex: nextIdx };
                              updateData({ ...data, slides: newSlides });
                            }}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </>
                      )}

                      <img 
                        src={slide.images?.[slide.currentImageIndex || 0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'} 
                        alt="Hero" 
                        className={styles.heroImage} 
                        style={{ opacity: 1 }} // Transition handled by CSS
                        onClick={() => !isReadOnly && triggerFileInput(index)}
                      />

                      {/* Hidden Inputs for File Upload/Replace */}
                      {!isReadOnly && (
                        <>
                          <input type="file" id={`hero-image-input-${index}`} className={styles.hiddenInput} accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                          <input 
                            type="file" 
                            id={`hero-image-replace-input-${index}-${slide.currentImageIndex}`} 
                            className={styles.hiddenInput} 
                            accept="image/*" 
                            onChange={(e) => handleImageReplace(e, index, slide.currentImageIndex || 0)} 
                          />
                        </>
                      )}
                      
                      {/* Dots Indicator for Inner Images */}
                      {slide.images?.length > 1 && (
                        <div className={styles.innerDots}>
                          {slide.images.map((_: any, imgIdx: number) => (
                            <div 
                              key={imgIdx} 
                              className={`${styles.innerDot} ${imgIdx === (slide.currentImageIndex || 0) ? styles.activeInnerDot : ''}`}
                            />
                          ))}
                        </div>
                      )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default HeroSection;
