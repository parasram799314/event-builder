"use client";

import React, { useState, useEffect } from "react";
import GoogleMapDisplay from './GoogleMapDisplay';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
import SettingsPanel, { SettingsMode } from './SettingsPanel';
import FeaturedSessions from './FeaturedSessions';
import SponsorsSection from './SponsorsSection';

import { 
  MediaTextSection, 
  MediaGroupSection, 
  NumberCounterSection, 
  TestimonialsSection, 
  CountdownSection, 
  TextSection, 
  ListSection, 
  EmbedWidgetSection,
  SponsorCategorySection,
  FloorPlanSection,
  CustomHTMLSection,
  MovingLineSection,
  GallerySection
} from './ContentSections';

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
interface ThemeThreeProps {
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
    <div className={`group relative border-y-2 border-transparent hover:border-purple-500/50 transition-all duration-300 ${isFirst ? 'mb-2' : 'my-2'} ${forceMobile ? 'is-mobile-editor' : ''}`}>
      {/* Add Section Button Above */}
      {isFirst && (
        <div className={`absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-center transition-all z-[9999] h-10 pointer-events-none ${showControlsClass}`}>
          <button 
            onClick={() => onAddClick(index)}
            className="bg-purple-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:scale-110 hover:bg-purple-700 transition-all cursor-pointer font-bold text-xs pointer-events-auto border-2 border-white section-control-btn"
          >
            <i className="fas fa-plus"></i> Add Section
          </button>
        </div>
      )}

      {/* Side Controls */}
      <div className={`absolute right-6 top-6 flex flex-col gap-2 transition-all z-[999] ${showControlsClass}`}>
        {!isFirst && (
          <button onClick={() => onMoveUp(index)} className="w-10 h-10 bg-slate-800 shadow-xl rounded-xl flex items-center justify-center hover:bg-slate-700 text-white border border-slate-700 transition-colors section-control-btn">
            <i className="fas fa-arrow-up text-xs"></i>
          </button>
        )}
        {!isLast && (
          <button onClick={() => onMoveDown(index)} className="w-10 h-10 bg-slate-800 shadow-xl rounded-xl flex items-center justify-center hover:bg-slate-700 text-white border border-slate-700 transition-colors section-control-btn">
            <i className="fas fa-arrow-down text-xs"></i>
          </button>
        )}
        <button onClick={() => onSettingsClick()} className="w-10 h-10 bg-slate-800 shadow-xl rounded-xl flex items-center justify-center hover:bg-slate-700 text-white border border-slate-700 transition-colors section-control-btn">
          <i className="fas fa-cog text-xs"></i>
        </button>
        <button onClick={() => onDelete(index)} className="w-10 h-10 bg-slate-800 shadow-xl rounded-xl flex items-center justify-center hover:bg-red-900 text-red-200 border border-red-900 transition-colors section-control-btn">
          <i className="fas fa-trash-alt text-xs"></i>
        </button>
      </div>

      {children}

