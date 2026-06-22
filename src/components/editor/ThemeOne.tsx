"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleMapDisplay from './GoogleMapDisplay';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
import EditToolbar from './EditToolbar';
import SettingsPanel, { SettingsMode } from './SettingsPanel';
import { mockAgents, mockCompanies } from "@/lib/mockData";

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
    <div className={`group relative border-y-2 border-transparent hover:border-blue-500/50 transition-all duration-300 ${isFirst ? 'mb-12' : 'my-12'} ${forceMobile ? 'is-mobile-editor' : ''}`}>
      {/* Add Section Button Above */}
      {isFirst && (
        <div className={`absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-center transition-all z-[9999] h-10 pointer-events-none ${showControlsClass}`}>
          <button 
            onClick={() => onAddClick(index)}
            className="bg-blue-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 hover:bg-blue-700 transition-all cursor-pointer font-bold text-xs pointer-events-auto border-2 border-white section-control-btn"
          >
            <i className="fas fa-plus"></i> Add Section
          </button>
        </div>
      )}

      {/* Side Controls */}
      <div className={`absolute right-6 top-6 flex flex-col gap-2 transition-all z-[999] ${showControlsClass}`}>
        {!isFirst && (
          <button onClick={() => onMoveUp(index)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-blue-50 text-slate-700 border border-slate-100 transition-colors section-control-btn">
            <i className="fas fa-arrow-up text-xs"></i>
          </button>
        )}
        {!isLast && (
          <button onClick={() => onMoveDown(index)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-blue-50 text-slate-700 border border-slate-100 transition-colors section-control-btn">
            <i className="fas fa-arrow-down text-xs"></i>
          </button>
        )}
        <button onClick={() => onSettingsClick()} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center hover:bg-blue-50 text-slate-700 border border-slate-100 transition-colors section-control-btn">
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
          className="bg-blue-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 hover:bg-blue-700 transition-all cursor-pointer font-bold text-xs pointer-events-auto border-2 border-white section-control-btn"
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

export const Navbar = ({ primaryColor, isReadOnly, logo, profiles, onTabChange, sections, onUpdateLogo, onSignInClick, isLoggedIn, onMyQrClick, onSignOutClick, showVisitorsPage, onVisitorsClick, onProfileTabClick }: { primaryColor: string; isReadOnly?: boolean; logo?: string; profiles?: any[]; onTabChange?: (tab: string) => void; sections?: any[]; onUpdateLogo?: (newLogo: string) => void; onSignInClick?: () => void; isLoggedIn?: boolean; onMyQrClick?: () => void; onSignOutClick?: () => void; showVisitorsPage?: boolean; onVisitorsClick?: () => void; onProfileTabClick?: () => void }) => {
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

  // 1. Home link (represents the home page/profile)
  const homeLink = {
    id: homeProfile?.id || 'home',
    label: (homeProfile?.name || 'HOME').toUpperCase(),
    isSection: false,
    isProfile: true,
    profileName: homeProfile?.name || 'HOME'
  };

  // 2. Get other profile/page links
  const otherPageLinks = (profiles && profiles.length > 1) 
    ? profiles
      .filter(p => p.isVisible !== false && p.id !== homeProfile?.id)
      .map(p => ({ id: p.id, label: p.name.toUpperCase(), isSection: false, isProfile: true, profileName: p.name }))
    : [];

  const navItems = [homeLink, ...otherPageLinks];

  return (
    <nav style={{
      position: isReadOnly ? "fixed" : "sticky", 
      top: 0, left: 0, right: 0, zIndex: 9999,
      background: (scrolled || !isReadOnly || menuOpen) ? "#101010" : "rgba(16, 16, 16, 0.8)", 
      backdropFilter: "blur(10px)",
      padding: (scrolled || menuOpen) ? "8px 0" : "12px 0",
      transition: "all 0.4s ease",
      boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.4)" : "none",
      height: (scrolled || menuOpen) ? '60px' : '72px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: (scrolled || menuOpen) ? "none" : "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: '100%', width: '100%' }}>
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', position: 'relative', gap: '10px', zIndex: 1001 }}>
          <div onClick={(e) => { 
            if (isReadOnly) { e.preventDefault(); scrollTo("home"); }
            else triggerLogoUpload();
          }} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
            {logo ? (
              <img src={logo} alt="Logo" style={{ height: '35px', maxWidth: '100px', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  style={{ color: primaryColor, fontWeight: 800, fontSize: "1.5rem", letterSpacing: '-1px', outline: 'none', display: 'flex', alignItems: 'center' }}
                  contentEditable={!isReadOnly}
                  suppressContentEditableWarning
                  onClick={(e) => !isReadOnly && e.stopPropagation()}
                >
                  <span style={{ color: '#fff', marginRight: '4px' }}>EVENT</span>
                  <span>BUILDER</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Icon - Far Right */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-hamburger"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '22px',
            cursor: 'pointer',
            zIndex: 1001,
            padding: '5px'
          }}
        >
          <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} style={{ 
          display: "flex", 
          gap: '2px', 
          listStyle: "none", 
          margin: 0, 
          padding: 0,
          transition: "all 0.3s ease"
        }}>
          {navItems.map((item, idx) => (
            <li key={`${item.id}-${idx}`} style={{ flexShrink: 0 }} className={item.isSection ? 'section-link' : 'profile-link'}>
              <button onClick={() => {
                onProfileTabClick?.();
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
          {/* VISITORS LINK */}
          <li style={{ flexShrink: 0 }} className="profile-link">
            <button 
              onClick={() => {
                onVisitorsClick?.();
                setMenuOpen(false);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
              }}
              style={{
                background: "transparent", border: "none", 
                color: showVisitorsPage ? primaryColor : "#fff", 
                fontSize: '13px',
                fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase",
                padding: "5px 10px", cursor: "pointer",
                fontFamily: "inherit", transition: "color 0.3s",
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { if (!showVisitorsPage) e.currentTarget.style.color = primaryColor; }}
              onMouseLeave={e => { if (!showVisitorsPage) e.currentTarget.style.color = "#fff"; }}
            >
              VISITORS
            </button>
          </li>
          {isLoggedIn ? (
            <>
              <li style={{ flexShrink: 0, marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => onMyQrClick?.()}
                  style={{
                    background: 'transparent',
                    border: `1.5px solid ${primaryColor}`,
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${primaryColor}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <i className="fas fa-qrcode" style={{ marginRight: '6px' }}></i>
                  MY QR
                </button>
              </li>
              <li style={{ flexShrink: 0, marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                <div 
                  onClick={() => onSignOutClick?.()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid rgba(255, 255, 255, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: '#fff'
                  }}
                  title="Click to Sign Out"
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.borderColor = primaryColor;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <i className="fas fa-user" style={{ fontSize: '16px' }}></i>
                </div>
              </li>
            </>
          ) : (
            <li className="auth-li" style={{ flexShrink: 0, marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => onSignInClick?.()}
                style={{
                  background: primaryColor, 
                  border: "none", 
                  color: "#fff", 
                  fontSize: '12px',
                  fontWeight: 700, 
                  letterSpacing: "0.5px", 
                  textTransform: "uppercase",
                  padding: "8px 16px", 
                  borderRadius: "8px", 
                  cursor: "pointer",
                  fontFamily: "inherit", 
                  transition: "all 0.3s ease",
                  whiteSpace: 'nowrap',
                  boxShadow: `0 4px 10px ${primaryColor}30`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 6px 15px ${primaryColor}50`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = `0 4px 10px ${primaryColor}30`;
                }}
              >
                Sign In
              </button>
            </li>
          )}
        </ul>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-hamburger {
            display: block !important;
          }
          .nav-links {
            position: absolute;
            top: 60px;
            right: 20px;
            background: #1a1a1a;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 0 !important;
            transform: translateY(10px);
            opacity: 0;
            pointer-events: none;
            z-index: 1000;
            width: 200px;
            padding: 10px 0 !important;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
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
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .nav-links li:last-child button {
            border-bottom: none;
          }
          .nav-links li.section-link {
            display: none !important;
          }
          .nav-links li.auth-li {
            margin-left: 0 !important;
            padding: 8px 12px !important;
          }
          .nav-links li.auth-li button {
            width: 100% !important;
            text-align: center !important;
            font-size: 12px !important;
            padding: 10px 16px !important;
            border-bottom: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

// ─── Countdown Timer ────────────────────────────────────────────────────────
const CountdownTimer = ({ colors, targetDate, lightMode = false, compact = false }: { colors: any, targetDate?: string, lightMode?: boolean, compact?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate || '2026-10-15T09:00').getTime();
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
  }, [targetDate]);

  const unitStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: lightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(15px)',
    padding: compact ? '14px 18px' : '24px',
    borderRadius: compact ? '18px' : '24px',
    minWidth: compact ? '80px' : '110px',
    border: lightMode ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.1)',
    boxShadow: lightMode ? '0 10px 20px rgba(0,0,0,0.03)' : '0 20px 40px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  };

  const valStyle: React.CSSProperties = {
    fontSize: compact ? '32px' : '48px',
    fontWeight: 800,
    color: lightMode ? '#0f172a' : '#fff',
    lineHeight: 1,
    letterSpacing: compact ? '-1.5px' : '-2px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: compact ? '9px' : '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: compact ? '2px' : '3px',
    color: colors.primary,
    marginTop: compact ? '6px' : '12px',
    opacity: 0.9
  };

  return (
    <div className="countdown-container" style={{ display: 'flex', gap: compact ? '12px' : '24px', justifyContent: 'center', marginTop: compact ? '28px' : '60px', flexWrap: 'wrap' }}>
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds }
      ].map((unit, i) => (
        <div key={i} style={unitStyle}>
          <span style={valStyle}>{String(unit.value).padStart(2, '0')}</span>
          <span style={labelStyle}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Section Components ──────────────────────────────────────────────────────
const Container = ({ children, style, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={`theme-container ${className}`} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", ...style }}>{children}</div>
);

const HomeHero = ({ colors, data, onUpdate, isReadOnly, isMounted, isFirst, onRegisterClick }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isMounted: boolean; isFirst?: boolean; onRegisterClick?: () => void }) => {
  const slide = data?.slides?.[0] || {};
  const dt = data?.dateTimeSettings || {};
  const layout = slide.layout || 'full-bg';
  const isSplit = layout === 'split-left' || layout === 'split-right';
  
  const updateSlide = (field: string, value: string) => {
    const newSlides = [...(data?.slides || [{ id: 1 }])];
    newSlides[0] = { ...newSlides[0], [field]: value };
    onUpdate({ ...data, slides: newSlides });
  };

  const sectionStyle: React.CSSProperties = isSplit ? {
    background: '#ffffff', // Clean white background for split mode
    minHeight: '750px',
    display: 'flex',
    alignItems: 'center',
    color: '#0f172a', // Dark text color
    position: 'relative',
    padding: isFirst ? '40px 0 100px 0' : '100px 0',
    overflow: 'hidden'
  } : {
    background: `linear-gradient(rgba(15, 23, 42, 0.4),rgba(15, 23, 42, 0.7)), url('${slide.images?.[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'}') center/cover no-repeat fixed`,
    height: "80vh", minHeight: "700px", display: "flex", alignItems: "center", color: colors.white, textAlign: "center", position: 'relative',
    padding: isFirst ? '0 0 100px 0' : '100px 0'
  };

  const containerStyle: React.CSSProperties = isSplit ? {
    display: 'flex',
    flexDirection: layout === 'split-right' ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '60px',
    width: '100%'
  } : {};

  const contentStyle: React.CSSProperties = isSplit ? {
    flex: '0 0 50%',
    width: '50%',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 2
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  };

  const imageStyle: React.CSSProperties = isSplit ? {
    flex: '0 0 42%',
    width: '42%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  } : {
    display: 'none'
  };

  const triggerImageUpload = () => {
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
  };

  return (
    <section id="home" style={sectionStyle}>
      {/* Background visual elements for split mode to make it premium */}
      {isSplit && (
        <>
          <style>{`
            @media (max-width: 768px) {
              .home-hero-container {
                flex-direction: column !important;
                gap: 40px !important;
              }
              .home-hero-content {
                flex: 0 0 100% !important;
                width: 100% !important;
                align-items: center !important;
                text-align: center !important;
              }
              .home-hero-content h1, .home-hero-content p {
                text-align: center !important;
              }
              .home-hero-image {
                flex: 0 0 100% !important;
                width: 100% !important;
              }
              .home-hero-btn-group {
                justify-content: center !important;
              }
              .home-hero-meta-group {
                justify-content: center !important;
              }
            }
          `}</style>
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: layout === 'split-left' ? '-10%' : 'auto',
            left: layout === 'split-right' ? '-10%' : 'auto',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`,
            zIndex: 1,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: layout === 'split-left' ? '-5%' : 'auto',
            right: layout === 'split-right' ? '-5%' : 'auto',
            width: '35vw',
            height: '35vw',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primary}04 0%, transparent 70%)`,
            zIndex: 1,
            pointerEvents: 'none'
          }} />
        </>
      )}

      <Container style={containerStyle} className="home-hero-container">
        {/* Change background button for full bg mode */}
        {!isReadOnly && !isSplit && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
            <button 
              onClick={triggerImageUpload}
              style={{ background: colors.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
            >
              CHANGE BACKGROUND
            </button>
          </div>
        )}

        <div style={contentStyle} className="home-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isSplit ? `${colors.primary}0d` : 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', padding: '8px 20px', borderRadius: '9999px', marginBottom: '32px', border: isSplit ? `1.5px solid ${colors.primary}20` : '1px solid rgba(255,255,255,0.12)' }}>
            <i className="fas fa-star" style={{ color: colors.primary, fontSize: '12px' }}></i>
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: isSplit ? colors.primary : '#fff' }}>{slide.badge || 'Limited Seats Available'}</span>
          </div>

          <EditableText 
            tagName="h1" text={slide.title || 'Experience the Next Big Thing'} isReadOnly={isReadOnly}
            onUpdate={(val: string) => updateSlide('title', val)}
            style={{ width: '100%', textAlign: isSplit ? 'left' : 'center', fontSize: isSplit ? 'clamp(28px, 3.8vw, 48px)' : 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '20px', lineHeight: '1.15', textTransform: 'uppercase', textShadow: isSplit ? 'none' : '0 10px 30px rgba(0,0,0,0.3)', overflowWrap: 'break-word', wordBreak: 'break-word', color: isSplit ? '#0f172a' : '#fff' }}
          />
          
          <EditableText 
            tagName="p" text={slide.subtitle || 'Join industry leaders and innovators for a three-day journey through the future of technology and networking.'} isReadOnly={isReadOnly}
            onUpdate={(val: string) => updateSlide('subtitle', val)}
            style={{ width: '100%', textAlign: isSplit ? 'left' : 'center', fontSize: isSplit ? '15px' : 'clamp(15px, 1.8vw, 20px)', maxWidth: isSplit ? '100%' : '850px', margin: isSplit ? '0 0 32px 0' : '0 auto 48px', color: isSplit ? '#576071' : 'rgba(255,255,255,0.8)', lineHeight: '1.65', fontWeight: 400, overflowWrap: 'break-word' }}
          />
          
          <div style={{ display: "flex", gap: '12px', justifyContent: isSplit ? "flex-start" : "center", marginBottom: '40px', flexWrap: 'wrap', width: '100%' }} className="home-hero-btn-group">
            {slide.primaryBtnLink ? (
              <a 
                href={slide.primaryBtnLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  onRegisterClick?.();
                }}
              >
                <button style={{ ...btnBase, background: colors.primary, borderColor: colors.primary, color: "#fff", padding: '14px 36px', boxShadow: `0 10px 25px ${colors.primary}30`, borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                  {slide.primaryBtnLabel || 'REGISTER NOW'}
                </button>
              </a>
            ) : (
              <button 
                onClick={() => onRegisterClick?.()}
                style={{ ...btnBase, background: colors.primary, borderColor: colors.primary, color: "#fff", padding: '14px 36px', boxShadow: `0 10px 25px ${colors.primary}30`, borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                {slide.primaryBtnLabel || 'REGISTER NOW'}
              </button>
            )}

            {slide.secondaryBtnLink ? (
              <a href={slide.secondaryBtnLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ ...btnBase, background: isSplit ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)", backdropFilter: 'blur(10px)', color: isSplit ? "#0f172a" : "#fff", padding: '14px 36px', border: isSplit ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
                  {slide.secondaryBtnLabel || 'VIEW AGENDA'}
                </button>
              </a>
            ) : (
              <button style={{ ...btnBase, background: isSplit ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)", backdropFilter: 'blur(10px)', color: isSplit ? "#0f172a" : "#fff", padding: '14px 36px', border: isSplit ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
                {slide.secondaryBtnLabel || 'VIEW AGENDA'}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: isSplit ? 'flex-start' : 'center', flexWrap: 'wrap', color: isSplit ? '#576071' : '#fff', opacity: 0.85, marginBottom: '32px', width: '100%' }} className="home-hero-meta-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
               <i className="fas fa-calendar" style={{ color: colors.primary }}></i>
               <span>{dt.eventDate ? (isMounted ? formatDate(dt.eventDate) : 'Oct 15, 2026') : 'Oct 15, 2026'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
               <i className="fas fa-clock" style={{ color: colors.primary }}></i>
               <span>{dt.eventDate ? (isMounted ? new Date(dt.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 PM') : '06:00 PM'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
               <i className="fas fa-map-marker-alt" style={{ color: colors.primary }}></i>
               <span>{dt.venueText || 'Grand Convention Center, SF'}</span>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: isSplit ? 'flex-start' : 'center' }}>
            <CountdownTimer colors={colors} lightMode={isSplit} compact={isSplit} targetDate={dt.eventDate} />
          </div>
        </div>

        {isSplit && (
          <div style={imageStyle} className="home-hero-image">
            <div style={{
              width: '100%',
              maxWidth: '520px',
              aspectRatio: '1.3',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: `0 20px 40px -10px rgba(0,0,0,0.12), 0 0 50px -10px ${colors.primary}15`,
              border: '1px solid rgba(0,0,0,0.08)',
              position: 'relative',
              zIndex: 2
            }}>
              <img 
                src={slide.images?.[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                alt="Event Hero" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {!isReadOnly && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.85,
                  transition: 'opacity 0.2s'
                }}>
                  <button 
                    onClick={triggerImageUpload}
                    style={{
                      background: colors.primary,
                      color: '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                  >
                    <i className="fas fa-image" style={{ marginRight: '8px' }}></i> CHANGE IMAGE
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

const WhyAttend = ({ colors, data, onUpdate, isReadOnly, isFirst }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isFirst?: boolean }) => {
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
    <section id="whyattend" style={{ padding: isFirst ? "0 0 60px 0" : "60px 0", background: colors.white }}>
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

const Speakers = ({ colors, data, onUpdate, isReadOnly, isFirst }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isFirst?: boolean }) => {
  const items = data?.items || [];
  
  const updateSpeaker = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ ...data, items: newItems });
  };

  return (
    <section id="speakers" style={{ background: colors.lightBg, padding: isFirst ? "0 0 60px 0" : "60px 0", textAlign: "center" }}>
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
            <div key={i} className="speaker-card" style={{ background: colors.white, padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', transition: 'all 0.4s ease', textAlign: 'center', width: '100%', maxWidth: '300px' }}>
              <div style={{ overflow: 'hidden', borderRadius: '20px', height: '320px', marginBottom: '20px', position: 'relative' }}>
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
                style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: colors.dark2 }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                <EditableText
                  tagName="span" text={sp.role} isReadOnly={isReadOnly}
                  onUpdate={(val: string) => updateSpeaker(i, 'role', val)}
                  style={{ color: colors.primary, fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}
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

const Sessions = ({ colors, data, onUpdate, isReadOnly, isFirst }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isFirst?: boolean }) => {
  const items = data?.items || [];
  
  const updateSession = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ ...data, items: newItems });
  };

  return (
    <section id="sessions" style={{ padding: isFirst ? "0 0 60px 0" : "60px 0", background: colors.white }}>
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

const Venue = ({ colors, data, onUpdate, isReadOnly, isFirst }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isFirst?: boolean }) => {
  const bgImg = data?.backgroundImage || '';
  
  return (
    <section id="venue" style={{
      padding: isFirst ? "0 0 60px 0" : "60px 0", color: colors.white,
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

const Gallery = ({ colors, data, onUpdate, isReadOnly, isFirst }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isFirst?: boolean }) => {
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
    <section id="gallery" style={{ padding: isFirst ? "0 0 60px 0" : "60px 0", background: colors.lightBg }}>
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

const Contact = ({ colors, data, onUpdate, isReadOnly, isFirst }: { colors: any; data: any; onUpdate: any; isReadOnly?: boolean; isFirst?: boolean }) => {
  const bgImg = data?.backgroundImage || '';

  return (
    <section id="contact" style={{ 
      padding: isFirst ? "0 0 60px 0" : "60px 0"
, 
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

// ─── QR Modal Component ──────────────────────────────────────────────────
const QrModal = ({ colors, onClose }: { colors: any; onClose: () => void }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px',
      animation: 'fadeInModal 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        animation: 'scaleInModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        color: '#1e293b',
        fontFamily: "'Inter', sans-serif",
        textAlign: 'center',
        padding: '36px'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.color = '#334155';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
        </button>

        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#0f172a', letterSpacing: '-0.5px' }}>
          My Event QR Code
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          Present this QR code at the registration desk for check-in.
        </p>

        {/* Dummy QR Code SVG */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '24px',
          borderRadius: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <svg width="200" height="200" viewBox="0 0 29 29" style={{ shapeRendering: 'crispEdges' }}>
            <rect width="29" height="29" fill="#f8fafc" />
            <rect x="0" y="0" width="7" height="7" fill="#0f172a" />
            <rect x="1" y="1" width="5" height="5" fill="#f8fafc" />
            <rect x="2" y="2" width="3" height="3" fill="#0f172a" />
            <rect x="22" y="0" width="7" height="7" fill="#0f172a" />
            <rect x="23" y="1" width="5" height="5" fill="#f8fafc" />
            <rect x="24" y="2" width="3" height="3" fill="#0f172a" />
            <rect x="0" y="22" width="7" height="7" fill="#0f172a" />
            <rect x="1" y="23" width="5" height="5" fill="#f8fafc" />
            <rect x="2" y="24" width="3" height="3" fill="#0f172a" />
            <rect x="8" y="2" width="2" height="1" fill="#0f172a" />
            <rect x="11" y="0" width="1" height="2" fill="#0f172a" />
            <rect x="14" y="1" width="3" height="1" fill="#0f172a" />
            <rect x="19" y="3" width="2" height="2" fill="#0f172a" />
            <rect x="9" y="5" width="4" height="1" fill="#0f172a" />
            <rect x="15" y="4" width="1" height="3" fill="#0f172a" />
            <rect x="2" y="9" width="3" height="1" fill="#0f172a" />
            <rect x="6" y="8" width="1" height="4" fill="#0f172a" />
            <rect x="9" y="10" width="2" height="2" fill="#0f172a" />
            <rect x="13" y="8" width="3" height="1" fill="#0f172a" />
            <rect x="18" y="9" width="4" height="2" fill="#0f172a" />
            <rect x="24" y="8" width="2" height="3" fill="#0f172a" />
            <rect x="27" y="10" width="1" height="2" fill="#0f172a" />
            <rect x="0" y="13" width="2" height="2" fill="#0f172a" />
            <rect x="4" y="15" width="3" height="2" fill="#0f172a" />
            <rect x="9" y="14" width="1" height="4" fill="#0f172a" />
            <rect x="12" y="16" width="4" height="1" fill="#0f172a" />
            <rect x="17" y="13" width="2" height="3" fill="#0f172a" />
            <rect x="21" y="15" width="3" height="1" fill="#0f172a" />
            <rect x="26" y="14" width="2" height="2" fill="#0f172a" />
            <rect x="1" y="19" width="3" height="1" fill="#0f172a" />
            <rect x="6" y="18" width="2" height="3" fill="#0f172a" />
            <rect x="10" y="20" width="1" height="2" fill="#0f172a" />
            <rect x="13" y="21" width="3" height="1" fill="#0f172a" />
            <rect x="19" y="19" width="2" height="3" fill="#0f172a" />
            <rect x="23" y="20" width="4" height="2" fill="#0f172a" />
            <rect x="9" y="24" width="2" height="1" fill="#0f172a" />
            <rect x="14" y="25" width="3" height="3" fill="#0f172a" />
            <rect x="18" y="24" width="1" height="2" fill="#0f172a" />
            <rect x="20" y="27" width="4" height="1" fill="#0f172a" />
          </svg>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f172a'}
        >
          Close QR Code
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ─── Sign In Modal Component ──────────────────────────────────────────────────
const SignInModal = ({ colors, onClose, onSwitchToRegister, onSignInSuccess }: { colors: any; onClose: () => void; onSwitchToRegister: () => void; onSignInSuccess: (email: string) => void }) => {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSignInSuccess(email);
  };

  const handleGoogleSignIn = () => {
    setSubmitted(true);
    onSignInSuccess('google.user@gmail.com');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px',
      animation: 'fadeInModal 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        animation: 'scaleInModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        color: '#1e293b',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.color = '#334155';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
        </button>

        {!submitted ? (
          <div style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
              Sign in to manage your event bookings and profile.
            </p>

            {/* Google Sign In Option */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                marginBottom: '20px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <i className="fab fa-google" style={{ color: '#ea4335', fontSize: '18px' }}></i>
              Sign in with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#cbd5e1' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, padding: '0 12px', color: '#94a3b8' }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Email address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    width: '100%',
                    color: '#0f172a',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    width: '100%',
                    color: '#0f172a',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: colors.primary || '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  marginTop: '10px',
                  boxShadow: `0 8px 16px -4px ${colors.primary || '#3b82f6'}40`
                }}
              >
                Sign In
              </button>
            </form>

            {/* Footer switcher */}
            <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#64748b' }}>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary || '#3b82f6',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                  textDecoration: 'underline'
                }}
              >
                Register
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '48px 36px', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              <i className="fas fa-check"></i>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
              Welcome Back!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '28px' }}>
              You have successfully signed in as <strong style={{ color: '#1e293b' }}>{email}</strong>.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ─── Register Modal Component ──────────────────────────────────────────────────
const RegisterModal = ({ colors, onClose }: { colors: any; onClose: () => void }) => {
  const [ticketType, setTicketType] = useState<'premium' | 'silver' | 'student'>('silver');
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [submitted, setSubmitted] = useState(false);

  const ticketOptions = [
    { id: 'premium', label: 'Premium Pass', price: 2500, desc: 'Access top sessions' },
    { id: 'silver', label: 'Silver', price: 500, desc: 'Meet and Greet' },
    { id: 'student', label: 'Students', price: 0, desc: 'ID Mandatory' },
  ];

  const selectedTicket = ticketOptions.find(opt => opt.id === ticketType) || ticketOptions[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px',
      animation: 'fadeInModal 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        animation: 'scaleInModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        color: '#1e293b',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.color = '#334155';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Register for Event
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Secure your spot today. Choose your ticket type and fill in your details.
            </p>

            {/* Ticket Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569' }}>
                Select Ticket Type
              </label>
              {ticketOptions.map((opt) => {
                const isSelected = ticketType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setTicketType(opt.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #3b82f6' : '1.5px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.08)' : 'none'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="ticketType"
                      checked={isSelected}
                      onChange={() => setTicketType(opt.id as any)}
                      style={{
                        marginRight: '16px',
                        width: '20px',
                        height: '20px',
                        accentColor: '#3b82f6',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: isSelected ? '#1d4ed8' : '#1e293b' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '15px', color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                          {opt.price === 0 ? 'Free' : `₹${opt.price}`}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: isSelected ? '#1e40af' : '#64748b', margin: '4px 0 0 0', opacity: 0.85 }}>
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Price Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '24px',
              borderLeft: `4px solid ${colors.primary || '#3b82f6'}`
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Total Ticket Price:</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                {selectedTicket.price === 0 ? 'Free' : `${selectedTicket.price} INR`}
              </span>
            </div>

            {/* User Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    width: '100%',
                    color: '#0f172a',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569' }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    width: '100%',
                    color: '#0f172a',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569' }}>
                  Phone Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    width: '100%',
                    color: '#0f172a',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: colors.primary || '#3b82f6',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: `0 10px 20px -5px ${colors.primary || '#3b82f6'}50`
              }}
            >
              Submit Registration
            </button>
          </form>
        ) : (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '36px'
            }}>
              <i className="fas fa-check"></i>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
              Registration Successful!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>
              Thank you, <strong style={{ color: '#1e293b' }}>{fullName}</strong>. Your ticket selection for <strong style={{ color: colors.primary || '#3b82f6' }}>{selectedTicket.label}</strong> ({selectedTicket.price === 0 ? 'Free' : `${selectedTicket.price} INR`}) has been reserved.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ─── Visitors Section Component ──────────────────────────────────────────────
const VisitorsSection = ({ colors }: { colors: any }) => {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<'agents' | 'companies'>('agents');

  return (
    <section style={{
      background: '#f8fafc',
      padding: '80px 0 120px',
      minHeight: '80vh',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: colors.primary,
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Event Network
          </span>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-1px',
            marginBottom: '16px'
          }}>
            Attendees & Exhibitors
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Connect with certified travel professionals and industry leaders participating in the event.
          </p>
        </div>

        {/* Sub-tab Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '48px'
        }}>
          <button
            onClick={() => setActiveSubTab('agents')}
            style={{
              padding: '12px 28px',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: activeSubTab === 'agents' ? colors.primary : '#ffffff',
              color: activeSubTab === 'agents' ? '#ffffff' : '#475569',
              boxShadow: activeSubTab === 'agents' ? `0 10px 20px -5px ${colors.primary}50` : '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i>
            Travel Agents ({mockAgents.length})
          </button>
          <button
            onClick={() => setActiveSubTab('companies')}
            style={{
              padding: '12px 28px',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: activeSubTab === 'companies' ? colors.primary : '#ffffff',
              color: activeSubTab === 'companies' ? '#ffffff' : '#475569',
              boxShadow: activeSubTab === 'companies' ? `0 10px 20px -5px ${colors.primary}50` : '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
            Exhibitor Companies ({mockCompanies.length})
          </button>
        </div>

        {/* Content Lists */}
        {activeSubTab === 'agents' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {mockAgents.map((agent) => (
              <div
                key={agent.userId}
                onClick={() => {
                  const currentPath = typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '';
                  router.push(`/agents?id=${agent.userId}&from=${encodeURIComponent(currentPath)}`);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1.5px solid #e2e8f0',
                  padding: '28px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer'
                }}
                className="visitor-card"
              >
                {/* Agent Header */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <img
                    src={agent.profileImage}
                    alt={agent.fullName}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${colors.primary}20`
                    }}
                  />
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {agent.fullName}
                      {agent.isVerified && (
                        <i className="fas fa-check-circle" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
                      )}
                    </h3>
                    <span style={{ fontSize: '13px', color: colors.primary, fontWeight: 600 }}>
                      {agent.title}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <i className="fas fa-briefcase" style={{ color: '#94a3b8', width: '16px' }}></i>
                    <strong>{agent.agencyName}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#94a3b8', width: '16px' }}></i>
                    <span>{agent.location}</span>
                  </div>
                </div>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '24px'
                }}>
                  {agent.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '4px 10px',
                        borderRadius: '9999px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social/Contact Footer */}
                <div 
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '20px',
                    justifyContent: 'flex-start'
                  }}
                >
                  {agent.socialLinks?.website && (
                    <a href={agent.socialLinks.website} target="_blank" rel="noopener noreferrer" style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s'
                    }}>
                      <i className="fas fa-globe"></i>
                    </a>
                  )}
                  {agent.socialLinks?.linkedin && (
                    <a href={agent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s'
                    }}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {agent.whatsappNumber && (
                    <a href={`https://wa.me/${agent.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', transition: 'all 0.2s'
                    }}>
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  )}
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea4335', transition: 'all 0.2s'
                    }}>
                      <i className="far fa-envelope"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {mockCompanies.map((company, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const currentPath = typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '';
                  router.push(`/companies?id=${company.companyName}&from=${encodeURIComponent(currentPath)}`);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1.5px solid #e2e8f0',
                  padding: '28px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer'
                }}
                className="visitor-card"
              >
                {/* Company Header */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <img
                    src={company.logo}
                    alt={company.companyName}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: `1.5px solid #e2e8f0`
                    }}
                  />
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {company.companyName}
                      {company.isVerified && (
                        <i className="fas fa-check-circle" style={{ color: '#3b82f6', fontSize: '14px' }}></i>
                      )}
                    </h3>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {company.industry}
                    </span>
                  </div>
                </div>

                {/* Tagline & Desc */}
                <span style={{ fontStyle: 'italic', color: colors.primary, fontSize: '13px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>
                  "{company.tagline}"
                </span>
                <p style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.5',
                  marginBottom: '20px',
                  flexGrow: 1
                }}>
                  {company.description}
                </p>

                {/* Meta details */}
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <span><i className="fas fa-users" style={{ marginRight: '6px' }}></i>{company.teamSize}</span>
                    <span><i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>{company.location}</span>
                  </div>
                </div>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginBottom: '24px'
                }}>
                  {company.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '4px 10px',
                        borderRadius: '9999px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer links */}
                <div 
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '20px',
                    justifyContent: 'flex-start'
                  }}
                >
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s'
                    }}>
                      <i className="fas fa-globe"></i>
                    </a>
                  )}
                  {company.socialLinks?.linkedin && (
                    <a href={company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s'
                    }}>
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {company.email && (
                    <a href={`mailto:${company.email}`} style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea4335', transition: 'all 0.2s'
                    }}>
                      <i className="far fa-envelope"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <style jsx>{`
        .visitor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: ${colors.primary}40 !important;
        }
      `}</style>
    </section>
  );
};

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
  onAddClick,
  forceMobile
}: ThemeOneProps) {
  const colors = getColors(themeConfig);
  const [settingsSection, setSettingsSection] = useState<{ id: string, type: string, data: any } | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showVisitorsPage, setShowVisitorsPage] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'visitors') {
        setShowVisitorsPage(true);
      }
    }
  }, []);

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
      case 'SESSIONS': SectionComponent = FeaturedSessions; settingsMode = 'AGENDA'; break;
      case 'AGENDA': 
      case 'SCHEDULE': SectionComponent = Sessions; settingsMode = 'AGENDA'; break;
      case 'GALLERY': SectionComponent = GallerySection; isThemed = false; break;
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
      case 'SPONSOR': 
      case 'SPONSOR_CATEGORY': SectionComponent = SponsorsSection; settingsMode = 'SPONSOR'; break;
      case 'FLOOR_PLAN': SectionComponent = FloorPlanSection; isThemed = false; break;
      case 'CUSTOM_HTML': SectionComponent = CustomHTMLSection; isThemed = false; break;
      case 'MOVING_LINE': SectionComponent = MovingLineSection; isThemed = false; break;
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
        forceMobile={forceMobile}
      >
        <SectionComponent 
          colors={colors}
          data={section.data}
          isReadOnly={isReadOnly}
          isMounted={isMounted}
          isFirst={isFirst}
          onUpdate={(newData: any) => onUpdateSection?.(section.id, newData)}
          onRegisterClick={() => setShowRegisterModal(true)}
        />
      </ThemeSectionWrapper>
    );
  };

  return (
    <div 
      className={forceMobile ? "is-mobile-preview" : ""}
      style={{ 
        fontFamily: themeConfig?.fontFamily || "'Inter', sans-serif", 
        background: colors.white, 
        scrollBehavior: 'smooth',
        '--primary': colors.primary,
        overflowX: 'hidden'
      } as any}
    >
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
        onSignInClick={() => setShowSignInModal(true)}
        isLoggedIn={isLoggedIn}
        onMyQrClick={() => setShowQrModal(true)}
        onSignOutClick={() => setIsLoggedIn(false)}
        showVisitorsPage={showVisitorsPage}
        onVisitorsClick={() => {
          setShowVisitorsPage(true);
        }}
        onProfileTabClick={() => {
          setShowVisitorsPage(false);
        }}
      />
      
      {showVisitorsPage ? (
        <VisitorsSection 
          colors={colors} 
        />
      ) : (data?.sections && data.sections.length > 0) ? (
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

      {showRegisterModal && (
        <RegisterModal 
          colors={colors} 
          onClose={() => setShowRegisterModal(false)} 
        />
      )}

      {showSignInModal && (
        <SignInModal 
          colors={colors} 
          onClose={() => setShowSignInModal(false)} 
          onSwitchToRegister={() => setShowRegisterModal(true)}
          onSignInSuccess={() => setIsLoggedIn(true)}
        />
      )}

      {showQrModal && (
        <QrModal 
          colors={colors} 
          onClose={() => setShowQrModal(false)} 
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
          .mobile-hamburger {
            display: block !important;
          }
          .nav-links {
            position: absolute;
            top: 60px;
            left: 20px;
            background: #101010;
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
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .nav-links li:last-child button {
            border-bottom: none;
          }

          .countdown-container {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            justify-content: center !important;
            width: 100% !important;
            margin-top: 30px !important;
          }
          .countdown-container > div {
            min-width: 70px !important;
            padding: 12px 8px !important;
            border-radius: 12px !important;
            flex: 1 !important;
            max-width: 85px !important;
          }
          .countdown-container span:first-child {
            font-size: 24px !important;
            letter-spacing: -1px !important;
          }
          .countdown-container span:last-child {
            font-size: 9px !important;
            letter-spacing: 1px !important;
            margin-top: 6px !important;
          }
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
          
          h1 { font-size: 36px !important; line-height: 1.2 !important; text-align: center !important; }
          h2 { font-size: 28px !important; text-align: center !important; }
          h3 { font-size: 18px !important; text-align: center !important; }
          p { font-size: 16px !important; text-align: center !important; line-height: 1.5 !important; }
          section { padding: 60px 0 !important; }
          
          /* Hero Section Adjustments */
          #home { 
            height: auto !important; 
            min-height: 100vh !important; 
            padding: 120px 0 60px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
          }

          #home .theme-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          #home div[style*="display: flex"][style*="gap: 20px"] {
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }

          #home button {
            width: 100% !important;
            max-width: 300px !important;
            margin: 0 auto !important;
          }

          #home div[style*="display: flex"][style*="gap: 40px"] {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 20px !important;
            justify-content: center !important;
            align-items: center !important;
          }

          /* Why Attend Grid */
          #whyattend > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          #whyattend > div > div > div:last-child {
            order: -1;
          }

          /* Speakers Grid */
          #speakers .speaker-card {
            max-width: 100% !important;
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
            padding: 15px !important;
          }
          #venue div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }

          /* Gallery Grid */
          #gallery div[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }

          /* Contact Grid */
          #contact > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          /* General spacing for chips and buttons */
          div[style*="display: flex"][style*="gap: 40px"],
          div[style*="display: flex"][style*="gap: 20px"] {
            gap: 15px !important;
            justify-content: center !important;
          }

          .countdown-container div[style*="min-width: 90px"] {
            min-width: 70px !important;
            padding: 10px !important;
          }

          .countdown-container span[style*="font-size: 42px"] {
            font-size: 28px !important;
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
        
        .is-mobile-preview h1 { font-size: 36px !important; line-height: 1.2 !important; text-align: center !important; }
        .is-mobile-preview h2 { font-size: 28px !important; text-align: center !important; }
        .is-mobile-preview h3 { font-size: 18px !important; text-align: center !important; }
        .is-mobile-preview p { font-size: 16px !important; text-align: center !important; line-height: 1.5 !important; }
        .is-mobile-preview section { padding: 60px 0 !important; }
        
        .is-mobile-preview #home { 
          height: auto !important; 
          min-height: 100vh !important; 
          padding: 120px 20px 60px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
        }

        .is-mobile-preview #home div[style*="display: flex"][style*="gap: 20px"] {
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
        }

        .is-mobile-preview #home button {
          width: 100% !important;
          max-width: 300px !important;
          margin: 0 auto !important;
        }

        .is-mobile-preview #home div[style*="display: flex"][style*="gap: 40px"] {
          flex-direction: row !important;
          flex-wrap: wrap !important;
          gap: 20px !important;
          justify-content: center !important;
          align-items: center !important;
        }

        .is-mobile-preview #whyattend > div > div {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }
        .is-mobile-preview #whyattend > div > div > div:last-child {
          order: -1;
        }

        .is-mobile-preview #speakers .speaker-card {
          max-width: 100% !important;
        }

        .is-mobile-preview .session-item {
          flex-direction: column !important;
          gap: 20px !important;
          padding: 30px !important;
        }
        .is-mobile-preview .session-item > div:first-child {
          width: 100% !important;
          border-right: none !important;
          border-bottom: 2px solid ${colors.primary};
          padding-right: 0 !important;
          padding-bottom: 20px !important;
          text-align: left !important;
        }

        .is-mobile-preview #venue > div > div:last-child {
          grid-template-columns: 1fr !important;
          padding: 15px !important;
        }
        .is-mobile-preview #venue div[style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
        }

        .is-mobile-preview #gallery div[style*="grid-template-columns"] {
          grid-template-columns: 1fr 1fr !important;
        }

        .is-mobile-preview #contact > div > div {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }

        .is-mobile-preview div[style*="display: flex"][style*="gap: 40px"],
        .is-mobile-preview div[style*="display: flex"][style*="gap: 20px"] {
          gap: 15px !important;
          justify-content: center !important;
        }

        .is-mobile-preview .countdown-container {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          justify-content: center !important;
          width: 100% !important;
          margin-top: 30px !important;
        }
        .is-mobile-preview .countdown-container > div {
          min-width: 70px !important;
          padding: 12px 8px !important;
          border-radius: 12px !important;
          flex: 1 !important;
          max-width: 85px !important;
        }
        .is-mobile-preview .countdown-container span:first-child {
          font-size: 24px !important;
          letter-spacing: -1px !important;
        }
        .is-mobile-preview .countdown-container span:last-child {
          font-size: 9px !important;
          letter-spacing: 1px !important;
          margin-top: 6px !important;
        }

        @media (max-width: 480px) {
           h1 { font-size: 32px !important; }
           #gallery div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

