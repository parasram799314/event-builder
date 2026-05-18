"use client";

import React, { useState, useEffect } from "react";
import GoogleMapDisplay from './GoogleMapDisplay';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
import EditToolbar from './EditToolbar';
import SettingsPanel, { SettingsMode } from './SettingsPanel';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ThemeOneProps {
  data?: any;
  themeConfig?: any;
  isReadOnly?: boolean;
  onUpdateSection?: (id: string, newData: any) => void;
  profiles?: any[];
  onTabChange?: (tab: string) => void;
  footerData?: any;
  onUpdateFooter?: (newData: any) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDelete?: (index: number) => void;
  onAddClick?: (index: number | null) => void;
}

// ─── Editable Components ───────────────────────────────────────────────────
const ThemeSectionWrapper = ({ 
  children, 
  index, 
  isReadOnly, 
  onMoveUp, 
  onMoveDown, 
  onDelete, 
  onAddClick,
  onSettingsClick,
  isFirst,
  isLast 
}: any) => {
  if (isReadOnly) return <>{children}</>;

  return (
    <div className="group relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-[100]">
        {!isFirst && (
          <button onClick={() => onMoveUp(index)} className="w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-blue-50 text-slate-600">
            <i className="fas fa-arrow-up text-xs"></i>
          </button>
        )}
        {!isLast && (
          <button onClick={() => onMoveDown(index)} className="w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-blue-50 text-slate-600">
            <i className="fas fa-arrow-down text-xs"></i>
          </button>
        )}
        <button onClick={() => onSettingsClick()} className="w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-blue-50 text-slate-600">
          <i className="fas fa-cog text-xs"></i>
        </button>
        <button onClick={() => onDelete(index)} className="w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-red-50 text-red-500">
          <i className="fas fa-trash-alt text-xs"></i>
        </button>
      </div>
      {children}
      <div className="h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
        <button 
          onClick={() => onAddClick(index + 1)}
          className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <i className="fas fa-plus text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};

const EditableText = ({ 
  text, 
  onUpdate, 
  isReadOnly, 
  style, 
  tagName: Tag = 'div',
  className = ""
}: any) => {
  return (
    <Tag
      className={className}
      style={style}
      contentEditable={!isReadOnly}
      suppressContentEditableWarning
      onBlur={(e: any) => onUpdate(e.currentTarget.innerText)}
    >
      {text}
    </Tag>
  );
};

const EditableImage = ({ 
  src, 
  onUpdate, 
  isReadOnly, 
  style, 
  className = "" 
}: any) => {
  const triggerUpload = () => {
    if (isReadOnly) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onUpdate(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div style={{ position: 'relative', cursor: isReadOnly ? 'default' : 'pointer' }} onClick={triggerUpload}>
      {!isReadOnly && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)',
          color: '#fff', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', zIndex: 5
        }}>
          CHANGE IMAGE
        </div>
      )}
      <img src={src} alt="Editable" style={style} className={className} />
    </div>
  );
};

// ─── Colour tokens ───────────────────────────────────────────────────────────
const getColors = (themeConfig: any) => {
  const primary = themeConfig?.primaryColor || "#f2545f";
  const bg = themeConfig?.backgroundColor || "#ffffff";
  const text = themeConfig?.textColor || "#1e293b";
  const nav = themeConfig?.navbarColor || "#101010";
  const navText = themeConfig?.navbarTextColor || "#ffffff";

  return {
    primary,
    background: bg,
    text,
    dark: nav, // Use nav color as the primary "dark" contrast
    dark2: text === "#ffffff" ? "#000000" : text, // Logical mapping for secondary dark
    lightBg: bg === "#ffffff" ? "#f9f9f9" : `${bg}dd`, // Logical lighter version of BG
    white: bg, // Use bg as the primary surface color
    accent: primary,
    textGrey: text === "#ffffff" ? "#cbd5e1" : "#707070",
    midGrey: "#808080",
    lightGrey: "#f0f0f0",
    navbar: nav,
    navbarText: navText
  };
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "home", label: "HOME" },
  { id: "whyattend", label: "WHY ATTEND" },
  { id: "speakers", label: "SPEAKERS" },
  { id: "sessions", label: "SESSIONS" },
  { id: "venue", label: "VENUE" },
  { id: "contact", label: "CONTACT" }
];

