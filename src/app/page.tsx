"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  name: string;
  type: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  language: string;
  status: string;
  rawDate: string | null;
}

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  // Form State
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

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/websites");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        const mappedEvents = data.map((w: any) => ({
          id: w.id.toString(),
          name: w.title,
          type: w.theme === 'virtual' ? 'Virtual' : 'In-person',
          category: 'Business',
          startDate: w.eventDate ? new Date(w.eventDate).toLocaleDateString() : '',
          startTime: w.eventTime || '',
          endDate: w.endDate ? new Date(w.endDate).toLocaleDateString() : '',
          endTime: w.endTime || '',
          language: 'English',
          status: w.status || 'draft',
          rawDate: w.eventDate || null
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch websites:", error);
    }
  };

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
        const result = await res.json();
        router.push(`/editor?id=${result.id}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const filteredEvents = events.filter((event) => event.status !== "trash");

  // Common Styles for Design Tokens
  const amberBorder = "rgba(247, 190, 57, 0.2)";
  const primaryAmber = "#F7BE39";
  const lightAmber = "#FFF3D7";
  const darkGrey = "#334155"; // Changed from #1a1a1a (Black) to Grey

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-inter text-[#334155] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* TOP NAVBAR */}
      <nav className="shrink-0 h-16 bg-white flex items-center justify-between px-6 md:px-10 z-[100] border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-10">
          <Image src="/logo3.png" alt="Logo" width={110} height={32} className="object-contain" />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: darkGrey, color: '#FFFFFF', borderRadius: '8px' }}
          className="px-5 py-2 text-sm font-semibold active:scale-95 transition-all tracking-[0.2px] shadow-sm hover:opacity-90"
        >
          + Create Event
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto pb-10">
          {/* CONTENT AREA */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  style={{ border: `1px solid #E2E8F0`, borderRadius: '12px' }}
                  className="bg-white p-5 hover:border-[#94A3B8] transition-all cursor-pointer group flex flex-col h-[160px] shadow-sm hover:shadow-md" 
                  onClick={() => router.push(`/editor?id=${event.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {event.status}
                    </span>
                    <div className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-[#94A3B8] group-hover:text-[#334155] group-hover:border-[#334155] transition-all">
                      <i className="fa-solid fa-pencil text-[10px]"></i>
                    </div>
                  </div>
                  <h3 className="font-bold text-[#334155] text-base mb-auto leading-tight group-hover:text-blue-600 truncate">{event.name}</h3>
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium"><i className="fa-regular fa-calendar"></i>{event.startDate || "N/A"}</div>
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium"><i className="fa-regular fa-clock"></i>{event.startTime || "N/A"}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <h3 className="font-bold text-[#334155] text-2xl mb-2">No events found</h3>
              <p className="text-[#64748B] font-medium text-sm mb-8">Start by creating your first professional event infrastructure.</p>
              <button 
                onClick={() => setShowModal(true)}
                style={{ backgroundColor: darkGrey, color: '#FFFFFF', borderRadius: '10px' }}
                className="px-8 py-3.5 font-bold transition-all shadow-lg hover:opacity-90"
              >
                + Create Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PREMIUM MOBILE FORM UI - Amber Theme */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-0 animate-in fade-in duration-300">
          <div 
            className="md:max-h-[844px] md:rounded-[16px] overflow-hidden shadow-2xl animate-in zoom-in-95 border"
            style={{ 
              width: '100%', maxWidth: '400px', height: '100%', maxHeight: '90vh',
              backgroundColor: '#FFFFFF', fontFamily: "'Inter', sans-serif",
              display: 'flex', flexDirection: 'column', borderColor: '#E2E8F0'
            }}
          >
            {/* STICKY TOP BAR */}
            <div className="shrink-0 h-[64px] border-b px-5 flex items-center bg-white z-10" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center mr-2 text-[#64748B] hover:text-[#334155]"><i className="fa-solid fa-arrow-left text-lg"></i></button>
              <h2 className="text-[18px] font-bold text-[#334155] flex-1">Create New Event</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center text-[#64748B] hover:text-[#334155]"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 custom-scrollbar">
              <div className="space-y-3">
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>FORMAT</label>
                <div className="flex flex-wrap gap-2">
                  {["In-person", "Virtual", "Hybrid"].map((type) => (
                    <button key={type} onClick={() => setEventType(type)} 
                      style={{ 
                        padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, 
                        border: eventType === type ? `1.5px solid ${darkGrey}` : `1px solid #E2E8F0`, 
                        backgroundColor: eventType === type ? darkGrey : '#FFFFFF', 
                        color: eventType === type ? '#FFFFFF' : '#475569' 
                      }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "Event Name", value: eventName, change: setEventName, placeholder: "e.g. Global Tech Summit 2026" },
                { label: "Category", value: category, change: setCategory, type: "select", options: ["Business", "Tech", "Entertainment", "Educational", "Others"] },
                { label: "Language", value: language, change: setLanguage, type: "select", options: ["English", "Spanish", "French", "German", "Hindi"] }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>{field.label.toUpperCase()}</label>
                  {field.type === "select" ? (
                    <select value={field.value} onChange={(e) => field.change(e.target.value)}
                      style={{ width: '100%', height: '44px', border: `1px solid #E2E8F0`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', fontWeight: 500, color: '#334155', outline: 'none' }}>
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={field.value} onChange={(e) => field.change(e.target.value)} placeholder={field.placeholder}
                      style={{ width: '100%', height: '44px', border: `1px solid #E2E8F0`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', fontWeight: 500, color: '#334155', outline: 'none' }} />
                  )}
                </div>
              ))}

              <div className="space-y-6">
                <div className="space-y-3">
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>START SCHEDULE</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', height: '44px', border: `1px solid #E2E8F0`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#334155', outline: 'none' }} />
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', height: '44px', border: `1px solid #E2E8F0`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#334155', outline: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: '100px', border: `2px dashed #E2E8F0`, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer' }} className="hover:bg-slate-50 transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-[#94A3B8] text-xl mb-2"></i>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Upload Event Cover</span>
              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="shrink-0 h-[80px] border-t px-6 flex items-center justify-between bg-white z-10" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={() => setShowModal(false)} className="text-sm font-semibold text-[#64748B] hover:text-[#334155]">Cancel</button>
              <div className="flex items-center gap-3">
                <button onClick={handleCreate} style={{ backgroundColor: darkGrey, color: '#FFFFFF', borderRadius: '8px', height: '44px' }} className="px-10 text-sm font-bold tracking-[0.2px] shadow-lg shadow-slate-200 hover:opacity-90 active:scale-95 transition-all">Create Event</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
