"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { mockAgents } from "@/lib/mockData";
import { AgentProfileViewAlt } from "@/components/agentprofile/agentprofile";
import { Navbar } from "@/components/editor/ThemeOne";

function AgentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = searchParams.get("id");
  const from = searchParams.get("from");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [website, setWebsite] = useState<any>(null);

  useEffect(() => {
    const match = from ? from.match(/\/preview\/(\d+)/) : null;
    const websiteId = match ? match[1] : null;
    if (!websiteId) return;

    fetch(`/api/websites`)
      .then(res => res.json())
      .then(data => {
        const current = data.find((w: any) => w.id === parseInt(websiteId));
        if (current) {
          setWebsite(current);
        }
      })
      .catch(err => console.error("Error fetching website for navbar:", err));
  }, [from]);

  // Get all unique tags from agents
  const allTags = ["All", ...Array.from(new Set(mockAgents.flatMap(agent => agent.tags || [])))];

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = 
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === "All" || agent.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const selectedAgent = mockAgents.find(a => a.userId === agentId);

  // If a specific agent is selected, show their profile view
  if (selectedAgent) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Navbar */}
        {website ? (
          <Navbar 
            primaryColor={website.content?.themeConfig?.primaryColor || '#FFC107'}
            isReadOnly={true}
            logo={website.content?.sections?.find((s: any) => s.type === 'HERO')?.data?.logo || website.logo}
            profiles={website.content?.eventProfiles}
            sections={website.content?.sections}
            showVisitorsPage={true}
            onTabChange={(tabName) => {
              const match = from ? from.match(/\/preview\/\d+/) : null;
              const previewUrl = match ? match[0] : `/preview/${website.id}`;
              router.push(`${previewUrl}?tab=${tabName.toLowerCase()}`);
            }}
            onVisitorsClick={() => {
              const match = from ? from.match(/\/preview\/\d+/) : null;
              const previewUrl = match ? match[0] : `/preview/${website.id}`;
              router.push(`${previewUrl}?tab=visitors`);
            }}
            onProfileTabClick={() => {
              const match = from ? from.match(/\/preview\/\d+/) : null;
              const previewUrl = match ? match[0] : `/preview/${website.id}`;
              router.push(`${previewUrl}`);
            }}
          />
        ) : (
          <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (from) {
                    router.push(from);
                  } else {
                    router.push("/agents");
                  }
                }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i> {from ? "Back to Event" : "Back to Agents"}
              </button>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="/companies" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Companies
              </Link>
            </div>
          </nav>
        )}

        {/* Profile Content */}
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-6 pt-24">
          {from && (
            <button 
              onClick={() => router.push(from)}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              style={{ borderColor: website?.content?.themeConfig?.primaryColor || undefined }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Event Website
            </button>
          )}
          <AgentProfileViewAlt 
            profile={selectedAgent}
            onEdit={() => {}}
            isOwner={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-slate-800">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo3.png" alt="Logo" width={110} height={32} className="object-contain" />
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-slate-800">Agents</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Home
          </Link>
          <Link href="/companies" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Companies
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="py-8 px-4 text-center max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Agents Directory
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore and connect with verified travel agents
        </p>
      </header>

      {/* Main Listing Section */}
      <main className="max-w-xl mx-auto px-4 pb-16">
        {/* Search Bar (Instagram style: rounded, light bg) */}
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#EFEFEF] hover:bg-[#E5E5E5] focus:bg-[#EFEFEF] border-0 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all"
          />
        </div>

        {/* Tag Filters (Sleek Pills) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTag === tag 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Instagram style User List Box */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {filteredAgents.length > 0 ? (
            <div className="flex flex-col">
              {filteredAgents.map((agent) => (
                <div 
                  key={agent.userId}
                  className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left Side: Avatar + Details */}
                  <div 
                    onClick={() => router.push(`/agents?id=${agent.userId}`)}
                    className="flex items-center flex-1 min-w-0 cursor-pointer group"
                  >
                    {/* Circle Avatar */}
                    <div className="h-12 w-12 rounded-full border border-slate-100 overflow-hidden bg-slate-50 shrink-0 relative">
                      {agent.profileImage ? (
                        <img src={agent.profileImage} alt={agent.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-500 text-lg font-bold bg-slate-250">{agent.fullName[0]}</div>
                      )}
                    </div>

                    {/* Name + Title + Agency info */}
                    <div className="ml-4 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {agent.fullName}
                        </span>
                        {agent.isVerified && (
                          <i className="fa-solid fa-circle-check text-blue-500 text-xs" title="Verified Agent"></i>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate font-semibold leading-snug">
                        {agent.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {agent.location} • {agent.agencyName}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: View Action Button */}
                  <button 
                    onClick={() => router.push(`/agents?id=${agent.userId}`)}
                    className="ml-4 shrink-0 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <i className="fa-solid fa-user-slash text-3xl text-slate-300 mb-3"></i>
              <h3 className="text-sm font-bold text-slate-700">No agents found</h3>
              <p className="text-slate-450 text-xs mt-1">Try adapting your search or filter tags</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Directory...</p>
        </div>
      </div>
    }>
      <AgentsContent />
    </Suspense>
  );
}
