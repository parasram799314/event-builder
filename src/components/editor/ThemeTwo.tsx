"use client";

import React, { useState, useEffect } from "react";
import GoogleMapDisplay from './GoogleMapDisplay';

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

import EditToolbar from './EditToolbar';
import SettingsPanel, { SettingsMode } from './SettingsPanel';
import ButtonEditorModal from './ButtonEditorModal';
import Footer from '../Footer';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ThemeTwoProps {
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
  forceMobile?: boolean;
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
  isLast,
  forceMobile
}: any) => {
  if (isReadOnly) return <>{children}</>;

  const showControlsClass = forceMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100";

  return (
    <div className={`group relative border-y-2 border-transparent hover:border-indigo-500/50 transition-all duration-300 my-2 ${forceMobile ? 'is-mobile-editor' : ''}`}>
      {/* Add Section Button Above */}
      {isFirst && (
        <div className={`absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-center transition-all z-[9999] h-10 pointer-events-none ${showControlsClass}`}>
          <button 
            onClick={() => onAddClick(index)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-110 hover:bg-indigo-700 transition-all cursor-pointer font-bold text-xs pointer-events-auto border-2 border-white section-control-btn"
          >
            <i className="fas fa-plus"></i> Add Section
          </button>
        </div>
      )}

      {/* Side Controls */}
      <div className={`absolute right-6 top-6 flex flex-col gap-2 transition-all z-[999] ${showControlsClass}`}>
        {!isFirst && (
          <button onClick={() => onMoveUp(index)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-indigo-50 text-slate-700 border border-slate-100 transition-colors section-control-btn">
            <i className="fas fa-arrow-up text-xs"></i>
          </button>
        )}
        {!isLast && (
          <button onClick={() => onMoveDown(index)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-indigo-50 text-slate-700 border border-slate-100 transition-colors section-control-btn">
            <i className="fas fa-arrow-down text-xs"></i>
          </button>
        )}
        <button onClick={() => onSettingsClick()} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-indigo-50 text-slate-700 border border-slate-100 transition-colors section-control-btn">
          <i className="fas fa-cog text-xs"></i>
        </button>
        <button onClick={() => onDelete(index)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-red-50 text-red-500 border border-red-50 transition-colors section-control-btn">
          <i className="fas fa-trash-alt text-xs"></i>
        </button>
      </div>

      {children}

      {/* Add Section Button Below */}
      <div className={`absolute bottom-0 left-0 right-0 translate-y-1/2 flex items-center justify-center transition-all z-[9999] h-10 pointer-events-none ${showControlsClass}`}>
        <button 
          onClick={() => onAddClick(index + 1)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-110 hover:bg-indigo-700 transition-all cursor-pointer font-bold text-xs pointer-events-auto border-2 border-white section-control-btn"
        >
          <i className="fas fa-plus"></i> Add Section
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

const EditableButton = ({ 
  label, 
  link, 
  onUpdate, 
  isReadOnly, 
  style 
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isReadOnly) {
      if (link) window.open(link, '_blank');
      return;
    }
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {!isReadOnly && (
          <div style={{
            position: 'absolute', top: '-15px', right: '-15px', background: '#4361ee',
            color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', zIndex: 5,
            fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer'
          }} onClick={() => setIsModalOpen(true)}>
            Edit
          </div>
        )}
        <button 
          className="hero-cta" 
          onClick={handleClick}
          style={{ ...style, cursor: 'pointer' }}
        >
          {label}
        </button>
      </div>
      
      {!isReadOnly && (
        <ButtonEditorModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          buttonData={{ label, link: link || '' }}
          onSave={(newLabel, newLink) => {
            onUpdate({ label: newLabel, link: newLink });
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

const EditableImage = ({ 
  src, 
  onUpdate, 
  isReadOnly, 
  style, 
  className = "",
  containerStyle = {}
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
    <div style={{ position: 'relative', cursor: isReadOnly ? 'default' : 'pointer', ...containerStyle }} onClick={triggerUpload}>
      {!isReadOnly && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)',
          color: '#fff', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', zIndex: 5
        }}>
          CHANGE
        </div>
      )}
      <img src={src} alt="Editable" style={style} className={className} />
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getColors = (themeConfig: any) => {
  const primary = themeConfig?.primaryColor || "#6366f1";
  const bg = themeConfig?.backgroundColor || "#0a0a0c";
  const text = themeConfig?.textColor || "#ffffff";
  const nav = themeConfig?.navbarColor || "#0a0a0c";
  const navText = themeConfig?.navbarTextColor || "#ffffff";

  return {
    primary,
    background: bg,
    text,
    dark: nav,
    dark2: text === "#ffffff" ? "#000000" : text,
    lightBg: bg === "#ffffff" ? "#f9f9f9" : `${bg}dd`,
    white: bg === "#0a0a0c" ? "#121214" : bg,
    accent: primary,
    textGrey: text === "#ffffff" ? "#94a3b8" : "#64748b",
    midGrey: "#808080",
    lightGrey: "#f0f0f0",
    navbar: nav,
    navbarText: navText,
    border: 'rgba(255,255,255,0.1)'
  };
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "speakers", label: "Speakers" },
  { id: "schedule", label: "Schedule" },
  { id: "venue", label: "Venue" },
  { id: "contact", label: "Contact" }
];

const Navbar = ({ colors, isReadOnly, logo, profiles, onTabChange, sections, onUpdateLogo }: { colors: any; isReadOnly?: boolean; logo?: string; profiles?: any[]; onTabChange?: (tab: string) => void; sections?: any[]; onUpdateLogo?: (newLogo: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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
  const activeSections = homeProfile?.sections || sections || [];
  const sectionLinks = activeSections
    .filter((s: any) => s.isVisible !== false && s.type)
    .map((s: any) => {
      const type = s.type === 'GET_IN_TOUCH' ? 'CONTACT' : s.type;
      const label = type.replace(/_/g, ' ');
      // Normalize ID to match the component IDs
      let id = (s.id || type.toLowerCase()).replace(/_/g, '');
      if (id === 'hero') id = 'home';
      if (id === 'sessions' || id === 'agenda') id = 'schedule';
      if (id === 'whyattend') id = 'about';
      if (id === 'contact' || id === 'getintouch') id = 'contact';

      return { id, label: label.toUpperCase(), isSection: true, profileName: homeProfile?.name || 'HOME' };
    });

  // 2. Get profile links (other than home)
  const otherPageLinks = (profiles && profiles.length > 1) 
    ? profiles
      .filter(p => p.isVisible !== false && p.id !== homeProfile?.id)
      .map(p => ({ id: p.id, label: p.name.toUpperCase(), isProfile: true, profileName: p.name }))
    : [];

  const navItems = [...sectionLinks, ...otherPageLinks];

  return (
    <nav 
      className="theme-navbar"
      style={{
        position: isReadOnly ? "fixed" : "sticky", 
        top: 0, left: 0, right: 0, zIndex: 9999,
        background: (scrolled || !isReadOnly || menuOpen) ? colors.navbar : "transparent",
        backdropFilter: "blur(20px)",
        padding: (scrolled || menuOpen) ? "8px 0" : "12px 0",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        borderBottom: (scrolled || !isReadOnly || menuOpen) ? `1px solid ${colors.border}` : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.03)" : "none",
        height: (scrolled || menuOpen) ? '60px' : '72px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div 
        className="nav-container"
        style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: '100%', width: '100%' }}
      >
        <div 
          className="nav-logo" 
          style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', position: 'relative', gap: '15px', zIndex: 1001 }}
        >
          <div onClick={(e) => { 
            if (isReadOnly) { e.preventDefault(); 
              if (!isCurrentlyHome && onTabChange) onTabChange(homeProfile?.name || 'HOME');
              setTimeout(() => scrollTo("home"), 100);
            }
            else triggerLogoUpload();
          }} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
            {logo ? (
              <img src={logo} alt="Logo" style={{ height: '40px', maxWidth: '120px', objectFit: 'contain' }} />
            ) : (
              <div 
                style={{ color: (scrolled || !isReadOnly || menuOpen) ? colors.navbarText : colors.text, fontWeight: 800, fontSize: "1.8rem", letterSpacing: '-1px', fontFamily: "inherit", outline: 'none' }}
                contentEditable={!isReadOnly}
                suppressContentEditableWarning
                onClick={(e) => !isReadOnly && e.stopPropagation()}
              >
                Event<span style={{ color: colors.primary }}>.</span>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Icon - Far Right */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: (scrolled || !isReadOnly || menuOpen) ? colors.navbarText : colors.text,
            fontSize: '22px',
            cursor: 'pointer',
            padding: '5px',
            zIndex: 1001
          }}
          className="mobile-menu-btn"
        >
          <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} style={{ 
          display: "flex", 
          gap: '40px', 
          listStyle: "none", 
          margin: 0, 
          padding: 0,
          transition: 'all 0.3s ease'
        }}>
          {navItems.map((item, idx) => (
            <li key={`${item.id}-${idx}`}>
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
                setMenuOpen(false);
              }} style={{
                background: "transparent", border: "none", color: (scrolled || !isReadOnly || menuOpen) ? colors.navbarText : colors.text, fontSize: '12px',
                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px',
                padding: "8px 0", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = colors.primary)}
                onMouseLeave={e => (e.currentTarget.style.color = (scrolled || !isReadOnly || menuOpen) ? colors.navbarText : colors.text)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-logo { font-size: 1.3rem !important; }
          .mobile-menu-btn { display: block !important; }
          .nav-links {
            position: absolute !important;
            top: 70px !important;
            right: 20px !important;
            left: auto !important;
            bottom: auto !important;
            background: ${colors.navbar} !important;
            backdrop-filter: blur(20px) !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: stretch !important;
            gap: 0 !important;
            padding: 10px 0 !important;
            width: 220px !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
            border: 1px solid ${colors.border} !important;
            transform: translateY(10px);
            opacity: 0;
            pointer-events: none;
            z-index: 1000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .nav-links.open {
            display: flex !important;
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .nav-links li {
            width: 100%;
          }
          .nav-links li button {
            width: 100%;
            padding: 12px 24px !important;
            text-align: left !important;
            font-size: 14px !important;
            color: ${colors.navbarText} !important;
            border-bottom: 1px solid ${colors.border} !important;
            letter-spacing: 1px !important;
          }
          .nav-links li:last-child button {
            border-bottom: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

// ─── Section Components ──────────────────────────────────────────────────────
const Container = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 30px", ...style }}>{children}</div>
);

const Hero = ({ colors, data, onUpdate, isReadOnly, isMounted }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isMounted: boolean }) => {
  const heroImage = data?.slides?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600';
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'October 24 - 26, 2026';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section id="home" className="hero-section" style={{
      background: colors.background,
      minHeight: "70vh", display: "flex", position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle Background Pattern for text area */}
      <div className="hero-pattern" style={{ 
        position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', 
        backgroundImage: `radial-gradient(${colors.primary}15 1.5px, transparent 1.5px)`,
        backgroundSize: '48px 48px', opacity: 0.6, zIndex: 0
      }} />

      <div className="hero-flex" style={{ display: 'flex', width: '100%', alignItems: 'stretch', minHeight: '70vh' }}>
        {/* Left Side: Content - Perfect 50% Balance */}
        <div className="hero-content-wrapper" style={{ flex: '1', display: 'flex', alignItems: 'center', padding: '100px 5% 100px 8%', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '100%' }}>
            <div className="hero-date-badge" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '48px' }}>
               <span style={{ width: '64px', height: '1.5px', background: colors.primary }}></span>
               <EditableText 
                 tagName="span" text={isMounted ? (formatDate(data?.dateTimeSettings?.eventDate) || 'October 24 - 26, 2026') : 'October 24 - 26, 2026'} isReadOnly={isReadOnly}
                 onUpdate={(val: string) => onUpdate({ dateTimeSettings: { ...data.dateTimeSettings, eventDate: val } })}
                 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: colors.primary, whiteSpace: 'nowrap' }}
               />
               <span style={{ width: '64px', height: '1.5px', background: colors.primary }}></span>
            </div>
            
            <EditableText 
              tagName="h1" text={data?.slides?.[0]?.title || 'Global Leadership Summit 2026'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => {
                 const newSlides = [...(data.slides || [{ id: 1 }])];
                 newSlides[0].title = val;
                 onUpdate({ slides: newSlides });
              }}
              className="hero-title"
              style={{ fontSize: 'clamp(56px, 6.5vw, 100px)', fontWeight: 800, lineHeight: 0.9, marginBottom: '44px', color: colors.text, fontFamily: "inherit", letterSpacing: '-5px' }}
            />
            
            <EditableText 
              tagName="p" text={data?.slides?.[0]?.subtitle || 'Experience the pinnacle of innovation. Join world-class visionaries for an exclusive exploration into strategic excellence and groundbreaking insights.'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => {
                 const newSlides = [...(data.slides || [{ id: 1 }])];
                 newSlides[0].subtitle = val;
                 onUpdate({ slides: newSlides });
              }}
              style={{ 
                fontSize: '22px', color: colors.textMuted, marginBottom: '64px', lineHeight: 1.6, maxWidth: '600px', fontWeight: 400,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}
            />
            
            <div className="hero-cta-group" style={{ display: "flex", gap: '32px', alignItems: 'center' }}>
              <EditableButton 
                label={data?.slides?.[0]?.button?.label || 'Secure Your Invitation'} 
                link={data?.slides?.[0]?.button?.link}
                onUpdate={(btn: any) => {
                   const newSlides = [...(data.slides || [{ id: 1 }])];
                   newSlides[0].button = btn;
                   onUpdate({ slides: newSlides });
                }}
                isReadOnly={isReadOnly}
                style={{ ...btnBase, background: colors.text, color: colors.white, padding: '28px 64px', boxShadow: '0 30px 60px rgba(15,23,42,0.18)', fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase' }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Image - Luxury Inset Layout */}
        <div className="hero-image-wrapper" style={{ flex: '1', position: 'relative', overflow: 'visible', padding: '100px 40px 80px 0' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '60px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
            <EditableImage 
              src={heroImage} isReadOnly={isReadOnly}
              onUpdate={(val: string) => {
                 const newSlides = [...(data.slides || [{ id: 1 }])];
                 newSlides[0].images = [val];
                 onUpdate({ slides: newSlides });
              }}
              containerStyle={{ height: '100%', width: '100%' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Decorative Overlay for Image - Elite Positioning */}
          <div className="hero-stats-card" style={{ 
            position: 'absolute', bottom: '15%', left: '0', 
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(25px)', 
            padding: '48px 56px', borderRadius: '48px', boxShadow: '0 50px 100px rgba(0,0,0,0.18)', 
            textAlign: 'center', minWidth: '300px', zIndex: 10,
            border: '1px solid rgba(255,255,255,0.9)'
          }}>
             <div style={{ fontSize: '56px', fontWeight: 800, color: colors.primary, fontFamily: "inherit", marginBottom: '8px', lineHeight: 1 }}>50+</div>
             <div style={{ fontSize: '14px', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '3px' }}>Global Visionaries</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = ({ colors, data, onUpdate, isReadOnly }: any) => {
  const highlights = data?.highlights || [
    { title: 'Global Vision', desc: 'Connect with a worldwide community of innovators.' },
    { title: 'Strategic Growth', desc: 'Identify new opportunities for expansion.' }
  ];

  const vPadding = data?.verticalPadding !== undefined ? `${data.verticalPadding}px` : '40px';

  return (
    <section id="about" style={{ padding: `${vPadding} 0`, background: colors.white }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ paddingRight: '40px', paddingBottom: '40px' }}>
              <img 
                src={data?.image || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800"} 
                alt="About"
                style={{ width: '100%', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.08)', height: '600px', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ 
              position: 'absolute', bottom: '0', right: '0', width: '220px', height: '220px',
              background: colors.primary, borderRadius: '60px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', textAlign: 'center', padding: '30px',
              boxShadow: `0 30px 60px ${colors.primary}40`, zIndex: 2
            }}>
              <span style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.2 }}>10 Years of Excellence</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: colors.primary, display: 'block', marginBottom: '20px' }}>Exclusive Insights</span>
            <EditableText 
              tagName="h2" text={data?.title || 'A Decade of Innovation.'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => onUpdate({ title: val })}
              style={{ fontSize: '56px', fontWeight: 700, fontFamily: "inherit", marginBottom: '40px', lineHeight: 1.1, color: colors.text }} 
            />
            <EditableText 
              tagName="p" text={data?.description || 'We believe that great design has the power to change the world. Our mission is to bridge the gap between visionary thinking and tangible reality.'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => onUpdate({ description: val })}
              style={{ 
                fontSize: '20px', color: colors.textMuted, lineHeight: 1.8, marginBottom: '50px', maxWidth: '540px',
                display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }} 
            />
            
            <div style={{ display: 'grid', gap: '30px' }}>
              {highlights.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
                   <div style={{ 
                     width: '50px', height: '50px', borderRadius: '15px', background: '#f8fafc', 
                     display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' 
                   }}>
                     <i className="fas fa-plus" style={{ color: colors.primary, fontSize: '14px' }}></i>
                   </div>
                   <div>
                     <h4 style={{ fontSize: '20px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>{item.title}</h4>
                     <p style={{ 
                       color: colors.textMuted, fontSize: '16px', lineHeight: 1.6,
                       display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                     }}>{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Speakers = ({ colors, data, onUpdate, isReadOnly }: any) => {
  const items = data?.items || [
    { name: 'Sarah Johnson', role: 'CEO, TechFlow', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { name: 'Michael Chen', role: 'Lead Architect, Google', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }
  ];

  const vPadding = data?.verticalPadding !== undefined ? `${data.verticalPadding}px` : '40px';

  const updateSpeaker = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ items: newItems });
  };

  const addSpeaker = () => {
    const newItems = [...items, { name: 'New Speaker', role: 'Speaker Role', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }];
    onUpdate({ items: newItems });
  };

  const deleteSpeaker = (idx: number) => {
    const newItems = items.filter((_: any, i: number) => i !== idx);
    onUpdate({ items: newItems });
  };

  return (
    <section id="speakers" style={{ padding: `${vPadding} 0`, background: colors.surface }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '8px', textTransform: 'uppercase', color: colors.primary, display: 'block', marginBottom: '24px' }}>The Lineup</span>
            <EditableText 
              tagName="h2" text={data?.title || 'Meet Our Visionaries'} isReadOnly={isReadOnly}
              onUpdate={(val: string) => onUpdate({ title: val })}
              style={{ fontSize: '72px', fontWeight: 800, fontFamily: "inherit", marginBottom: '32px', letterSpacing: '-3px', color: colors.text }} 
            />
            <div style={{ width: '80px', height: '2px', background: colors.primary, margin: '0 auto' }}></div>
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: '60px' }}>
          {items.map((sp: any, i: number) => (
            <div key={i} className="premium-speaker-card" style={{ background: '#fff', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', transition: '0.4s ease', position: 'relative', width: '100%', maxWidth: '400px' }}>
              {!isReadOnly && (
                <button 
                  onClick={() => deleteSpeaker(i)}
                  style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
              <div style={{ height: '420px', position: 'relative', overflow: 'hidden' }}>
                <EditableImage 
                  src={sp.img || sp.image} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSpeaker(i, 'image', val)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px', pointerEvents: 'none'
                }}>
                  <div style={{ pointerEvents: 'auto' }}>
                    <div style={{ display: 'flex', gap: '5px', fontSize: '12px', color: colors.primary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>
                      <EditableText tagName="span" text={sp.role || 'Role'} isReadOnly={isReadOnly} onUpdate={(val: string) => updateSpeaker(i, 'role', val)} />
                      {sp.company && <span style={{ color: '#cbd5e1', fontWeight: 400 }}>| {sp.company}</span>}
                    </div>
                    <EditableText tagName="h3" text={sp.name || 'Name'} isReadOnly={isReadOnly} onUpdate={(val: string) => updateSpeaker(i, 'name', val)} style={{ fontSize: '32px', fontWeight: 700, color: '#fff', fontFamily: "inherit", lineHeight: 1.1 }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '40px' }}>
                <EditableText 
                  tagName="p" text={sp.bio || 'Enter a brief biography of the speaker here. Share their expertise and what they bring to the event.'} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSpeaker(i, 'bio', val)}
                  style={{ 
                    color: colors.textMuted, fontSize: '15px', lineHeight: 1.6, marginBottom: '25px',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }} 
                />
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button style={premiumSocialBtn}><i className="fab fa-linkedin-in"></i></button>
                  <button style={premiumSocialBtn}><i className="fab fa-twitter"></i></button>
                </div>
              </div>
            </div>
          ))}

          {!isReadOnly && (
            <button 
              onClick={addSpeaker}
              style={{ 
                background: 'rgba(255,255,255,0.5)', borderRadius: '40px', border: `2px dashed ${colors.border}`, 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                gap: '20px', minHeight: '600px', cursor: 'pointer', color: colors.textMuted, transition: '0.3s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.color = colors.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                 <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
              </div>
              <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Add Speaker</span>
            </button>
          )}
        </div>
      </Container>
      <style jsx>{`
        .premium-speaker-card:hover { transform: translateY(-15px); }
      `}</style>
    </section>
  );
};

const premiumSocialBtn: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '16px', textDecoration: 'none', transition: '0.3s', border: '1px solid #e2e8f0'
};

const Schedule = ({ colors, data, onUpdate, isReadOnly }: any) => {
  const items = data?.items || [];
  const vPadding = data?.verticalPadding !== undefined ? `${data.verticalPadding}px` : '100px';

  const updateEvent = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ items: newItems });
  };

  return (
    <section id="schedule" style={{ padding: `${vPadding} 0`, background: colors.white }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
           <h2 style={{ fontSize: '64px', fontWeight: 800, fontFamily: "inherit", letterSpacing: '-2px' }}>The Agenda</h2>
           <div style={{ width: '60px', height: '2px', background: colors.primary, margin: '24px auto 0' }}></div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {items.map((ev: any, i: number) => (
            <div key={i} className="agenda-item" style={{ 
              background: colors.surface, 
              padding: '60px', 
              borderRadius: '48px', 
              marginBottom: '32px', 
              display: 'flex', 
              gap: '60px', 
              alignItems: 'flex-start', 
              border: `1px solid ${colors.border}`, 
              transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ width: '180px', flexShrink: 0 }}>
                <EditableText tagName="span" text={ev.time} isReadOnly={isReadOnly} onUpdate={(val: string) => updateEvent(i, 'time', val)} style={{ fontSize: '28px', fontWeight: 800, color: colors.primary, display: 'block', fontFamily: "inherit" }} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: colors.textMuted, marginTop: '12px', display: 'block' }}>Local Time</span>
                
                {ev.location && (
                  <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-location-dot" style={{ fontSize: '12px', color: colors.primary }}></i>
                    <EditableText tagName="span" text={ev.location} isReadOnly={isReadOnly} onUpdate={(val: string) => updateEvent(i, 'location', val)} style={{ fontSize: '13px', fontWeight: 600, color: colors.text }} />
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '24px' }}>
                  <EditableText tagName="h3" text={ev.title} isReadOnly={isReadOnly} onUpdate={(val: string) => updateEvent(i, 'title', val)} style={{ fontSize: '36px', fontWeight: 700, fontFamily: "inherit", marginBottom: '16px', color: colors.text, lineHeight: 1.2 }} />
                  {ev.desc && (
                    <EditableText tagName="p" text={ev.desc} isReadOnly={isReadOnly} onUpdate={(val: string) => updateEvent(i, 'desc', val)} style={{ 
                      fontSize: '18px', color: colors.textMuted, lineHeight: 1.7, maxWidth: '700px',
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }} />
                  )}
                </div>
                
                {ev.speaker && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px', padding: '12px 24px', background: '#fff', borderRadius: '20px', width: 'fit-content', border: `1px solid ${colors.border}` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <i className="fas fa-user" style={{ fontSize: '12px' }}></i>
                    </div>
                    <EditableText tagName="span" text={ev.speaker} isReadOnly={isReadOnly} onUpdate={(val: string) => updateEvent(i, 'speaker', val)} style={{ fontSize: '15px', fontWeight: 700, color: colors.text }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
      <style jsx>{`
        .agenda-item:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 40px 80px rgba(0,0,0,0.06); 
          border-color: ${colors.primary}40;
          background: #fff;
        }
      `}</style>
    </section>
  );
};

const Gallery = ({ colors, data, onUpdate, isReadOnly }: any) => {
  const items = data?.items || [
    { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800' },
    { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800' },
    { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' }
  ];

  const vPadding = data?.verticalPadding !== undefined ? `${data.verticalPadding}px` : '40px';

  return (
    <section id="gallery" style={{ padding: `${vPadding} 0`, background: colors.background }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: colors.primary, display: 'block', marginBottom: '20px' }}>Moments</span>
          <h2 style={{ fontSize: '64px', fontWeight: 800, fontFamily: "inherit", marginBottom: '32px', letterSpacing: '-2px' }}>Event Gallery</h2>
          <div style={{ width: '60px', height: '2px', background: colors.primary, margin: '0 auto' }}></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: '30px' }}>
          {items.map((item: any, i: number) => (
            <div key={i} style={{ borderRadius: '40px', overflow: 'hidden', height: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
              <EditableImage 
                src={item.image} 
                isReadOnly={isReadOnly}
                onUpdate={(val: string) => {
                  const newItems = [...items];
                  newItems[i] = { ...newItems[i], image: val };
                  onUpdate({ items: newItems });
                }}
                style={{ width: "100%", height: "100%", objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const Venue = ({ colors, data, onUpdate, isReadOnly }: any) => {
  const bgImg = data?.backgroundImage || '';
  const vPadding = data?.verticalPadding !== undefined ? `${data.verticalPadding}px` : '40px';

  return (
    <section id="venue" style={{ 
      padding: `${vPadding} 0`, 
      background: bgImg ? `linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), url('${bgImg}') center/cover no-repeat fixed` : colors.background, 
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
            style={{ background: colors.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
          >
            CHANGE SECTION BG
          </button>
        </div>
      )}
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
           <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: colors.primary, display: 'block', marginBottom: '20px' }}>The Venue</span>
           <h2 style={{ fontSize: '64px', fontWeight: 800, fontFamily: "inherit", marginBottom: '32px', letterSpacing: '-2px', color: bgImg ? '#fff' : colors.text }}>Exquisite Location</h2>
           <div style={{ width: '60px', height: '2px', background: colors.primary, margin: '0 auto' }}></div>
        </div>

      <div className="venue-container" style={{ borderRadius: '60px', overflow: 'hidden', position: 'relative', height: '750px', boxShadow: '0 50px 100px rgba(0,0,0,0.15)', border: `1px solid ${colors.border}` }}>
        <EditableImage 
          src={data?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600"} isReadOnly={isReadOnly}
          onUpdate={(val: string) => onUpdate({ ...data, image: val })}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        {/* Floating Glassmorphism Info Panel */}
        <div className="venue-info-panel" style={{ 
          position: 'absolute', bottom: '60px', left: '60px', 
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(40px)', 
          padding: '60px', borderRadius: '48px', maxWidth: '520px', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.8)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
             <div style={{ width: '40px', height: '1px', background: colors.primary }}></div>
             <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px', color: colors.primary }}>Guest Experience</span>
          </div>
          
          <EditableText tagName="h2" text={data?.name || 'The Grand Venue'} isReadOnly={isReadOnly} onUpdate={(val: string) => onUpdate({ ...data, name: val })} style={{ fontSize: '48px', fontWeight: 800, fontFamily: "inherit", marginBottom: '24px', color: colors.text, lineHeight: 1.1 }} />
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '32px' }}>
            <i className="fas fa-map-marker-alt" style={{ color: colors.primary, marginTop: '5px' }}></i>
            <EditableText tagName="p" text={data?.address || '123 Elite Market St, San Francisco, CA'} isReadOnly={isReadOnly} onUpdate={(val: string) => onUpdate({ ...data, address: val })} style={{ color: colors.textMuted, fontSize: '18px', lineHeight: 1.6 }} />
          </div>

          <EditableText tagName="p" text={data?.description || 'Our state-of-the-art facility is designed to host the most prestigious events. Featuring panoramic views and luxury amenities.'} isReadOnly={isReadOnly} onUpdate={(val: string) => onUpdate({ ...data, description: val })} style={{ color: colors.textMuted, fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }} />
          
          {(data.address || (data.lat && data.lng)) && (
            <div className="venue-map-wrapper" style={{ borderRadius: '32px', overflow: 'hidden', height: '220px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <GoogleMapDisplay 
                apiKey={GOOGLE_MAPS_API_KEY}
                address={data.address}
                lat={data.lat}
                lng={data.lng}
              />
            </div>
          )}
        </div>

        {/* Decorative Badge */}
        <div style={{ position: 'absolute', top: '60px', right: '60px', width: '120px', height: '120px', background: colors.text, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: '20px', zIndex: 5, transform: 'rotate(-15deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
           <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Facility</span>
        </div>
      </div>
    </Container>
  </section>
  );
};

const Contact = ({ colors, data, onUpdate, isReadOnly }: any) => {
  const bgImg = data?.backgroundImage || '';
  const vPadding = data?.verticalPadding !== undefined ? `${data.verticalPadding}px` : '40px';

  return (
    <section id="contact" style={{ 
      padding: `${vPadding} 0`, 
      background: bgImg ? `linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)), url('${bgImg}') center/cover no-repeat fixed` : colors.text, 
      color: colors.white,
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
            style={{ background: colors.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
          >
            CHANGE SECTION BG
          </button>
        </div>
      )}
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: colors.primary, display: 'block', marginBottom: '24px' }}>Inquiries</span>
            <h2 style={{ fontSize: '56px', fontWeight: 700, fontFamily: "inherit", marginBottom: '40px', lineHeight: 1.1 }}>Let's Connect.</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '60px' }}>
              We are dedicated to providing a premium experience. Reach out for partnership opportunities, media inquiries, or general support.
            </p>
            <div style={{ display: 'grid', gap: '30px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <i className="fas fa-envelope" style={{ color: colors.primary }}></i>
                  </div>
                  <div>
                     <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Email Us</div>
                     <EditableText tagName="div" text={data?.email || 'concierge@summit2026.com'} isReadOnly={isReadOnly} onUpdate={(val: string) => onUpdate({ ...data, email: val })} style={{ fontSize: '18px', fontWeight: 600 }} />
                  </div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <i className="fas fa-phone" style={{ color: colors.primary }}></i>
                  </div>
                  <div>
                     <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Call Us</div>
                     <EditableText tagName="div" text={data?.phone || '+1 (800) ELITE-VIP'} isReadOnly={isReadOnly} onUpdate={(val: string) => onUpdate({ ...data, phone: val })} style={{ fontSize: '18px', fontWeight: 600 }} />
                  </div>
               </div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '60px', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: "inherit" }}>Send a Message</h3>
            <input type="text" placeholder="Your Full Name" style={premiumInput} />
            <input type="email" placeholder="Professional Email" style={premiumInput} />
            <textarea placeholder="How can we assist you?" rows={4} style={{ ...premiumInput, resize: 'none' }} />
            <button style={{ ...btnBase, background: colors.primary, color: '#fff', width: '100%', padding: '20px', marginTop: '10px' }}>INITIALIZE INQUIRY</button>
          </div>
        </div>
      </Container>
    </section>
  );
};

const premiumInput: React.CSSProperties = {
  width: '100%', marginBottom: '24px', padding: '18px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontFamily: 'inherit', fontSize: '15px', outline: 'none'
};

const btnBase: React.CSSProperties = {
  padding: "16px 40px", fontSize: "15px", fontWeight: 700,
  borderRadius: "12px", border: "none", cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontFamily: "inherit"
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ThemeTwo({
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
  onAddClick,
  forceMobile
}: ThemeTwoProps) {

  const colors = getColors(themeConfig);
  const [settingsSection, setSettingsSection] = useState<{ id: string, type: string, data: any } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderThemeSection = (section: any, index: number) => {
    const isFirst = index === 0;
    const isLast = index === (data?.sections?.length || 0) - 1;

    let SectionComponent: any = null;
    let settingsMode: SettingsMode = 'NONE';
    let isThemed = true;

    switch (section.type) {
      case 'HERO': SectionComponent = Hero; settingsMode = 'HERO'; break;
      case 'WHY_ATTEND': SectionComponent = About; settingsMode = 'SECTION'; break;
      case 'SPEAKERS': SectionComponent = Speakers; settingsMode = 'SPEAKER'; break;
      case 'SESSIONS': 
      case 'AGENDA': SectionComponent = Schedule; settingsMode = 'AGENDA'; break;
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
        SectionComponent = TextSection; 
        isThemed = false;
        break;
    }

    if (!isThemed) {
      return (
        <SectionComponent 
          key={section.id || index}
          {...{ index, isReadOnly, isFirst, isLast }}
          onMoveUp={() => onMoveUp?.(index)}
          onMoveDown={() => onMoveDown?.(index)}
          onDelete={() => onDelete?.(index)}
          onAddSection={() => onAddClick?.(index)}
          onAddSectionBelow={() => onAddClick?.(index + 1)}
          data={section.data}
          updateData={(newData: any) => onUpdateSection?.(section.id, newData)}
          themeConfig={{
            primaryColor: colors.primary,
            backgroundColor: colors.background,
            textColor: colors.text
          }}
        />
      );
    }

    const defaultPadding = section.type === 'AGENDA' || section.type === 'SESSIONS' ? 30 : 20;
    const currentPadding = section.data?.verticalPadding !== undefined ? section.data.verticalPadding : defaultPadding;

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
        <SectionComponent 
          colors={colors}
          data={section.data}
          isReadOnly={isReadOnly}
          isMounted={isMounted}
          onUpdate={(newData: any) => onUpdateSection?.(section.id, newData)}
        />
      </ThemeSectionWrapper>
    );
  };

  return (
    <div 
      className={forceMobile ? "is-mobile-preview" : ""}
      style={{
        fontFamily: themeConfig?.fontFamily || "'Inter', sans-serif",
        background: colors.background,
        color: colors.text,
        scrollBehavior: 'smooth',
        '--primary': colors.primary
      } as any}
    >

      {/* Font Injections */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Montserrat:wght@400;700&family=Roboto:wght@400;700&family=Poppins:wght@400;700&family=Lora:wght@400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <Navbar 
        colors={colors} 
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
               className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
             >
               + Start Building with Theme Two
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

      {/* Global Settings Panel for ThemeTwo Sections */}
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

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        [contenteditable]:hover { outline: 1.5px dashed ${colors.primary}; outline-offset: 4px; border-radius: 4px; }
        [contenteditable]:focus { outline: 2px solid ${colors.primary}; outline-offset: 4px; border-radius: 4px; background: rgba(0,0,0,0.02); }

        /* Hero Responsiveness */
        @media (max-width: 1024px) {
          .hero-flex { flex-direction: column; }
          .hero-content-wrapper { padding: 120px 40px 60px !important; flex: none !important; }
          .hero-image-wrapper { height: 500px; flex: none !important; overflow: hidden; }
          .hero-stats-card { left: 40px !important; bottom: 40px !important; }
          .hero-pattern { width: 100% !important; height: 60% !important; }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 48px !important; letter-spacing: -2px !important; }
          .nav-links { display: none !important; }
          .hero-stats-card { padding: 20px !important; min-width: 150px !important; left: 20px !important; bottom: 20px !important; }
          .hero-stats-card div:first-child { font-size: 32px !important; }
        }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-content-wrapper > div {
          animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .hero-stats-card {
          animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards;
          opacity: 0;
        }

        .hero-cta {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .hero-cta:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.2) !important;
          background: ${colors.primary} !important;
        }

        .premium-speaker-card {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-speaker-card:hover {
          transform: translateY(-15px);
        }

        /* ThemeTwo Mobile Responsiveness */
        @media (max-width: 1024px) {
         /* Show section controls on mobile */
          .opacity-0.group-hover\\:opacity-100 {
            opacity: 1 !important;
            visibility: visible !important;
          }
          .pointer-events-none {
            pointer-events: auto !important;
          }
          .section-control-btn {
            background-color: #0f172a !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
          .section-control-btn i {
            color: white !important;
          }

         .hero-flex { flex-direction: column !important; }
         .hero-content-wrapper { padding: 100px 24px 60px !important; flex: none !important; width: 100% !important; text-align: center !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
         .hero-image-wrapper { height: 400px !important; flex: none !important; width: 100% !important; overflow: hidden; padding: 0 !important; }
         .hero-stats-card { left: 50% !important; bottom: 30px !important; transform: translateX(-50%) !important; min-width: 180px !important; }
         .hero-pattern { width: 100% !important; height: 60% !important; }
        }

        @media (max-width: 768px) {
         .mobile-menu-btn { display: block !important; }
         .hero-title { font-size: 36px !important; letter-spacing: -1px !important; line-height: 1.1 !important; text-align: center !important; }
         .hero-subtitle { font-size: 16px !important; text-align: center !important; margin: 0 auto 32px !important; max-width: 100% !important; }
         .nav-links { display: none !important; }
         .hero-stats-card { padding: 16px !important; min-width: 150px !important; }
         .hero-stats-card div:first-child { font-size: 28px !important; }

         .hero-cta-group { justify-content: center !important; flex-direction: column !important; width: 100% !important; gap: 16px !important; align-items: center !important; }
         .hero-cta { width: auto !important; min-width: 240px !important; max-width: 100% !important; margin: 0 auto !important; display: flex !important; justify-content: center !important; align-items: center !important; padding: 20px 40px !important; font-size: 13px !important; }
         
         .hero-date-badge { justify-content: center !important; margin-bottom: 32px !important; }
         .hero-date-badge span:first-child, .hero-date-badge span:last-child { width: 40px !important; }

         /* About Section */
          #about > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          #about > div > div > div:first-child {
             height: 350px !important;
             margin-bottom: 40px !important;
          }
          #about img {
             height: 350px !important;
             border-radius: 24px !important;
          }
          #about h2 { font-size: 32px !important; margin-bottom: 24px !important; }
          #about p { margin-left: auto !important; margin-right: auto !important; font-size: 16px !important; }
          #about div[style*="position: absolute"] {
            width: 140px !important;
            height: 140px !important;
            border-radius: 30px !important;
            padding: 20px !important;
          }
          #about div[style*="position: absolute"] span { font-size: 14px !important; }

          /* Speakers Grid */
          #speakers > div:first-child { margin-bottom: 60px !important; }
          #speakers h2 { font-size: 40px !important; letter-spacing: -1px !important; }
          #speakers > div > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
            padding: 0 10px !important;
          }
          #speakers button[style*="min-height: 600px"] {
            min-height: 180px !important;
            padding: 40px !important;
          }

          /* Agenda Timeline */
          #schedule > div > div:first-child {
            margin-bottom: 40px !important;
          }
          #schedule h2 {
            font-size: 36px !important;
          }
          .agenda-item {
            flex-direction: column !important;
            gap: 24px !important;
            padding: 30px 24px !important;
            border-radius: 24px !important;
          }
          .agenda-item > div:first-child {
            width: 100% !important;
          }

          /* Gallery Grid */
          #gallery > div:first-child { margin-bottom: 40px !important; }
          #gallery h2 { font-size: 36px !important; }
          #gallery div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          #gallery div[style*="height: 400px"] { height: 300px !important; border-radius: 24px !important; }

          /* Venue Section Styling */
          .venue-container {
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            border-radius: 32px !important;
          }
          .venue-container div:first-child {
            height: 300px !important;
          }
          .venue-info-panel {
            position: relative !important;
            bottom: 0 !important;
            left: 0 !important;
            margin: -60px 20px 40px !important;
            width: calc(100% - 40px) !important;
            max-width: 100% !important;
            padding: 40px 30px !important;
            border-radius: 32px !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important;
          }
          .venue-info-panel h2 {
            font-size: 32px !important;
          }
          .venue-map-wrapper {
            height: 200px !important;
            border-radius: 20px !important;
          }

          /* Contact Section */
          #contact > div > div {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
            text-align: center !important;
          }
          #contact h2 { font-size: 36px !important; }
          #contact p { font-size: 16px !important; }
          #contact div[style*="display: flex"] { justify-content: center !important; }
          #contact div[style*="background: rgba(255,255,255,0.03)"] {
            padding: 40px 24px !important;
            border-radius: 32px !important;
          }
        }

        /* Editor Mobile Preview Support */
        .is-mobile-preview .theme-navbar {
          height: 60px !important;
          background: ${colors.navbar} !important;
        }
        .is-mobile-preview .nav-container {
          padding: 0 20px !important;
          justify-content: space-between !important;
        }
        .is-mobile-preview .mobile-menu-btn {
          display: block !important;
        }
        .is-mobile-preview .nav-logo {
          font-size: 1.3rem !important;
        }
        .is-mobile-preview .opacity-0.group-hover\\:opacity-100 {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .is-mobile-preview .pointer-events-none {
          pointer-events: auto !important;
        }
        .is-mobile-preview .section-control-btn {
          background-color: #0f172a !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .is-mobile-preview .section-control-btn i {
          color: white !important;
        }

        .is-mobile-preview .hero-flex { flex-direction: column !important; }
        .is-mobile-preview .hero-content-wrapper { padding: 100px 24px 60px !important; flex: none !important; width: 100% !important; text-align: center !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
        .is-mobile-preview .hero-image-wrapper { height: 400px !important; flex: none !important; width: 100% !important; overflow: hidden; padding: 0 !important; }
        .is-mobile-preview .hero-stats-card { left: 50% !important; bottom: 30px !important; transform: translateX(-50%) !important; min-width: 180px !important; }
        .is-mobile-preview .hero-pattern { width: 100% !important; height: 60% !important; }
        .is-mobile-preview .hero-title { font-size: 36px !important; letter-spacing: -1px !important; line-height: 1.1 !important; text-align: center !important; }
        .is-mobile-preview .hero-subtitle { font-size: 16px !important; text-align: center !important; margin: 0 auto 32px !important; max-width: 100% !important; }
        .is-mobile-preview .nav-links { display: none !important; }
        .is-mobile-preview .hero-stats-card { padding: 16px !important; min-width: 150px !important; }
        .is-mobile-preview .hero-stats-card div:first-child { font-size: 28px !important; }
        .is-mobile-preview .hero-cta-group { justify-content: center !important; flex-direction: column !important; width: 100% !important; gap: 12px !important; align-items: center !important; }
        .is-mobile-preview .hero-cta { width: 100% !important; max-width: 300px !important; margin: 0 auto !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        .is-mobile-preview #about > div > div { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
        .is-mobile-preview #about > div > div > div:first-child { height: 350px !important; margin-bottom: 40px !important; }
        .is-mobile-preview #about img { height: 350px !important; border-radius: 24px !important; }
        .is-mobile-preview #about h2 { font-size: 32px !important; margin-bottom: 24px !important; }
        .is-mobile-preview #about p { margin-left: auto !important; margin-right: auto !important; font-size: 16px !important; }
        .is-mobile-preview #about div[style*="position: absolute"] { width: 140px !important; height: 140px !important; border-radius: 30px !important; padding: 20px !important; }
        .is-mobile-preview #speakers > div:first-child { margin-bottom: 60px !important; }
        .is-mobile-preview #speakers h2 { font-size: 40px !important; letter-spacing: -1px !important; }
        .is-mobile-preview #speakers > div > div:last-child { grid-template-columns: 1fr !important; gap: 30px !important; padding: 0 10px !important; }
        .is-mobile-preview #speakers button[style*="min-height: 600px"] { min-height: 180px !important; padding: 40px !important; }
        .is-mobile-preview #schedule > div > div:first-child { margin-bottom: 40px !important; }
        .is-mobile-preview #schedule h2 { font-size: 36px !important; }
        .is-mobile-preview .agenda-item { flex-direction: column !important; gap: 24px !important; padding: 30px 24px !important; border-radius: 24px !important; }
        .is-mobile-preview .agenda-item > div:first-child { width: 100% !important; }
        .is-mobile-preview .venue-container { height: auto !important; display: flex !important; flex-direction: column !important; border-radius: 32px !important; }
        .is-mobile-preview .venue-container div:first-child { height: 300px !important; }
        .is-mobile-preview .venue-info-panel { position: relative !important; bottom: 0 !important; left: 0 !important; margin: -60px 20px 40px !important; width: calc(100% - 40px) !important; max-width: 100% !important; padding: 40px 30px !important; border-radius: 32px !important; box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important; }
        .is-mobile-preview .venue-info-panel h2 { font-size: 32px !important; }
        .is-mobile-preview .venue-map-wrapper { height: 200px !important; border-radius: 20px !important; }
        .is-mobile-preview #gallery > div:first-child { margin-bottom: 40px !important; }
        .is-mobile-preview #gallery h2 { font-size: 36px !important; }
        .is-mobile-preview #gallery div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 20px !important; }
        .is-mobile-preview #gallery div[style*="height: 400px"] { height: 300px !important; border-radius: 24px !important; }
        .is-mobile-preview #contact > div > div { grid-template-columns: 1fr !important; gap: 60px !important; text-align: center !important; }
        .is-mobile-preview #contact h2 { font-size: 36px !important; }
        .is-mobile-preview #contact p { font-size: 16px !important; }
        .is-mobile-preview #contact div[style*="display: flex"] { justify-content: center !important; }
        .is-mobile-preview #contact div[style*="background: rgba(255,255,255,0.03)"] { padding: 40px 24px !important; border-radius: 32px !important; }
      `}</style>
    </div>
  );
}