const Navbar = ({ primaryColor, isReadOnly, logo, profiles, onTabChange, sections, onUpdateLogo }: { primaryColor: string; isReadOnly?: boolean; logo?: string; profiles?: any[]; onTabChange?: (tab: string) => void; sections?: any[]; onUpdateLogo?: (newLogo: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
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
        reader.onloadend = () => onUpdateLogo?.(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Identify Home/Main profile
  const homeProfile = profiles?.find(p => p.isDefault || p.id === 'home') || profiles?.[0];
  const isCurrentlyHome = sections && homeProfile && sections === homeProfile.sections;

  // 1. Always get section links from the HOME profile for consistency
  const sectionLinks = (homeProfile?.sections || [])
    .filter((s: any) => s.isVisible !== false)
    .map((s: any) => {
      const type = s.type === 'GET_IN_TOUCH' ? 'CONTACT' : s.type;
      const label = type.replace(/_/g, ' ');
      // Normalize ID to match the component IDs
      const id = (s.id || type.toLowerCase()).replace(/_/g, ''); 
      return { id, label: label.toUpperCase(), isSection: true, profileName: homeProfile?.name };
    });

  // 2. Get profile links (other than home)
  const otherPageLinks = (profiles && profiles.length > 1) 
    ? profiles
      .filter(p => p.isVisible !== false && p.id !== homeProfile?.id)
      .map(p => ({ id: p.id, label: p.name.toUpperCase(), isProfile: true, profileName: p.name }))
    : [];

  const navItems = [...sectionLinks, ...otherPageLinks];

  return (
    <nav style={{
      position: isReadOnly ? "fixed" : "sticky", 
      top: 0, left: 0, right: 0, zIndex: 1000,
      background: (scrolled || !isReadOnly || menuOpen) ? "#101010" : "transparent", 
      padding: (scrolled || menuOpen) ? "5px 0" : "10px 0",
      transition: "all 0.4s ease",
      boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
      height: '60px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: '100%', width: '100%' }}>
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', position: 'relative', gap: '10px' }}>
          <div onClick={(e) => { 
            if (isReadOnly) { e.preventDefault(); scrollTo("home"); }
            else triggerLogoUpload();
          }} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
            {logo ? (
              <img src={logo} alt="Logo" style={{ height: '35px', maxWidth: '100px', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ color: "#fff", fontWeight: 700, fontSize: "1.4rem", letterSpacing: '1px', outline: 'none' }}
                  contentEditable={!isReadOnly}
                  suppressContentEditableWarning
                  onBlur={(e: any) => {
                    // visual only
                  }}
                  onClick={(e) => !isReadOnly && e.stopPropagation()}
                >
                  EVENT<span style={{ color: primaryColor }}>BUILDER</span>
                </div>
              </div>
            )}
          </div>
          {!isReadOnly && (
            <button 
              onClick={triggerLogoUpload}
              style={{ background: primaryColor, color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, cursor: 'pointer' }}
            >
              {logo ? 'CHANGE' : 'ADD LOGO'}
            </button>
          )}
        </div>

        <ul className="nav-links" style={{ 
          display: "flex", 
          gap: '2px', 
          listStyle: "none", 
          margin: 0, 
          padding: 0,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {navItems.map((item, idx) => (
            <li key={`${item.id}-${idx}`} style={{ flexShrink: 0 }}>
              <button onClick={() => {
                if (item.isProfile) {
                  if (onTabChange) onTabChange(item.profileName);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                } else {
                  if (!isCurrentlyHome && onTabChange) {
                    onTabChange(homeProfile?.name || 'HOME');
                    setTimeout(() => scrollTo(item.id), 150);
                  } else {
                    scrollTo(item.id);
                  }
                }
              }} style={{
                background: "transparent", border: "none", color: "#fff", fontSize: '13px',
                fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase",
                padding: "5px 10px", cursor: "pointer",
                fontFamily: "inherit", transition: "color 0.3s",
                whiteSpace: 'nowrap'
              }}
                onMouseEnter={e => (e.currentTarget.style.color = primaryColor)}
                onMouseLeave={e => (e.currentTarget.style.color = "#fff")}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .nav-links::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .nav-logo { font-size: 1.1rem !important; margin-right: 15px; }
          .nav-links {
            padding-bottom: 5px !important;
          }
          .nav-links li button {
            padding: 5px 8px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </nav>
  );
};

// ─── Countdown Timer ────────────────────────────────────────────────────────
const CountdownTimer = ({ colors }: { colors: any }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 5,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unitStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '8px',
    borderRadius: '10px',
    minWidth: '70px',
    border: '1px solid rgba(255,255,255,0.2)'
  };

  const valStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: 700,
    color: colors.white,
    lineHeight: 1
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: colors.primary,
    marginTop: '2px'
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
      <div style={unitStyle}>
        <span style={valStyle}>{timeLeft.days}</span>
        <span style={labelStyle}>Days</span>
      </div>
      <div style={unitStyle}>
        <span style={valStyle}>{timeLeft.hours}</span>
        <span style={labelStyle}>Hours</span>
      </div>
      <div style={unitStyle}>
        <span style={valStyle}>{timeLeft.minutes}</span>
        <span style={labelStyle}>Minutes</span>
      </div>
      <div style={unitStyle}>
        <span style={valStyle}>{timeLeft.seconds}</span>
        <span style={labelStyle}>Secs</span>
      </div>
    </div>
  );
};

// ─── Section Components ──────────────────────────────────────────────────────
const Container = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", ...style }}>{children}</div>
);

const HomeHero = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const slide = data?.slides?.[0] || {};
  const dt = data?.dateTimeSettings || {};
  
  const updateSlide = (field: string, value: string) => {
    const newSlides = [...(data.slides || [{ id: 1 }])];
    newSlides[0] = { ...newSlides[0], [field]: value };
    onUpdate({ slides: newSlides });
  };

  return (
    <section id="home" style={{
      background: `linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.65)), url('${slide.images?.[0] || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600'}') center/cover no-repeat fixed`,
      height: "75vh", display: "flex", alignItems: "center", color: colors.white, textAlign: "center", position: 'relative'
    }}>
      <Container>
        {!isReadOnly && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
            <button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newSlides = [...(data.slides || [{ id: 1 }])];
                      newSlides[0].images = [reader.result as string];
                      onUpdate({ slides: newSlides });
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              style={{ background: colors.primary, color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}
            >
              CHANGE BACKGROUND
            </button>
          </div>
        )}
        <EditableText 
          tagName="h3" text={dt.eventDate ? formatDate(dt.eventDate) : 'October 15, 2026'} isReadOnly={isReadOnly}
          onUpdate={(val: string) => onUpdate({ dateTimeSettings: { ...dt, eventDate: val } })}
          style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '3px', marginBottom: '15px', textTransform: 'uppercase', color: colors.primary }}
        />
        <EditableText 
          tagName="h1" text={slide.title || 'The Global Tech Innovation Summit'} isReadOnly={isReadOnly}
          onUpdate={(val: string) => updateSlide('title', val)}
          style={{ fontSize: '52px', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '20px', lineHeight: '1.2', textTransform: 'uppercase' }}
        />
        <EditableText 
          tagName="p" text={slide.subtitle || 'Join 500+ industry leaders for the most influential technology conference.'} isReadOnly={isReadOnly}
          onUpdate={(val: string) => updateSlide('subtitle', val)}
          style={{ fontSize: '16px', maxWidth: '700px', margin: '0 auto 30px', color: '#eee', lineHeight: '1.5' }}
        />
        
        <div style={{ display: "flex", gap: '15px', justifyContent: "center", marginBottom: '30px' }}>
          <button style={{ ...btnBase, background: colors.primary, borderColor: colors.primary, color: "#fff", padding: '12px 30px' }}>SECURE YOUR SEAT</button>
          <button style={{ ...btnBase, background: "transparent", color: "#fff", padding: '12px 30px' }}>VIEW SCHEDULE</button>
        </div>

        <CountdownTimer colors={colors} />
      </Container>
    </section>
  );
};

const WhyAttend = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const highlights = data?.highlights || [
    { title: 'Expert Speakers', desc: 'Learn from the best in the industry.' },
    { title: 'Hands-on Workshops', desc: 'Practical sessions to sharpen your skills.' },
    { title: 'Networking', desc: 'Connect with like-minded professionals.' }
  ];

  const updateHighlight = (idx: number, field: string, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[idx] = { ...newHighlights[idx], [field]: value };
    onUpdate({ highlights: newHighlights });
  };

  return (
    <section id="whyattend" style={{ padding: "60px 0", background: colors.white }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '60px', alignItems: "center" }}>
          <div>
            <h3 style={{ color: colors.primary, fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>About The Event</h3>
            <EditableText 
              tagName="h2" text={data?.title || 'Why Attend This Event?'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => onUpdate({ title: val })}
              style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px', color: colors.dark2, lineHeight: 1.2 }}
            />
            <EditableText 
              tagName="p" text={data?.description || 'Join us for an unforgettable experience filled with learning and networking.'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => onUpdate({ description: val })}
              style={{ 
                color: colors.textGrey, fontSize: '14px', lineHeight: '1.6', marginBottom: '30px',
                display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}
            />
            <div style={{ display: 'grid', gap: '20px' }}>
              {highlights.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ 
                    flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px', 
                    background: `${colors.primary}15`, color: colors.primary, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <EditableText 
                        tagName="h4" text={item.title} isReadOnly={isReadOnly}
                        onUpdate={(val: string) => updateHighlight(i, 'title', val)}
                        style={{ fontSize: '16px', fontWeight: 700, color: colors.dark2, marginBottom: '3px' }}
                      />
                      <EditableText 
                        tagName="p" text={item.desc} isReadOnly={isReadOnly}
                        onUpdate={(val: string) => updateHighlight(i, 'desc', val)}
                        style={{ 
                          color: colors.textGrey, fontSize: '14px', lineHeight: 1.4,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', top: '-15px', left: '-15px', right: '15px', bottom: '15px', 
              border: `2px solid ${colors.primary}`, borderRadius: '20px', zIndex: 0 
            }}></div>
            <EditableImage 
              src={data?.image || "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800"} 
              isReadOnly={isReadOnly}
              onUpdate={(val: string) => onUpdate({ image: val })}
              style={{ width: "100%", borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1, objectFit: 'cover', height: '400px' }} 
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

const Speakers = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const items = data?.items || [];
  
  const updateSpeaker = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ ...data, items: newItems });
  };

  return (
    <section id="speakers" style={{ background: colors.lightBg, padding: "60px 0", textAlign: "center" }}>
      <Container>
        <h3 style={{ color: colors.primary, fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Meet Our Experts</h3>
        <EditableText 
          tagName="h2" text={data?.title || 'Creative Speakers'} isReadOnly={isReadOnly}
          onUpdate={(val: string) => onUpdate({ ...data, title: val })}
          style={{ fontSize: '36px', fontWeight: 800, textTransform: "uppercase", marginBottom: '10px', color: colors.dark2 }}
        />
        <EditableText 
          tagName="p" text={data?.subtitle || 'Meet the industry experts sharing their knowledge.'} isReadOnly={isReadOnly}
          onUpdate={(val: string) => onUpdate({ ...data, subtitle: val })}
          style={{ color: colors.textGrey, marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', fontSize: '15px', lineHeight: '1.5' }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: '25px' }}>
          {items.map((sp: any, i: number) => (
            <div key={i} className="speaker-card" style={{ background: colors.white, padding: '15px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', transition: 'all 0.4s ease', textAlign: 'center', width: '100%', maxWidth: '260px' }}>
              <div style={{ overflow: 'hidden', borderRadius: '15px', height: '240px', marginBottom: '15px', position: 'relative' }}>
                <EditableImage 
                  src={sp.image || sp.img || 'https://via.placeholder.com/400x400'} 
                  isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSpeaker(i, 'image', val)}
                  style={{ width: "100%", height: "100%", objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  className="speaker-img" 
                />
              </div>
              <EditableText 
                tagName="h3" text={sp.name} isReadOnly={isReadOnly}
                onUpdate={(val: string) => updateSpeaker(i, 'name', val)}
                style={{ fontSize: '18px', fontWeight: 700, marginBottom: '3px', color: colors.dark2 }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                <EditableText 
                  tagName="span" text={sp.role} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSpeaker(i, 'role', val)}
                  style={{ color: colors.primary, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}
                />
                {sp.company && <span style={{ color: colors.textGrey, fontSize: '13px' }}>@</span>}
                <EditableText 
                  tagName="span" text={sp.company || ''} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSpeaker(i, 'company', val)}
                  style={{ color: colors.textGrey, fontSize: '13px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const Sessions = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const items = data?.items || [];
  
  const updateSession = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ ...data, items: newItems });
  };

  return (
    <section id="sessions" style={{ padding: "60px 0", background: colors.white }}>
      <Container>
        <h3 style={{ color: colors.primary, fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>Event Schedule</h3>
        <EditableText 
          tagName="h2" text={data?.title || 'Agenda & Sessions'} isReadOnly={isReadOnly}
          onUpdate={(val: string) => onUpdate({ ...data, title: val })}
          style={{ fontSize: '36px', fontWeight: 800, textTransform: "uppercase", textAlign: "center", marginBottom: '40px', color: colors.dark2 }}
        />
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {items.map((item: any, i: number) => (
            <div key={i} style={{ 
              display: "flex", 
              gap: '30px', 
              marginBottom: '20px', 
              padding: '25px', 
              background: colors.lightBg, 
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              transition: 'all 0.3s ease'
            }} className="session-item">
              <div style={{ width: '120px', flexShrink: 0, textAlign: 'center', borderRight: `2px solid ${colors.primary}`, paddingRight: '20px' }}>
                <EditableText 
                  tagName="span" text={item.time} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSession(i, 'time', val)}
                  style={{ fontSize: '18px', fontWeight: 800, color: colors.dark2, display: 'block' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <EditableText 
                  tagName="h3" text={item.title} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSession(i, 'title', val)}
                  style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: colors.dark2 }}
                />
                <EditableText 
                  tagName="p" text={item.desc} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSession(i, 'desc', val)}
                  style={{ 
                    color: colors.textGrey, fontSize: '14px', lineHeight: '1.5', marginBottom: '15px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const Venue = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const bgImg = data?.backgroundImage || '';
  
  return (
    <section id="venue" style={{
      padding: "60px 0", color: colors.white,
      background: bgImg ? `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url('${bgImg}') center/cover no-repeat fixed` : colors.dark,
      position: 'relative'
    }}>
      {!isReadOnly && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
          <button 
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => onUpdate({ ...data, backgroundImage: reader.result as string });
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            style={{ background: colors.primary, color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}
          >
            CHANGE SECTION BG
          </button>
        </div>
      )}
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ color: colors.primary, fontSize: '13px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>The Experience</h3>
          <h2 style={{ fontSize: '36px', fontWeight: 800, textTransform: "uppercase", marginBottom: '15px', lineHeight: '1.2' }}>A World-Class Venue</h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.3fr 0.7fr', 
          gap: '30px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '25px', 
          padding: '20px', 
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ height: '350px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
            <img 
              src={data?.image || 'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?w=1600'} 
              alt="Venue" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', padding: '12px 18px', borderRadius: '12px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '3px' }}>{data?.name || 'Innovation Auditorium'}</h3>
               <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{data?.address || 'San Francisco, CA'}</span>
            </div>
          </div>

          <div style={{ height: '350px', background: '#000', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
             {(data.address || (data.lat && data.lng)) ? (
               <GoogleMapDisplay 
                 apiKey={GOOGLE_MAPS_API_KEY}
                 address={data.address}
                 lat={data.lat}
                 lng={data.lng}
               />
             ) : (
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                  <i className="fas fa-map-marked-alt" style={{ fontSize: '28px', color: colors.primary }}></i>
               </div>
             )}
          </div>
        </div>
      </Container>
    </section>
  );
};

const Gallery = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const items = data?.items || [
    { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800' },
    { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800' },
    { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' }
  ];

  const updateImage = (idx: number, newSrc: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], image: newSrc };
    onUpdate({ items: newItems });
  };

  return (
    <section id="gallery" style={{ padding: "60px 0", background: colors.lightBg }}>
      <Container>
        <h3 style={{ color: colors.primary, fontSize: '14px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px', textAlign: 'center' }}>Moments</h3>
        <h2 style={{ fontSize: '36px', fontWeight: 800, textTransform: "uppercase", textAlign: "center", marginBottom: '40px', color: colors.dark2 }}>Event Gallery</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: '15px' }}>
          {items.map((item: any, i: number) => (
            <div key={i} style={{ borderRadius: '15px', overflow: 'hidden', height: '220px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <EditableImage 
                src={item.image} 
                isReadOnly={isReadOnly}
                onUpdate={(val: string) => updateImage(i, val)}
                style={{ width: "100%", height: "100%", objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const Contact = ({ colors, data, onUpdate, isReadOnly }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean }) => {
  const bgImg = data?.backgroundImage || '';

  return (
    <section id="contact" style={{ 
      padding: "60px 0", 
      background: bgImg ? `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url('${bgImg}') center/cover no-repeat fixed` : colors.navbar, 
      color: colors.navbarText,
      position: 'relative'
    }}>
      {!isReadOnly && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
          <button 
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => onUpdate({ ...data, backgroundImage: reader.result as string });
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            style={{ background: colors.primary, color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}
          >
            CHANGE SECTION BG
          </button>
        </div>
      )}
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: '60px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 700, textTransform: "uppercase", marginBottom: '20px', color: colors.navbarText }}>Get In Touch</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: colors.navbarText, opacity: 0.8, marginBottom: '30px' }}>
              Have any questions? Reach out to us.
            </p>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
               <i className="fas fa-envelope" style={{ color: colors.primary, marginRight: '12px' }}></i>
               <EditableText 
                 tagName="span" text={data?.email || 'contact@eventbuilder.com'} isReadOnly={isReadOnly}
                 onUpdate={(val: string) => onUpdate({ ...data, email: val })}
                 style={{ color: colors.navbarText, fontSize: '14px' }}
               />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
               <i className="fas fa-phone" style={{ color: colors.primary, marginRight: '12px' }}></i>
               <EditableText 
                 tagName="span" text={data?.phone || '+1 (234) 567-890'} isReadOnly={isReadOnly}
                 onUpdate={(val: string) => onUpdate({ ...data, phone: val })}
                 style={{ color: colors.navbarText, fontSize: '14px' }}
               />
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: "30px", borderRadius: '20px', color: '#1e293b', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#1e293b' }}>Message Us</h3>
            <input type="text" placeholder="Full Name" style={inputStyle} />
            <input type="email" placeholder="Email Address" style={inputStyle} />
            <textarea placeholder="Your Message" rows={3} style={{ ...inputStyle, resize: 'none' }} />
            <button style={{ 
              background: colors.primary, 
              color: '#fff', 
              padding: '12px 30px', 
              border: 'none', 
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              fontSize: '14px'
            }}>SEND MESSAGE</button>
          </div>
        </div>
      </Container>
    </section>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', marginBottom: '20px', padding: '12px 15px', border: '1px solid #eee', borderRadius: '8px', background: '#f8fafc', fontFamily: 'inherit', color: '#1e293b'
};

const btnBase: React.CSSProperties = {
  padding: "15px 40px", fontSize: "14px", fontWeight: 700,
  letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", borderRadius: "10px",
  transition: "all 0.3s ease", border: "2px solid #fff", fontFamily: "inherit"
};

import GetInTouchSection from './GetInTouchSection';
import Footer from '../Footer';

import { 
  MediaTextSection, 
  MediaGroupSection, 
  NumberCounterSection, 
  TestimonialsSection, 
  CountdownSection, 
  TextSection, 
  ListSection, 
  EmbedWidgetSection,
  SponsorsSection,
  SponsorCategorySection,
  FloorPlanSection,
  CustomHTMLSection
} from './ContentSections';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ThemeOne({ 
  data, 
  themeConfig, 
  isReadOnly, 
  onUpdateSection, 
  profiles, 
  onTabChange,
  footerData, 
  onUpdateFooter,
  onMoveUp,
  onMoveDown,
  onDelete,
  onAddClick
}: ThemeOneProps) {
  const colors = getColors(themeConfig);
  const [settingsSection, setSettingsSection] = useState<{ id: string, type: string, data: any } | null>(null);

  const renderThemeSection = (section: any, index: number) => {
    const isFirst = index === 0;
    const isLast = index === (data?.sections?.length || 0) - 1;

    let SectionComponent: any = null;
    let settingsMode: SettingsMode = 'NONE';
    let isThemed = true;

    switch (section.type) {
      case 'HERO': SectionComponent = HomeHero; settingsMode = 'HERO'; break;
      case 'WHY_ATTEND': SectionComponent = WhyAttend; settingsMode = 'SECTION'; break;
      case 'SPEAKERS': SectionComponent = Speakers; settingsMode = 'SPEAKER'; break;
      case 'SESSIONS': 
      case 'AGENDA': SectionComponent = Sessions; settingsMode = 'AGENDA'; break;
      case 'GALLERY': SectionComponent = Gallery; settingsMode = 'SECTION'; break;
      case 'VENUE': SectionComponent = Venue; settingsMode = 'VENUE'; break;
      case 'GET_IN_TOUCH': 
      case 'CONTACT': SectionComponent = Contact; settingsMode = 'SECTION'; break;
      
      // Generic Fallbacks
      case 'MEDIA_TEXT': SectionComponent = MediaTextSection; isThemed = false; break;
      case 'MEDIA_GROUP': SectionComponent = MediaGroupSection; isThemed = false; break;
      case 'COUNTER': SectionComponent = NumberCounterSection; isThemed = false; break;
      case 'TESTIMONIALS': SectionComponent = TestimonialsSection; isThemed = false; break;
      case 'COUNTDOWN': SectionComponent = CountdownSection; isThemed = false; break;
      case 'TEXT': SectionComponent = TextSection; isThemed = false; break;
      case 'LIST': SectionComponent = ListSection; isThemed = false; break;
      case 'WIDGET': SectionComponent = EmbedWidgetSection; isThemed = false; break;
      case 'SPONSOR': SectionComponent = SponsorsSection; isThemed = false; break;
      case 'SPONSOR_CATEGORY': SectionComponent = SponsorCategorySection; isThemed = false; break;
      case 'FLOOR_PLAN': SectionComponent = FloorPlanSection; isThemed = false; break;
      case 'CUSTOM_HTML': SectionComponent = CustomHTMLSection; isThemed = false; break;
      default: 
        // Default fallback for any other type to ensure it's visible and editable
        SectionComponent = TextSection; 
        isThemed = false;
        break;
    }

    if (!isThemed) {
      return (
        <SectionComponent 
          key={section.id || index}
          {...{ index, isReadOnly, onMoveUp, onMoveDown, onDelete, onAddClick, isFirst, isLast }}
          data={section.data}
          updateData={(newData: any) => onUpdateSection?.(section.id, newData)}
          themeConfig={{
            primaryColor: colors.primary,
            backgroundColor: colors.white,
            textColor: colors.text
          }}
        />
      );
    }

    return (
      <ThemeSectionWrapper
        key={section.id || index}
        index={index}
        isReadOnly={isReadOnly}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
        onAddClick={onAddClick}
        onSettingsClick={() => setSettingsSection({ ...section, type: settingsMode })}
        isFirst={isFirst}
        isLast={isLast}
      >
        <div className="editable-element" style={{ position: 'relative' }}>
          {!isReadOnly && (
            <div style={{ position: 'absolute', top: '20px', right: '40px', zIndex: 100 }}>
              <EditToolbar onSettingsClick={() => setSettingsSection({ ...section, type: settingsMode })} />
            </div>
          )}
          <SectionComponent 
            colors={colors}
            data={section.data}
            isReadOnly={isReadOnly}
            onUpdate={(newData: any) => onUpdateSection?.(section.id, newData)}
          />
        </div>
      </ThemeSectionWrapper>
    );
  };

  return (
    <div style={{ 
      fontFamily: themeConfig?.fontFamily || "'Inter', sans-serif", 
      background: colors.white, 
      scrollBehavior: 'smooth' 
    }}>
      {/* Font Injections */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Montserrat:wght@400;700&family=Roboto:wght@400;700&family=Poppins:wght@400;700&family=Lora:wght@400;700&family=Merriweather:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Oswald:wght@400;700&family=Raleway:wght@400;700&family=Nunito:wght@400;700&family=Ubuntu:wght@400;700&family=PT+Serif:wght@400;700&family=Bebas+Neue&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <Navbar 
        primaryColor={colors.primary} 
        isReadOnly={isReadOnly} 
        logo={data?.sections?.find((s: any) => s.type === 'HERO')?.data?.logo} 
        profiles={profiles}
        onTabChange={onTabChange}
        sections={data?.sections}
        onUpdateLogo={(newLogo) => {
          const hero = data?.sections?.find((s: any) => s.type === 'HERO');
          if (hero) onUpdateSection?.(hero.id, { ...hero.data, logo: newLogo });
        }}
      />
      
      {(data?.sections && data.sections.length > 0) ? (
        data.sections.map((section: any, index: number) => renderThemeSection(section, index))
      ) : (
        <div style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>
           {!isReadOnly && (
             <button 
               onClick={() => onAddClick?.(0)}
               className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
             >
               + Start Building with Theme One
             </button>
           )}
        </div>
      )}
      
      <Footer 
        profiles={profiles} 
        data={footerData} 
        updateData={onUpdateFooter} 
        isReadOnly={isReadOnly} 
        themeConfig={themeConfig}
      />

      {/* Global Settings Panel for ThemeOne Sections */}
      {settingsSection && (
        <SettingsPanel 
          isOpen={!!settingsSection}
          onClose={() => setSettingsSection(null)}
          mode={settingsSection.type as SettingsMode}
          data={settingsSection.data}
          updateData={(newData) => {
            onUpdateSection?.(settingsSection.id, newData);
            setSettingsSection({ ...settingsSection, data: { ...settingsSection.data, ...newData } });
          }}
        />
      )}

      {/* FontAwesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        [contenteditable]:hover { outline: 1.5px dashed ${colors.primary}; outline-offset: 4px; border-radius: 4px; }
        [contenteditable]:focus { outline: 2px solid ${colors.primary}; outline-offset: 4px; border-radius: 4px; background: rgba(255,255,255,0.05); }

        /* ThemeOne Mobile Responsiveness */
        @media (max-width: 768px) {
          h1 { font-size: 42px !important; }
          h2 { font-size: 32px !important; }
          section { padding: 60px 0 !important; }
          .hero-section { height: auto !important; min-height: 100vh; padding: 120px 0 !important; }
          .nav-links { display: none !important; }
          
          /* Why Attend Grid */
          #whyattend > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          #whyattend > div > div > div:last-child {
            order: -1;
          }

          /* Sessions Flex */
          .session-item {
            flex-direction: column !important;
            gap: 20px !important;
            padding: 30px !important;
          }
          .session-item > div:first-child {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 2px solid ${colors.primary};
            padding-right: 0 !important;
            padding-bottom: 20px !important;
            text-align: left !important;
          }

          /* Venue Grid */
          #venue > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          .venue-hero-img {
            height: 350px !important;
          }

          /* Contact Grid */
          #contact > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}

const socialStyle: React.CSSProperties = {
  display: 'inline-flex', width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', margin: '0 8px', color: '#64748b', textDecoration: 'none', transition: '0.3s'
};
