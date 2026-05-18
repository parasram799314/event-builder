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
      title: 'Global Innovation Summit 2026',
      subtitle: 'Connecting visionaries and leaders to shape the future of technology and global progress.',
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'],
      currentImageIndex: 0,
      button: { label: 'REGISTER NOW', link: '#', bgColor: themeConfig?.primaryColor || '#0f172a', textColor: '#ffffff' },
      titleStyle: { color: '#0f172a', fontSize: '64px', fontWeight: 'bold', fontFamily: 'inherit' },
      subtitleStyle: { color: '#475569', fontSize: '24px', fontWeight: 'normal', fontFamily: 'inherit' },
      layout: 'split-left',
      imageWidth: 50,
      textAlignment: 'left'
    }
  ];

  // Use local state for slide indexing to ensure auto-play works in preview mode
  const [currentSlideIndex, setCurrentSlideIndex] = useState(data.currentSlideIndex || 0);
  
  // Sync local state if data.currentSlideIndex changes (editor mode)
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
    media: true
  };
  const dateTimeSettings = data.dateTimeSettings || {
    showDate: true,
    showTime: true,
    showVenue: true,
    eventDate: '2026-10-15T18:00',
    venueText: 'Grand Convention Center, San Francisco',
    widgetSize: 'Medium',
    showIcons: true,
    textColor: '#475569'
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


  // Auto-play logic for main slides
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      const nextSlide = (currentSlideIndex + 1) % slides.length;
      if (!isReadOnly) {
        updateData({ ...data, currentSlideIndex: nextSlide });
      } else {
        setCurrentSlideIndex(nextSlide);
      }
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [currentSlideIndex, slides.length, isPaused, data, updateData, isReadOnly]);

  // Calculate countdown
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
      title: 'New Event Title',
      subtitle: 'Add a catchy subtitle here',
      images: [],
      currentImageIndex: 0,
      button: { label: 'GET TICKETS NOW', link: '#' },
      titleStyle: { color: '#ffffff', fontSize: '64px', fontWeight: 'bold', fontFamily: 'inherit' },
      subtitleStyle: { color: '#e2e8f0', fontSize: '24px', fontWeight: 'normal', fontFamily: 'inherit' },
      layout: 'split-left',
      imageWidth: 50,
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

  const nextImage = (e: React.MouseEvent, slideIndex: number) => {
    e.stopPropagation();
    const newSlides = [...slides];
    const slide = { ...newSlides[slideIndex] };
    const len = slide.images?.length || 1;
    const currentIndex = typeof slide.currentImageIndex === 'number' ? slide.currentImageIndex : 0;
    slide.currentImageIndex = (currentIndex + 1) % len;
    newSlides[slideIndex] = slide;
    updateData({ ...data, slides: newSlides });
  };

  const prevImage = (e: React.MouseEvent, slideIndex: number) => {
    e.stopPropagation();
    const newSlides = [...slides];
    const slide = { ...newSlides[slideIndex] };
    const len = slide.images?.length || 1;
    const currentIndex = typeof slide.currentImageIndex === 'number' ? slide.currentImageIndex : 0;
    slide.currentImageIndex = (currentIndex - 1 + len) % len;
    newSlides[slideIndex] = slide;
    updateData({ ...data, slides: newSlides });
  };

  const deleteImage = (e: React.MouseEvent, slideIndex: number, imgIndex: number) => {
    e.stopPropagation();
    const newSlides = [...slides];
    const slide = { ...newSlides[slideIndex] };
    slide.images = slide.images.filter((_: any, i: number) => i !== imgIndex);
    slide.currentImageIndex = Math.max(0, (slide.currentImageIndex || 0) - 1);
    newSlides[slideIndex] = slide;
    updateData({ ...data, slides: newSlides });
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

  const triggerReplaceFileInput = (idx: number) => {
    document.getElementById(`hero-image-replace-input-${idx}`)?.click();
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

  const openButtonSettings = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarState({
      isOpen: true,
      mode: 'BUTTON',
      sidebarData: { ...slides[idx].button, index: idx }
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
      newSlides[newData.index].button = { label: newData.label, link: newData.link, bgColor: newData.bgColor, textColor: newData.textColor };
      updateData({ ...data, slides: newSlides });
    } else if (sidebarState.mode === 'TEXT') {
      const newSlides = [...slides];
      const { slideIdx, styleKey, ...styleData } = newData;
      newSlides[slideIdx][styleKey] = styleData;
      updateData({ ...data, slides: newSlides });
    }
    setSidebarState({ ...sidebarState, sidebarData: newData });
  };

  const HiddenPlaceholder = () => (
    <div className={styles.hiddenPlaceholder}>Hidden Element</div>
  );

  const getSlideStyles = (slide: any) => {
    const layout = slide.layout || 'split-left';
    const isStack = layout.startsWith('stack');
    const isFullBg = layout === 'full-bg';
    
    return {
      frame: {
        flexDirection: (layout === 'split-right' ? 'row-reverse' : 
                        layout === 'stack-top' ? 'column' : 
                        layout === 'stack-bottom' ? 'column-reverse' : 'row') as any,
        padding: isStack ? '0 5%' : '0 10%',
        position: 'relative' as any,
        textAlign: slide.textAlignment || 'left' as any,
        justifyContent: isStack ? 'center' : 'space-between',
        alignItems: (slide.verticalPosition || 'center') as any, // Vertical Alignment
        gap: isStack ? '40px' : '0'
      },
      content: {
        flex: isFullBg ? 'none' : isStack ? 'none' : 1,
        maxWidth: isStack ? '800px' : '550px',
        width: isStack ? '100%' : 'auto',
        alignItems: (slide.textAlignment === 'center' ? 'center' : slide.textAlignment === 'right' ? 'flex-end' : 'flex-start') as any,
        position: isFullBg ? 'absolute' : 'relative',
        top: isFullBg ? (slide.verticalPosition === 'flex-start' ? '20%' : slide.verticalPosition === 'flex-end' ? '80%' : '50%') : 'auto',
        left: isFullBg ? (slide.textAlignment === 'left' ? '25%' : slide.textAlignment === 'right' ? '75%' : '50%') : 'auto',
        transform: isFullBg ? 'translate(-50%, -50%)' : 'none',
        zIndex: 10,
        backgroundColor: 'transparent',
        padding: isFullBg ? '40px' : '0',
        borderRadius: isFullBg ? '20px' : '0',
        backdropFilter: isFullBg ? 'blur(4px)' : 'none',
        display: 'flex',
        flexDirection: 'column'
      },
      media: {
        flex: isFullBg ? 'none' : isStack ? 'none' : `0 0 ${slide.imageWidth || 50}%`,
        width: isFullBg ? '100%' : isStack ? `${slide.imageWidth || 100}%` : 'auto',
        height: isFullBg ? '100%' : '500px',
        position: isFullBg ? 'absolute' : 'relative',
        top: isFullBg ? 0 : 'auto',
        left: isFullBg ? 0 : 'auto',
        right: isFullBg ? 0 : 'auto',
        bottom: isFullBg ? 0 : 'auto',
        zIndex: isFullBg ? 1 : 1
      },
      overlay: {
        position: 'absolute' as any,
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'transparent',
        zIndex: 2,
        display: isFullBg ? 'none' : 'block' // Only show overlay if not full-bg (content has its own bg)
      }
    };
  };

  const handleSlideChange = (idx: number) => {
    if (!isReadOnly) {
      updateData({ ...data, currentSlideIndex: idx });
    } else {
      setCurrentSlideIndex(idx);
    }
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

        {slides.length > 1 && (
          <>
            <button 
              className={styles.mainNavBtnPrev} 
              onClick={() => handleSlideChange((currentSlideIndex - 1 + slides.length) % slides.length)}
            >‹</button>
            <button 
              className={styles.mainNavBtnNext} 
              onClick={() => handleSlideChange((currentSlideIndex + 1) % slides.length)}
            >›</button>
          </>
        )}

        <div 
          className={styles.sliderTrack} 
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {slides.map((slide: any, index: number) => {
            const slideStyles = getSlideStyles(slide);
            return (
              <div key={slide.id} className={styles.slideFrame} style={slideStyles.frame}>
                {/* Conditional Overlay for non-full-bg layouts */}
                <div style={slideStyles.overlay}></div>

                <div className={styles.heroLeft} style={slideStyles.content}>
                  <div className="editable-element" style={{ width: '100%' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.title} onToggleVisibility={toggleVisibility('title')} onAddClick={addSlide} onSettingsClick={openHeroSettings} onTextSettingsClick={openTextSettings(index, 'titleStyle')} />}
                    {visibility.title ? (
                      <h1 className={styles.heroTitle} style={{ ...slide.titleStyle, textAlign: slide.textAlignment || 'left' }} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                        const newSlides = [...slides];
                        newSlides[index].title = e.target.innerText;
                        updateData({ ...data, slides: newSlides });
                      }}>{slide.title}</h1>
                    ) : !isReadOnly ? <HiddenPlaceholder /> : null}
                  </div>

                  <div className="editable-element" style={{ width: '100%' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.subtitle} onToggleVisibility={toggleVisibility('subtitle')} onSettingsClick={openHeroSettings} onTextSettingsClick={openTextSettings(index, 'subtitleStyle')} />}
                    {visibility.subtitle ? (
                      <p className={styles.heroSubtitle} style={{ ...slide.subtitleStyle, textAlign: slide.textAlignment || 'left' }} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                        const newSlides = [...slides];
                        newSlides[index].subtitle = e.target.innerText;
                        updateData({ ...data, slides: newSlides });
                      }}>{slide.subtitle}</p>
                    ) : !isReadOnly ? <HiddenPlaceholder /> : null}
                  </div>
                  
                  <div className={`editable-element ${styles.eventMeta}`} style={{ width: '100%' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.meta} onToggleVisibility={toggleVisibility('meta')} onSettingsClick={openHeroSettings} />}
                    {visibility.meta ? (
                      <div style={{ display: 'flex', gap: '32px', color: dateTimeSettings.textColor, justifyContent: (slide.textAlignment === 'center' ? 'center' : slide.textAlignment === 'right' ? 'flex-end' : 'flex-start') as any, flexWrap: 'wrap', width: '100%' }}>
                        {dateTimeSettings.showDate && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                            {dateTimeSettings.showIcons && <span className={styles.icon}>📅</span>}
                            <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleDateString() : ''}</span>
                          </div>
                        )}
                        {dateTimeSettings.showTime && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                            {dateTimeSettings.showIcons && <span className={styles.icon}>🕒</span>}
                            <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        )}
                      </div>
                    ) : !isReadOnly ? <HiddenPlaceholder /> : null}
                  </div>

                  <div className={`editable-element ${styles.dashedPlaceholder}`} style={{ cursor: isReadOnly ? 'default' : 'pointer', margin: slide.textAlignment === 'center' ? '0 auto 32px' : slide.textAlignment === 'right' ? '0 0 32px auto' : '0 0 32px 0' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.dateTimeVenue} onToggleVisibility={toggleVisibility('dateTimeVenue')} onSettingsClick={openHeroSettings} />}
                    {visibility.dateTimeVenue ? (
                      <span 
                        contentEditable={!isReadOnly} 
                        suppressContentEditableWarning 
                        onBlur={(e) => updateData({ ...data, dateTimeSettings: { ...dateTimeSettings, venueText: e.target.innerText } })}
                      >
                        {dateTimeSettings.venueText || (isReadOnly ? '' : '+ Date | Time | Venue')}
                      </span>
                    ) : !isReadOnly ? <HiddenPlaceholder /> : null}
                  </div>

                    <div className="editable-element" style={{ width: 'fit-content', marginBottom: '40px', alignSelf: (slide.textAlignment === 'center' ? 'center' : slide.textAlignment === 'right' ? 'flex-end' : 'flex-start') as any }}>
                      {!isReadOnly && <EditToolbar isVisible={visibility.register} onToggleVisibility={toggleVisibility('register')} onSettingsClick={openButtonSettings(index)} />}
                      {visibility.register ? (
                        <button 
                          className={styles.registerBtn} 
                          style={{ 
                            marginBottom: 0,
                            backgroundColor: themeConfig?.primaryColor || slide.button?.bgColor || '#0f172a',
                            color: slide.button?.textColor || 'white'
                          }} 
                          onClick={() => slide.button?.link !== '#' && window.open(slide.button?.link, '_blank')}
                        >
                          <span 
                            contentEditable={!isReadOnly} 
                            suppressContentEditableWarning 
                            onBlur={(e) => {
                              const newSlides = [...slides];
                              newSlides[index].button = { ...newSlides[index].button, label: e.target.innerText };
                              updateData({ ...data, slides: newSlides });
                            }}
                          >
                            {slide.button?.label || 'REGISTER NOW'}
                          </span>
                        </button>
                      ) : !isReadOnly ? <HiddenPlaceholder /> : null}
                    </div>

                  <div className={`editable-element ${styles.countdownBox}`} style={{ margin: slide.textAlignment === 'center' ? '0 auto 32px' : slide.textAlignment === 'right' ? '0 0 32px auto' : '0 0 32px 0' }}>
                    {!isReadOnly && <EditToolbar isVisible={visibility.countdown} onToggleVisibility={toggleVisibility('countdown')} onSettingsClick={openHeroSettings} />}
                    {visibility.countdown ? (
                      <>
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
                      </>
                    ) : !isReadOnly ? <HiddenPlaceholder /> : null}
                  </div>
                </div>

                <div className={styles.heroRight} style={slideStyles.media}>
                   <div 
                    className={`editable-element ${styles.mediaUploadBox}`} 
                    style={{ borderRadius: slide.layout === 'full-bg' ? '0' : '20px' }}
                    onClick={(e) => {
                      if (!isReadOnly && (!slide.images || slide.images.length === 0)) {
                        triggerFileInput(index);
                      }
                    }}
                   >
                    {!isReadOnly && (
                      <input 
                        type="file" 
                        id={`hero-image-input-${index}`} 
                        className={styles.hiddenInput} 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, index)} 
                      />
                    )}
                    
                    {visibility.media ? (
                      (slide.images?.length || 0) > 0 ? (
                        <div className={styles.innerSliderContainer}>
                          {!isReadOnly && (
                            <div className={styles.imageOverlayActions}>
                               <button 
                                 className={styles.changeImageBtn} 
                                 onClick={(e) => { e.stopPropagation(); triggerFileInput(index); }}
                               >
                                 <i className="fas fa-plus"></i> Add Image
                               </button>
                            </div>
                          )}
                          <div className={styles.innerSliderTrack} style={{ transform: `translateX(-${slide.currentImageIndex * 100}%)` }}>
                            {slide.images.map((img: string, imgIdx: number) => (
                              <div key={imgIdx} className={styles.innerSlide}>
                                <img src={img} alt="Hero" className={styles.heroImage} />
                                {!isReadOnly && (
                                  <div className={styles.imageEditActions}>
                                    <button 
                                      className={styles.replaceImageBtn} 
                                      onClick={(e) => { e.stopPropagation(); triggerReplaceFileInput(index); }}
                                      title="Change this image"
                                    >
                                      <i className="fas fa-sync-alt"></i> Change
                                    </button>
                                    <button 
                                      className={styles.deleteImageBtnSmall} 
                                      onClick={(e) => { e.stopPropagation(); deleteImage(e, index, imgIdx); }}
                                      title="Remove image"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {!isReadOnly && (
                            <input 
                              type="file" 
                              id={`hero-image-replace-input-${index}`} 
                              className={styles.hiddenInput} 
                              accept="image/*" 
                              onChange={(e) => handleImageReplace(e, index, slide.currentImageIndex)} 
                            />
                          )}
                          {slide.images.length > 1 && (
                            <>
                              <button className={styles.innerNavBtnPrev} onClick={(e) => prevImage(e, index)}>‹</button>
                              <button className={styles.innerNavBtnNext} onClick={(e) => nextImage(e, index)}>›</button>
                              <div className={styles.innerDots}>
                                {slide.images.map((_: any, imgIdx: number) => (
                                  <div 
                                    key={imgIdx} 
                                    className={`${styles.innerDot} ${imgIdx === slide.currentImageIndex ? styles.activeInnerDot : ''}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : !isReadOnly ? (
                        <div className={styles.mediaPlaceholder}>
                          <div className={styles.uploadIcon}>
                            <i className="fas fa-cloud-upload-alt"></i>
                          </div>
                          <span className={styles.uploadTitle}>Drag & Drop or Click to Upload</span>
                          <button 
                            className={styles.changeImageBtn} 
                            style={{ marginTop: '12px' }}
                            onClick={(e) => { e.stopPropagation(); triggerFileInput(index); }}
                          >
                            <i className="fas fa-plus"></i> Select Photo
                          </button>
                        </div>
                      ) : null
                    ) : !isReadOnly ? <HiddenPlaceholder /> : null}
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