      {/* Add Section Button Below */}
      <div className={`absolute bottom-0 left-0 right-0 translate-y-1/2 flex items-center justify-center transition-all z-[9999] h-10 pointer-events-none ${showControlsClass}`}>
        <button 
          onClick={() => onAddClick(index + 1)}
          className="bg-purple-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:scale-110 hover:bg-purple-700 transition-all cursor-pointer font-bold text-xs pointer-events-auto border-2 border-white section-control-btn"
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

// ─── Colour tokens ───────────────────────────────────────────────────────────
const getColors = (themeConfig: any) => {
  const primary = themeConfig?.primaryColor || "#a855f7";
  const bg = themeConfig?.backgroundColor || "#0f172a";
  const text = themeConfig?.textColor || "#f8fafc";
  const nav = themeConfig?.navbarColor || "#020617";
  const navText = themeConfig?.navbarTextColor || "#ffffff";

  return {
    primary,
    background: bg,
    text,
    dark: nav,
    lightBg: "#1e293b",
    white: "#ffffff",
    accent: primary,
    textGrey: "#94a3b8",
    navbar: nav,
    navbarText: navText
  };
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ primaryColor, isReadOnly, logo, profiles, onTabChange, sections, onUpdateLogo }: any) => {
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

  const homeProfile = profiles?.find((p: any) => p.isDefault || p.id === 'home') || profiles?.[0];
  const isCurrentlyHome = sections && homeProfile && sections === homeProfile.sections;

  // 1. Get section links - Fallback to current sections if profiles are empty
  const activeSections = homeProfile?.sections || sections || [];
  const sectionLinks = activeSections
    .filter((s: any) => s.isVisible !== false && s.type)
    .map((s: any) => {
      const type = s.type === 'GET_IN_TOUCH' ? 'CONTACT' : s.type;
      const label = type.replace(/_/g, ' ');
      let id = (s.id || type.toLowerCase()).replace(/_/g, ''); 
      if (id === 'hero') id = 'home';
      if (id === 'agenda' || id === 'sessions') id = 'sessions';
      if (id === 'contact' || id === 'getintouch') id = 'contact';
      
      return { id, label: label.toUpperCase(), isSection: true, profileName: homeProfile?.name || 'HOME' };
    });

  // 2. Get profile links (other than home)
  const otherPageLinks = (profiles && profiles.length > 1) 
    ? profiles
      .filter((p: any) => p.isVisible !== false && p.id !== homeProfile?.id)
      .map((p: any) => ({ id: p.id, label: p.name.toUpperCase(), isProfile: true, profileName: p.name }))
    : [];

  const navItems = [...sectionLinks, ...otherPageLinks];

  return (
    <nav style={{
      position: isReadOnly ? "fixed" : "sticky", 
      top: 0, left: 0, right: 0, zIndex: 9999,
      background: (scrolled || !isReadOnly || menuOpen) ? "rgba(2, 6, 23, 0.95)" : "rgba(2, 6, 23, 0.6)", 
      backdropFilter: "blur(12px)",
      padding: (scrolled || menuOpen) ? "8px 0" : "12px 0",
      transition: "all 0.4s ease",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      height: (scrolled || menuOpen) ? '60px' : '72px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: '100%', width: '100%' }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", letterSpacing: '-1px' }}>
          EVENT<span style={{ color: primaryColor }}>X</span>
        </div>

        {/* Hamburger Icon - Far Right */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '5px',
            zIndex: 1001
          }}
          className="mobile-hamburger"
        >
          <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <ul style={{ display: "flex", gap: '32px', listStyle: "none", margin: 0, padding: 0 }} className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item: any, idx: number) => (
            <li key={idx}>
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
                background: "transparent", border: "none", color: "#94a3b8", fontSize: '13px',
                fontWeight: 600, textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s"
              }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        
        <button className="hidden md:block" style={{ 
          background: primaryColor, color: '#fff', border: 'none', padding: '10px 24px', 
          borderRadius: '99px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
          boxShadow: `0 10px 20px ${primaryColor}40`
        }}>
          GET TICKETS
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-hamburger {
            display: block !important;
          }
          .nav-links {
            position: absolute;
            top: 60px;
            right: 24px;
            background: #0f172a;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 0 !important;
            transform: translateY(10px);
            opacity: 0;
            pointer-events: none;
            z-index: 1000;
            width: 220px;
            padding: 10px 0 !important;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .nav-links li {
            width: 100%;
          }
          .nav-links li button {
            font-size: 14px !important;
            padding: 12px 20px !important;
            width: 100%;
            text-align: left;
            color: #fff !important;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .nav-links li:last-child button {
            border-bottom: none;
          }
        }
      `}</style>
    </nav>
  );
};

// ─── Hero ───────────────────────────────────────────────────────────────────
const Hero = ({ colors, data, onUpdate, isReadOnly, isFirst }: any) => {
  const slide = data?.slides?.[0] || {};
  return (
    <section style={{
      height: "70vh", background: "#020617", position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      paddingTop: isFirst ? '0' : undefined
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(circle at 50% 50%, ${colors.primary}15 0%, transparent 70%)`
      }}></div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(48px, 10vw, 84px)', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-4px', marginBottom: '32px' }}>
          {slide.title}
        </h1>
        <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.6 }}>
          {slide.subtitle}
        </p>
        {slide.primaryBtnLink ? (
          <a href={slide.primaryBtnLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{
              background: colors.primary, color: '#fff', border: 'none', padding: '18px 48px',
              borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: 'pointer',
              boxShadow: `0 20px 40px ${colors.primary}40`, transition: 'all 0.3s'
            }}>
              {slide.primaryBtnLabel || 'JOIN THE FUTURE'}
            </button>
          </a>
        ) : (
          <button style={{
            background: colors.primary, color: '#fff', border: 'none', padding: '18px 48px',
            borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: 'pointer',
            boxShadow: `0 20px 40px ${colors.primary}40`, transition: 'all 0.3s'
          }}>
            {slide.primaryBtnLabel || 'JOIN THE FUTURE'}
          </button>
        )}
      </div>
    </section>
  );
};

