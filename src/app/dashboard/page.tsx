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
  const [domainType, setDomainType] = useState("subdomain");
  const [domainValue, setDomainValue] = useState("");

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/websites");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setWebsites(data);
      }
    } catch (error: any) {
      console.error("CRITICAL: Failed to fetch websites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleCreate = async () => {
    if (!eventName) return;
    const payload = {
      title: eventName,
      theme: eventType.toLowerCase(),
      status: "draft",
      eventDate: startDate || null,
      eventTime: startTime || null,
      endDate: endDate || null,
      endTime: endTime || null,
      lastModifiedBy: "JD",
      domainType,
      domainValue,
      content: { sections: [] }
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
      const res = await fetch(`/api/websites?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setWebsites(websites.filter(w => w.id !== id));
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* TOP NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-6 md:px-10 z-[100] border-b border-slate-100">
        <div className="flex items-center gap-10">
          <Image src="/logo3.png" alt="Logo" width={120} height={36} className="object-contain" />
        </div>
        <button onClick={() => setShowModal(true)} className="bg-slate-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all shadow-md">+ Create Event</button>
      </nav>

      {/* SIDEBAR */}
      <div className={styles.sidebarContainer}>
        <aside className={styles.sidebar1}>
        </aside>
      </div>

      {/* MAIN CONTENT */}
      <main className={styles.mainWrapper}>
        <div className={styles.container}>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10">Event Websites</h1>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[#F7BE39] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Loading your websites...</p>
            </div>
          ) : (
            websites.map((website) => (
              <div key={website.id} className={styles.mainCard}>
                <div className={styles.previewContainer}>
                  <div className={styles.previewCard}>
                    <h2>{website.title}</h2>
                    <button className={styles.registerBtn}>REGISTER NOW</button>
                  </div>
                </div>
                <div className={styles.infoSection}>
                  <div className={styles.actionButtons}>
                    <button className={styles.editBtn} onClick={() => handleEdit(website.id)}><i className="fa-solid fa-pencil"></i> Edit</button>
                    <button className={styles.previewBtn} onClick={() => handlePreview(website.id)}><i className="fa-solid fa-eye mr-2"></i> Preview</button>
                    <button className={styles.deleteBtnDashboard} onClick={() => handleDelete(website.id, website.title)}><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* PREMIUM MOBILE FORM UI - FULL SCREEN MOBILE */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm p-0 md:p-6 animate-in fade-in duration-300">
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', fontFamily: "'Inter', sans-serif",
              display: 'flex', flexDirection: 'column'
            }}
            className="w-full h-full max-h-screen md:max-w-[1100px] md:h-auto md:max-h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 border border-[#E0E0E0]"
          >
            {/* STICKY TOP BAR */}
            <div className="shrink-0 h-[60px] border-b border-[#E0E0E0] px-4 md:px-8 flex items-center bg-white z-10">
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center mr-2 md:hidden"><i className="fa-solid fa-arrow-left text-xl"></i></button>
              <h2 className="text-[20px] md:text-[24px] font-extrabold text-[#334155] flex-1">Create New Event</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors"><i className="fa-solid fa-xmark text-2xl"></i></button>
            </div>

            {/* SCROLLABLE CONTENT - But optimized for NO scroll on laptop */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-6">
                
                {/* LEFT COLUMN - Primary Details */}
                <div className="md:col-span-7 space-y-6">
                  {/* EVENT NAME */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#666666] uppercase tracking-wider">Event Name</label>
                    <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Global Tech Summit 2024"
                      className="w-full h-[54px] border-[1.5px] border-[#E0E0E0] rounded-xl px-4 text-base font-semibold text-[#334155] focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-all placeholder:text-slate-300" />
                  </div>

                  {/* CATEGORY & LANGUAGE ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-[#666666] uppercase tracking-wider">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-[54px] border-[1.5px] border-[#E0E0E0] rounded-xl px-4 text-base font-semibold text-[#334155] focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none appearance-none bg-white transition-all">
                        {["Others", "Business", "Tech", "Entertainment", "Education"].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-[#666666] uppercase tracking-wider">Language</label>
                      <select value={language} onChange={(e) => setLanguage(e.target.value)}
                        className="w-full h-[54px] border-[1.5px] border-[#E0E0E0] rounded-xl px-4 text-base font-semibold text-[#334155] focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none appearance-none bg-white transition-all">
                        {["English", "Spanish", "French", "German"].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* SCHEDULE GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-3">
                      <label className="text-[13px] font-semibold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2"><i className="fa-regular fa-calendar-check text-blue-500"></i> Start Date & Time</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1 h-12 border border-slate-200 rounded-lg px-3 font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full sm:w-32 h-12 border border-slate-200 rounded-lg px-3 font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[13px] font-semibold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2"><i className="fa-regular fa-calendar-xmark text-red-400"></i> End Date & Time</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1 h-12 border border-slate-200 rounded-lg px-3 font-bold text-sm shadow-sm focus:ring-2 focus:ring-red-500 outline-none" />
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full sm:w-32 h-12 border border-slate-200 rounded-lg px-3 font-bold text-sm shadow-sm focus:ring-2 focus:ring-red-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Format */}
                <div className="md:col-span-5 space-y-8">
                  {/* FORMAT SELECTION */}
                  <div className="space-y-4">
                    <label className="text-[13px] font-semibold text-[#666666] uppercase tracking-wider">Event Format</label>
                    <div className="grid grid-cols-1 gap-4">
                      {["In-person", "Virtual", "Hybrid"].map((type) => (
                        <button key={type} onClick={() => setEventType(type)} 
                          className={`py-4 px-6 rounded-2xl text-[15px] font-bold transition-all border-2 flex items-center gap-4 ${
                            eventType === type ? 'bg-slate-700 text-white shadow-lg' : 'border-[#E0E0E0] bg-white text-slate-600 hover:border-slate-400'
                          }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${eventType === type ? 'border-white' : 'border-slate-300'}`}>
                            {eventType === type && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                          </div>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                      <i className="fa-solid fa-circle-info mr-2"></i>
                      You can add event banners and additional media later in the editor after creating the website.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="shrink-0 h-[80px] border-t border-[#E0E0E0] px-8 flex items-center justify-between bg-white z-10">
              <button onClick={() => setShowModal(false)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">Discard</button>
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 rounded-xl border border-[#E0E0E0] flex items-center justify-center hover:bg-slate-50 transition-all"><i className="fa-solid fa-ellipsis"></i></button>
                <button onClick={handleCreate} className="h-12 px-10 rounded-xl bg-slate-600 text-white text-[15px] font-extrabold hover:bg-slate-700 transition-all shadow-xl shadow-slate-200">Create Event Website</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
