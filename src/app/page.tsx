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
  const [activeTab, setActiveTab] = useState("All"); // Default to "All" instead of "Running"
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

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/websites");
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error (${res.status}):`, errorText);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but received:", text.substring(0, 100));
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        // Map API data to local Event interface for display
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
    
    // Simple validation
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    const eventDateTime = startDate && startTime ? `${startDate}T${startTime}` : startDate ? `${startDate}T00:00` : null;

    const payload = {
      title: eventName,
      theme: eventType.toLowerCase(), // virtual, in-person, etc.
      status: "draft",
      eventDate: startDate || null,
      eventTime: startTime || null,
      endDate: endDate || null,
      endTime: endTime || null,
      lastModifiedBy: "JD",
      content: {
        sections: [
          { 
            id: 'hero', 
            type: 'HERO', 
            isVisible: true, 
            data: { 
              slides: [{
                id: 1,
                title: eventName,
                subtitle: `Experience the pinnacle of ${category.toLowerCase()} innovation. Join industry leaders for an exclusive journey through strategic excellence and groundbreaking insights.`,
                images: [],
                currentImageIndex: 0,
                button: { label: 'REGISTER NOW', link: '#' }
              }],
              dateTimeSettings: {
                showDate: true,
                showTime: true,
                showVenue: true,
                eventDate: eventDateTime || '2026-06-18T08:00',
                venueText: eventType === 'In-person' ? 'Main Venue' : eventType,
                widgetSize: 'Medium',
                showIcons: true,
                textColor: '#475569'
              }
            } 
          },
          { id: 'whyAttend', type: 'WHY_ATTEND', isVisible: true },
          { id: 'speakers', type: 'SPEAKERS', isVisible: true, data: { items: [] } },
          { id: 'sessions', type: 'SESSIONS', isVisible: true },
          { id: 'venue', type: 'VENUE', isVisible: true, data: {} },
          { id: 'contact', type: 'GET_IN_TOUCH', isVisible: true, data: {} },
        ]
      }
    };

    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        // Redirect to editor with the new ID
        router.push(`/editor?id=${result.id}`);
      } else {
        const errorMsg = result.details || result.error || "Failed to create event";
        const hint = result.hint ? `\n\nHint: ${result.hint}` : "";
        alert(`${errorMsg}${hint}`);
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      alert("Something went wrong. Please check your internet connection and try again.");
    }
  };

  const tabs = [
    "Running",
    "Upcoming",
    "Drafts",
    "Past",
    "Cancelled",
    "All",
    "Trash",
  ];

  const filteredEvents = events.filter((event) => {
    if (activeTab === "All") return event.status !== "trash";
    if (activeTab === "Trash") return event.status === "trash";
    if (activeTab === "Drafts") return event.status === "draft";
    if (activeTab === "Cancelled") return event.status === "cancelled";
    
    const eventDate = event.rawDate ? new Date(event.rawDate) : null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (eventDate) {
      const d = new Date(eventDate);
      d.setHours(0, 0, 0, 0);
      
      if (activeTab === "Upcoming") {
        return d > now && event.status !== "trash" && event.status !== "cancelled";
      }
      if (activeTab === "Past") {
        return d < now && event.status !== "trash" && event.status !== "cancelled";
      }
      if (activeTab === "Running") {
        return d.getTime() === now.getTime() && event.status !== "trash" && event.status !== "cancelled";
      }
    }
    
    return false;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      {/* TOP NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[#f0bf4c] h-14 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo3.png" 
              alt="Logo" 
              width={120} 
              height={40} 
              className="object-contain"
            />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/" className="text-black hover:text-black/80 transition-colors">Home</Link>
            <Link href="#" className="text-black hover:text-black/80 transition-colors">Portal Settings</Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-14">
        {/* LEFT SIDEBAR */}
        <aside className="fixed left-0 top-14 w-60 h-full bg-slate-50 border-r border-slate-200 pt-4 z-20">
          <div className="flex flex-col px-2 gap-1">
            <div className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer rounded-md bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50">
              <i className="fa-solid fa-calendar-days text-blue-500"></i>
              Events
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition-all">
              <i className="fa-solid fa-user-group text-slate-400"></i>
              Attendee Profiles
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition-all">
              <i className="fa-solid fa-gear text-slate-400"></i>
              Space Settings
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ml-60 flex-1 p-8 bg-white min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Event - Default Space</h1>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-white hover:bg-slate-50 text-black border border-slate-200 px-4 py-2 rounded text-sm font-semibold transition-all active:scale-95 shadow-sm"
              >
                Create Event
              </button>
            </div>

            {/* TAB BAR */}
            <div className="border-b border-slate-200 flex gap-8 mb-8 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap ${
                    activeTab === tab
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* CONTENT AREA */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="group relative border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all bg-white cursor-pointer overflow-hidden" 
                    onClick={() => router.push(`/editor?id=${event.id}`)}
                  >
                    {/* Hover Overlay with Edit Button */}
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-blue-100 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <i className="fa-solid fa-pencil text-blue-600 text-sm"></i>
                        <span className="text-blue-600 font-bold text-sm">Edit Event</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit uppercase ${
                          event.status === 'draft' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                          event.status === 'published' ? 'bg-green-50 text-green-600 border border-green-100' :
                          'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {event.type}
                        </span>
                      </div>
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" 
                        onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {event.name}
                    </h3>

                    <div className="pt-4 border-t border-slate-50 space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <i className="fa-regular fa-calendar"></i>
                        </div>
                        {event.startDate || "Date not set"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <i className="fa-regular fa-clock"></i>
                        </div>
                        {event.startTime || "Time not set"}
                      </div>
                    </div>

                    {/* Quick Stats or Info */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                            <i className="fa-solid fa-user text-[10px] text-slate-300"></i>
                          </div>
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400">
                          +0
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        0 Views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                  <i className="fa-solid fa-folder-open text-slate-300 text-3xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">No events found</h3>
                <p className="text-slate-500 max-w-xs text-center text-sm leading-relaxed">
                  You haven't created any events in the <span className="font-semibold text-slate-700">{activeTab}</span> category yet.
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="mt-8 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group"
                >
                  <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i>
                  Create your first event
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header: ALWAYS visible at top */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
              <h2 className="text-xl font-bold text-slate-900">Create Event</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Body: Scrollable part */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="flex gap-8">
                {/* Left side: Form content */}
                <div className="flex-1 space-y-8">
                  {/* EVENT TYPE CARDS */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4 block">Select Event Format</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "In-person", icon: "fa-location-dot", desc: "Physical gathering" },
                        { id: "Virtual", icon: "fa-video", desc: "Hosted online" },
                        { id: "Hybrid", icon: "fa-people-arrows", desc: "Physical & virtual" }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setEventType(type.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            eventType === type.id 
                              ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                              : "border-slate-100 hover:border-blue-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                            eventType === type.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                          }`}>
                            <i className={`fa-solid ${type.icon} text-sm`}></i>
                          </div>
                          <div className="font-bold text-slate-900 text-sm mb-1">{type.id}</div>
                          <div className="text-[10px] text-slate-500 leading-relaxed font-medium">{type.desc}</div>
                          {eventType === type.id && (
                            <div className="absolute top-3 right-3 text-blue-600 text-xs">
                              <i className="fa-solid fa-circle-check"></i>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Event Name <span className="text-red-500">*</span></label>
                        <span className="text-[11px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded">{eventName.length}/255</span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="e.g. Annual Tech Conference 2026"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Industry Category</label>
                        <div className="relative">
                          <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none appearance-none transition-all text-slate-900 font-medium bg-white"
                          >
                            <option>Others</option>
                            <option>Business</option>
                            <option>Technology</option>
                            <option>Entertainment</option>
                          </select>
                          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Default Language</label>
                        <div className="relative">
                          <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none appearance-none transition-all text-slate-900 font-medium bg-white"
                          >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                            <option>French</option>
                          </select>
                          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="flex gap-4">
                        {/* START SCHEDULE */}
                        <div className="flex-1 min-w-0">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">START SCHEDULE</label>
                          <div className="flex gap-2">
                            <div className="relative flex-[1.2] min-w-0">
                              <i className="fa-regular fa-calendar absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                              <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-8 pr-1 py-1.5 border border-slate-200 rounded-lg text-[11px] outline-none focus:border-blue-500 transition-colors bg-white shadow-sm"
                              />
                            </div>
                            <div className="relative flex-1 min-w-0">
                              <i className="fa-regular fa-clock absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                              <input 
                                type="time" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full pl-8 pr-1 py-1.5 border border-slate-200 rounded-lg text-[11px] outline-none focus:border-blue-500 transition-colors bg-white shadow-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* END SCHEDULE */}
                        <div className="flex-1 min-w-0">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">END SCHEDULE</label>
                          <div className="flex gap-2">
                            <div className="relative flex-[1.2] min-w-0">
                              <i className="fa-regular fa-calendar absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                              <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-8 pr-1 py-1.5 border border-slate-200 rounded-lg text-[11px] outline-none focus:border-blue-500 transition-colors bg-white shadow-sm"
                              />
                            </div>
                            <div className="relative flex-1 min-w-0">
                              <i className="fa-regular fa-clock absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                              <input 
                                type="time" 
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full pl-8 pr-1 py-1.5 border border-slate-200 rounded-lg text-[11px] outline-none focus:border-blue-500 transition-colors bg-white shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Side info */}
                <div className="w-64 shrink-0 bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center h-fit sticky top-0">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-2xl mb-6 mx-auto">
                    <i className="fa-solid fa-calendar-plus text-blue-600"></i>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-tight">Ready to launch?</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">
                    Configure your event foundation. You can customize the look and feel in the next step.
                  </p>
                  
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100 text-left w-full">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <i className="fa-solid fa-circle-info text-[10px]"></i>
                      <span className="text-[9px] font-bold uppercase tracking-wider">Quick Tip</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-normal">
                      You can always change these settings later in the Event Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: ALWAYS visible at bottom */}
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                className="px-8 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