// ─── Content Sections ────────────────────────────────────────────────────────
const SectionTitle = ({ title, subtitle, colors }: any) => (
  <div style={{ textAlign: 'center', marginBottom: '80px' }}>
    <span style={{ color: colors.primary, fontWeight: 800, fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase' }}>{subtitle}</span>
    <h2 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginTop: '16px' }}>{title}</h2>
  </div>
);

const Speakers = ({ colors, data, isFirst }: any) => (
  <section id="speakers" style={{ background: '#020617', padding: isFirst ? '0 0 40px 0' : '40px 0' }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <SectionTitle title="Visionary Minds" subtitle="Speakers" colors={colors} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
        {data.items?.map((s: any, i: number) => (
          <div key={i} style={{ background: '#0f172a', padding: '32px', borderRadius: '24px', border: '1px solid #1e293b' }}>
            <img src={s.image} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} alt={s.name} />
            <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 800 }}>{s.name}</h3>
            <p style={{ color: colors.primary, fontWeight: 600, fontSize: '14px', marginTop: '8px' }}>{s.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Venue = ({ colors, data, isFirst }: any) => (
  <section id="venue" style={{ background: '#020617', padding: isFirst ? '0 0 40px 0' : '40px 0' }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: 'flex', gap: '80px', alignItems: 'center' }} className="flex-col lg:flex-row">
      <div style={{ flex: 1 }}>
        <SectionTitle title={data.name} subtitle="The Venue" colors={colors} />
        <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 1.8, marginBottom: '32px' }}>{data.description}</p>
        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <i className="fas fa-map-marker-alt" style={{ color: colors.primary, marginRight: '12px' }}></i>
          <span style={{ color: '#fff', fontWeight: 600 }}>{data.address}</span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '20px', bottom: '20px', border: `2px solid ${colors.primary}`, borderRadius: '24px', zIndex: 1 }}></div>
        <img src={data.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'} style={{ width: '100%', borderRadius: '24px', position: 'relative', zIndex: 2 }} alt="Venue" />
      </div>
    </div>
  </section>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ThemeThree({ data, themeConfig, isReadOnly, onUpdateSection, profiles, onTabChange, footerData, onUpdateFooter, onMoveUp, onMoveDown, onDelete, onAddClick, forceMobile }: ThemeThreeProps) {
  const [mounted, setMounted] = useState(false);
  const [settingsSection, setSettingsSection] = useState<any>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const colors = getColors(themeConfig);
  const sections = data?.sections || [];

  return (
    <div style={{ background: colors.background, color: colors.text, minHeight: '100vh', fontFamily: themeConfig?.fontFamily || "'Inter', sans-serif" }} className={forceMobile ? "is-mobile-preview" : ""}>
      <Navbar primaryColor={colors.primary} isReadOnly={isReadOnly} profiles={profiles} onTabChange={onTabChange} sections={sections} />

      {sections.map((section: any, index: number) => {
        let content = null;
        const isFirst = index === 0;
        const isLast = index === sections.length - 1;
        switch (section.type) {
          case 'HERO': content = <Hero colors={colors} data={section.data} onUpdate={(d: any) => onUpdateSection?.(section.id, d)} isReadOnly={isReadOnly} isFirst={isFirst} />; break;
          case 'SPEAKERS': content = <Speakers colors={colors} data={section.data} isReadOnly={isReadOnly} isFirst={isFirst} />; break;
          case 'VENUE': content = <Venue colors={colors} data={section.data} isReadOnly={isReadOnly} isFirst={isFirst} />; break;
          case 'GALLERY': content = <GallerySection {...{ index, isReadOnly, isFirst, isLast }} themeConfig={{ primaryColor: colors.primary, backgroundColor: colors.background, textColor: colors.text }} data={section.data} updateData={(newData: any) => onUpdateSection?.(section.id, newData)} onMoveUp={() => onMoveUp?.(index)} onMoveDown={() => onMoveDown?.(index)} onDelete={() => onDelete?.(index)} onAddSection={() => onAddClick?.(index)} onAddSectionBelow={() => onAddClick?.(index + 1)} />; break;
          case 'SESSIONS': content = <FeaturedSessions colors={colors} data={section.data} isReadOnly={isReadOnly} onUpdate={(d: any) => onUpdateSection?.(section.id, d)} />; break;
          case 'SPONSOR':
          case 'SPONSOR_CATEGORY': content = <SponsorsSection colors={colors} data={section.data} isReadOnly={isReadOnly} onUpdate={(d: any) => onUpdateSection?.(section.id, d)} />; break;
          case 'AGENDA':
          case 'SCHEDULE': content = <div id="sessions"><Speakers colors={colors} data={{...section.data, title: 'Agenda', items: section.data.items?.map((i:any)=>({...i, name: i.title, role: i.time, image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400'}))}} isReadOnly={isReadOnly} /></div>; break;
          case 'CONTACT':
          case 'GET_IN_TOUCH': content = <div id="contact"><Venue colors={colors} data={{...section.data, name: 'Contact Us', address: section.data.email || 'contact@event.com'}} isReadOnly={isReadOnly} /></div>; break;
          default: content = <div id={section.type.toLowerCase().replace(/_/g, '')} style={{ padding: '40px 24px', textAlign: 'center', background: '#0f172a', color: '#64748b', borderBottom: '1px solid #1e293b' }}>{section.type} Section</div>;
        }

        return (
          <ThemeSectionWrapper 
            key={section.id} 
            index={index} 
            isReadOnly={isReadOnly}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            onAddClick={onAddClick}
            onSettingsClick={() => setSettingsSection(section)}
            isFirst={index === 0}
            isLast={index === sections.length - 1}
          >
            {content}
          </ThemeSectionWrapper>
        );
      })}

      {settingsSection && !isReadOnly && (
        <SettingsPanel 
          isOpen={!!settingsSection} 
          onClose={() => setSettingsSection(null)} 
          mode={settingsSection.type as SettingsMode} 
          data={settingsSection.data} 
          updateData={(newData) => onUpdateSection?.(settingsSection.id, newData)} 
        />
      )}

      <footer style={{ background: '#020617', padding: '80px 24px', borderTop: '1px solid #1e293b', textAlign: 'center' }}>
        <div style={{ color: colors.primary, fontWeight: 900, fontSize: '1.5rem', marginBottom: '24px' }}>EVENTX</div>
        <p style={{ color: '#64748b', fontSize: '14px' }}>{footerData?.copyright || '© 2026 EVENTX. ALL RIGHTS RESERVED.'}</p>
      </footer>

      <style jsx global>{`
        /* ThemeThree Mobile Responsiveness */
        @media (max-width: 768px) {
          .mobile-hamburger {
            display: block !important;
          }
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
        }

        /* Support for Mobile Preview in Editor Frame */
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
      `}</style>
    </div>
  );
}
