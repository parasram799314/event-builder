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
      button: {
        label: 'RESERVE YOUR SPOT',
        link: '#',
        bgColor: '#0f172a',
        textColor: '#ffffff'
      },
      secondaryButton: {
        label: 'EXPLORE AGENDA',
        link: '#'
      },
      titleStyle: {
        color: '#0f172a',
        fontWeight: '800'
      },
      subtitleStyle: {
        color: '#475569'
      },
      layout: 'split-left',
      imageWidth: 45,
      textAlignment: 'left'
    }
  ];

  // ... (rest of the code remains the same)

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

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [sidebarState, setSidebarState] = useState<{
    isOpen: boolean;
    mode: SettingsMode;
    sidebarData: any
  }>({
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
    if (isPaused && !isReadOnly) return;
    // Only pause on hover in editor mode
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
    }, 4000);
    // 4 seconds for smoother experience
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
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [dateTimeSettings.eventDate]);

  // ... (rest of the code remains the same)

  const handleSlideChange = (idx: number) => {
    if (!isReadOnly) updateData({ ...data, currentSlideIndex: idx });
    else setCurrentSlideIndex(idx);
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig} data={data} onSettingsClick={() => openHeroSettings()}>
      <section className={styles.heroSection} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <SettingsPanel isOpen={sidebarState.isOpen} onClose={() => setSidebarState({ ...sidebarState, isOpen: false })} mode={sidebarState.mode} data={sidebarState.sidebarData} updateData={updateSidebarData} />
        {slides.length > 1 && (
          <div className={styles.slideNav}>
            {slides.map((_: any, idx: number) => (
              <button key={idx} className={`${styles.dot} ${idx === currentSlideIndex ? styles.activeDot : ''}`} onClick={() => handleSlideChange(idx)} />
            ))}
          </div>
        )}
        <div className={styles.sliderTrack} style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}>
          {slides.map((slide: any, index: number) => {
            const slideStyles = getSlideStyles(slide);
            const overlayColor = slide.overlayColor || '0,0,0';
            const overlayOpacity = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.6;
            return (
              <div key={slide.id} className={styles.slideFrame} style={{ ...slideStyles.frame, '--bg-image': `url('${slide.images?.[slide.currentImageIndex || 0] || ""}')`, '--overlay-color': overlayColor, '--overlay-opacity': overlayOpacity } as React.CSSProperties}>
                <div className={styles.heroLeft} style={slideStyles.content}>
                  {visibility.badge && (
                    <div className={styles.badge} style={slideStyles.badge} contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => {
                      const newSlides = [...slides];
                      newSlides[index].badge = e.target.innerText;
                      updateData({ ...data, slides: newSlides });
                    }}>
                      <i className="fas fa-star" style={{ fontSize: '10px' }}></i> {slide.badge || 'Exclusive Event 2026'}
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
                            {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}>📅</span>} <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleDateString() : ''}</span>
                          </div>
                        )}
                        {dateTimeSettings.showTime && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                            {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}>🕒</span>} <span>{isMounted ? new Date(dateTimeSettings.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        )}
                        {dateTimeSettings.showVenue && (
                          <div className={styles.metaItem} style={{ color: 'inherit' }}>
                            {dateTimeSettings.showIcons && <span className={styles.icon} style={{ color: slideStyles.badge.color }}>📍</span>} <span contentEditable={!isReadOnly} suppressContentEditableWarning onBlur={(e) => updateData({ ...data, dateTimeSettings: { ...dateTimeSettings, venueText: e.target.innerText } })}> {dateTimeSettings.venueText} </span>
                          </div>
                        )}
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
                    ) : null}
                  </div>
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
              </div>
            );
          })}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default HeroSection;
