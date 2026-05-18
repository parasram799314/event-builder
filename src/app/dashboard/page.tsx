"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Create Event Modal State
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState("In-person");
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("Others");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [language, setLanguage] = useState("English");
  const [domainType, setDomainType] = useState("subdomain"); // "subdomain" or "custom"
  const [domainValue, setDomainValue] = useState("");

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/websites");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Server responded with ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setWebsites(data);
      }
    } catch (error: any) {
      console.error("CRITICAL: Failed to fetch websites:", error);
      // alert(`Error loading websites: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleCreate = async () => {
    if (!eventName) return;
    
    const eventDateTime = startDate && startTime ? `${startDate}T${startTime}` : startDate ? `${startDate}T00:00` : null;

    const payload = {
      title: eventName,
      theme: eventType.toLowerCase(),
      status: "draft",
      eventDate: startDate || null,
      eventTime: startTime || null,
      lastModifiedBy: "JD",
      domainType,
      domainValue,
      content: {
        eventProfiles: [
          { 
            id: 'home', 
            name: 'Home', 
            isDefault: true, 
            isVisible: true, 
            sections: [
              { 
                id: 'hero', 
                type: 'HERO', 
                isVisible: true, 
                data: {
                  slides: [{
                    id: 1,
                    title: eventName,
                    subtitle: `A professional ${category.toLowerCase()} event focusing on excellence.`,
                    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'],
                    currentImageIndex: 0,
                    button: { label: 'REGISTER NOW', link: '#', bgColor: '#3b82f6', textColor: '#ffffff' },
                    titleStyle: { color: '#ffffff', fontSize: '72px', fontWeight: '800', fontFamily: 'inherit' },
                    subtitleStyle: { color: '#e2e8f0', fontSize: '24px', fontWeight: 'normal', fontFamily: 'inherit' },
                    layout: 'full-bg',
                    imageWidth: 100,
                    textAlignment: 'center',
                    verticalPosition: 'center',
                    overlayOpacity: 0.6
                  }],
                  dateTimeSettings: {
                    showDate: true, showTime: true, showVenue: true,
                    eventDate: eventDateTime || '2026-10-15T18:00',
                    venueText: eventType === 'In-person' ? 'Main Venue' : 'Online Event',
                    widgetSize: 'Large', showIcons: true, textColor: '#ffffff'
                  }
                } 
              },
              { 
                id: 'whyAttend', 
                type: 'WHY_ATTEND', 
                isVisible: true, 
                data: { 
                  title: 'Why Join the Summit?', 
                  subtitle: 'Experience the cutting edge of innovation',
                  description: 'Discover the latest trends in technology and networking. Connect with industry leaders and visionary entrepreneurs who are shaping our digital future.' 
                } 
              },
              { 
                id: 'speakers', 
                type: 'SPEAKERS', 
                isVisible: true, 
                data: { 
                  title: 'Our Speakers',
                  subtitle: 'Industry leaders sharing their vision',
                  items: [
                    { name: 'Sarah Johnson', role: 'CEO, TechFlow', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
                    { name: 'Michael Chen', role: 'Lead Architect, Google', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
                    { name: 'Elena Rodriguez', role: 'AI Research, OpenAI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' }
                  ] 
                } 
              },
              { 
                id: 'sessions', 
                type: 'SESSIONS', 
                isVisible: true, 
                data: { 
                  title: 'Featured Sessions',
                  subtitle: 'Deep dives into modern technology',
                  items: [
                    { time: '09:00 AM', title: 'Opening Keynote: Future Vision', desc: 'Navigating the next decade of innovation.', speaker: 'Sarah Johnson' },
                    { time: '11:30 AM', title: 'Strategic Growth & Scaling', desc: 'Real-world applications of scalable systems.', speaker: 'Michael Chen' }
                  ] 
                } 
              },
              { 
                id: 'venue', 
                type: 'VENUE', 
                isVisible: true, 
                data: { 
                  name: eventType === 'In-person' ? 'Grand Convention Center' : 'Digital Platform', 
                  address: eventType === 'In-person' ? '123 Event Plaza, San Francisco, CA' : 'Virtual Event Link Provided to Registered Users', 
                  description: 'A world-class experience equipped with state-of-the-art technology and premium amenities.',
                  image: 'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?w=1200'
                } 
              },
              { 
                id: 'contact', 
                type: 'CONTACT', 
                isVisible: true, 
                data: { 
                  title: 'Get in Touch',
                  subtitle: 'We are here to answer your questions'
                } 
              },
            ]
          }
        ],
        themeConfig: {
          primaryColor: '#3b82f6',
          backgroundColor: '#ffffff',
          textColor: '#1e293b',
          navbarColor: '#ffffff',
          navbarTextColor: '#1e293b',
          activeLayout: null
        }
      }
    };

    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedWebsite = await res.json();
        router.push(`/editor?id=${savedWebsite.id}`);
      } else {
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editor?id=${id}`);
  };

  const handlePreview = (id: number) => {
    window.open(`/preview/${id}`, "_blank");
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/websites?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWebsites(websites.filter(w => w.id !== id));
      } else {
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* TOP NAVBAR - Matched with Homepage */}
      <nav className="fixed top-0 left-0 w-full bg-[#f0bf4c] min-h-14 py-2 flex flex-wrap items-center justify-between px-4 md:px-6 z-[100] shadow-sm">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo3.png" 
              alt="Logo" 
              width={100} 
              height={30} 
              className="object-contain md:w-[120px]"
            />
          </div>
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <Link href="/" className="text-black hover:text-black/80 transition-colors">Home</Link>
            <Link href="#" className="text-black hover:text-black/80 transition-colors">Portal Settings</Link>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-white hover:bg-slate-50 text-black border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm font-semibold transition-all active:scale-95 shadow-sm"
        >
          Create Event
        </button>
      </nav>

      {/* Sidebar Container */}
      <div className={styles.sidebarContainer}>
        {/* Sidebar 1: Primary Navigation */}
        <aside className={styles.sidebar1}>
          <div className={`${styles.s1Item} ${styles.active}`}>
            <i className="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </div>
          <div className={styles.s1Item}>
            <i className="fa-solid fa-palette"></i>
            <span>Design</span>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main className={styles.mainWrapper}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Event Website</h1>
          </header>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading your websites...</div>
          ) : websites.length > 0 ? (
            websites.map((website) => (
              <div key={website.id} className={styles.mainCard}>
                <div className={styles.previewContainer}>
                  <div className={styles.previewCard}>
                    <div className={styles.previewCardContent}>
                      <h2>{website.title}</h2>
                      <div className={styles.eventMeta}>
                        <div className={styles.metaItem}>
                          <i className="fa-regular fa-calendar"></i>
                          <span>{website.eventDate ? new Date(website.eventDate).toLocaleDateString() : 'No date set'}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <i className="fa-regular fa-clock"></i>
                          <span>{website.eventTime || 'No time set'}</span>
                        </div>
                      </div>
                      <button className={styles.registerBtn}>REGISTER NOW</button>
                      <div className={styles.countdownRow}>
                        <div className={styles.countdownBox}>
                          <span className={styles.countdownVal}>29</span>
                          <span className={styles.countdownLabel}>DAYS</span>
                        </div>
                        <div className={styles.countdownBox}>
                          <span className={styles.countdownVal}>21</span>
                          <span className={styles.countdownLabel}>HOURS</span>
                        </div>
                        <div className={styles.countdownBox}>
                          <span className={styles.countdownVal}>28</span>
                          <span className={styles.countdownLabel}>MINUTES</span>
                        </div>
                        <div className={styles.countdownBox}>
                          <span className={styles.countdownVal}>33</span>
                          <span className={styles.countdownLabel}>SECONDS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <div className={styles.infoTop}>
                    <div className={styles.themeRow}>
                      Website Theme: <span className={styles.themeValue}>{website.theme}</span>
                    </div>
                    <div className={styles.statusBadge}>{website.status}</div>
                    <div className={styles.modifiedBy}>
                      Last Modified By: 
                      <div className={styles.avatar}>{website.lastModifiedBy?.substring(0, 2).toUpperCase()}</div>
                      <span className={styles.username}>{website.lastModifiedBy}</span>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.editBtn} onClick={() => handleEdit(website.id)}>
                      <i className="fa-solid fa-pencil"></i> Edit Website
                    </button>
                    <button className={styles.previewBtn} onClick={() => handlePreview(website.id)}>Preview</button>
                    <button 
                      className={styles.deleteBtnDashboard} 
                      onClick={(e) => { e.stopPropagation(); handleDelete(website.id, website.title); }}
                      title="Delete Event"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    <button className={styles.settingsBtn}>
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
              <h2 style={{ marginBottom: '16px' }} className="text-xl font-bold text-slate-800">No websites found</h2>
              <button onClick={() => setShowModal(true)} className={styles.editBtn} style={{ display: 'inline-flex', margin: '0 auto' }}>
                 + Create New Website
              </button>
            </div>
          )}

          <div className={styles.trackingSection}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Website Visitor Tracking</h3>
            <div className={styles.integrationCard}>
              <div className={styles.logoContainer}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div className={styles.integrationInfo}>
                <h4 className="font-bold">PageSense</h4>
                <p>Track your visitors and their behavior on your event website.</p>
              </div>
              <button className={styles.integrateBtn}>Integrate Now</button>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE EVENT MODAL - Matched with Homepage */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
            {/* LEFT SIDE: FORM */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
              <div className="flex justify-between items-center mb-6 md:mb-10">
                <div>
                  <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Create New Event</h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">Fill in the details below to initialize your event.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all group"
                >
                  <i className="fa-solid fa-xmark text-slate-400 group-hover:text-slate-600 text-lg md:text-xl"></i>
                </button>
              </div>

              {/* EVENT TYPE CARDS */}
              <div className="mb-8 md:mb-10">
                <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4 block">Select Event Format</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { id: "In-person", icon: "fa-location-dot", desc: "Physical gathering at a venue" },
                    { id: "Virtual", icon: "fa-video", desc: "Digital event hosted online" },
                    { id: "Hybrid", icon: "fa-people-arrows", desc: "Combined physical & virtual" }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEventType(type.id)}
                      className={`relative p-4 md:p-6 rounded-xl border-2 transition-all text-left ${
                        eventType === type.id 
                          ? "border-blue-600 bg-blue-50/50 shadow-[0_0_20px_-5px_rgba(37,99,235,0.2)]" 
                          : "border-slate-100 hover:border-blue-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors ${
                        eventType === type.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"
                      }`}>
                        <i className={`fa-solid ${type.icon} text-base md:text-lg`}></i>
                      </div>
                      <div className="font-bold text-slate-900 text-base md:text-lg mb-1">{type.id}</div>
                      <div className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-medium">{type.desc}</div>
                      {eventType === type.id && (
                        <div className="absolute top-4 right-4 text-blue-600">
                          <i className="fa-solid fa-circle-check"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* FORM FIELDS */}
              <div className="space-y-6 md:space-y-8">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Event Name <span className="text-red-500">*</span></label>
                    <span className="text-[10px] md:text-[11px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded">{eventName.length}/255</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Annual Tech Conference 2026"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Industry Category</label>
                    <div className="relative">
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 md:px-5 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none appearance-none transition-all text-slate-900 font-medium bg-white text-sm md:text-base"
                      >
                        <option>Others</option>
                        <option>Business</option>
                        <option>Technology</option>
                        <option>Entertainment</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Default Language</label>
                    <div className="relative">
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 md:px-5 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none appearance-none transition-all text-slate-900 font-medium bg-white text-sm md:text-base"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    </div>
                  </div>
                </div>

                {/* DOMAIN SELECTION SECTION */}
                <div className="space-y-4">
                  <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Web Address (URL)</label>
                  <div className="flex flex-wrap gap-2 md:gap-4 p-1 md:p-1.5 bg-slate-100 rounded-xl w-fit">
                    <button 
                      onClick={() => setDomainType("subdomain")}
                      className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                        domainType === "subdomain" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Use Subdomain
                    </button>
                    <button 
                      onClick={() => setDomainType("custom")}
                      className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                        domainType === "custom" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Use Own Domain
                    </button>
                  </div>

                  <div className="relative animate-in slide-in-from-top-2 duration-300">
                    {domainType === "subdomain" ? (
                      <div className="flex flex-col md:flex-row md:items-center group">
                        <input 
                          type="text" 
                          placeholder="your-event-name"
                          value={domainValue}
                          onChange={(e) => setDomainValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="flex-1 px-4 md:px-5 py-3 md:py-3.5 rounded-t-xl md:rounded-t-none md:rounded-l-xl border md:border-r-0 border-slate-200 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium bg-white text-sm md:text-base"
                        />
                        <div className="px-4 md:px-5 py-2 md:py-[14px] bg-slate-50 border border-t-0 md:border-t border-slate-200 rounded-b-xl md:rounded-b-none md:rounded-r-xl text-slate-400 font-bold text-xs md:text-sm">
                          .eventbuilder.com
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <i className="fa-solid fa-globe absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input 
                          type="text" 
                          placeholder="e.g. summit2026.com"
                          value={domainValue}
                          onChange={(e) => setDomainValue(e.target.value.toLowerCase())}
                          className="w-full pl-12 pr-5 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium bg-white text-sm md:text-base"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 md:p-6 rounded-2xl border border-slate-100 space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Start Schedule</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                          <i className="fa-regular fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors"></i>
                          <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-xs md:text-sm text-slate-900 font-medium transition-all"
                          />
                        </div>
                        <div className="relative flex-1 group">
                          <i className="fa-regular fa-clock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors"></i>
                          <input 
                            type="time" 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-xs md:text-sm text-slate-900 font-medium transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">End Schedule</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                          <i className="fa-regular fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors"></i>
                          <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-900 font-medium transition-all"
                          />
                        </div>
                        <div className="relative flex-1 group">
                          <i className="fa-regular fa-clock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors"></i>
                          <input 
                            type="time" 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-900 font-medium transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  className="px-8 md:px-12 py-2.5 md:py-3 rounded-xl bg-blue-600 text-white text-xs md:text-sm font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  Create Event
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: INFO */}
            <div className="hidden lg:flex w-80 bg-slate-50 p-12 flex-col items-center justify-between text-center rounded-r-2xl border-l border-slate-100">
              <div className="mt-10">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-10 mx-auto transform transition-transform hover:rotate-12 duration-500 cursor-default">
                  <i className="fa-solid fa-calendar-plus text-blue-600"></i>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4 leading-tight">Ready to launch?</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-2 font-medium">
                  Configure your event foundation. You can customize the look and feel in the next step.
                </p>
              </div>
              
              <div className="space-y-6 w-full">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-left">
                  <div className="flex items-center gap-3 text-blue-600 mb-2">
                    <i className="fa-solid fa-circle-info text-xs"></i>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Quick Tip</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal">
                    You can always change these settings later in the Event Dashboard.
                  </p>
                </div>

                <Link href="#" className="inline-block text-blue-600 hover:text-blue-700 text-xs font-bold transition-all border-b-2 border-blue-100 pb-1 hover:border-blue-600">
                  Plan Comparison Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
