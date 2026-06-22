"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { mockCompanies } from "@/lib/mockData";
import { CompanyProfileView } from "@/components/companyprofile/companyprofile";
import { Navbar } from "@/components/editor/ThemeOne";

function CompaniesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("id");
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

  // Get all unique tags from companies
  const allTags = ["All", ...Array.from(new Set(mockCompanies.flatMap(company => company.tags || [])))];

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = 
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === "All" || company.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const selectedCompany = mockCompanies.find(c => c.companyName === companyId);

  // If a specific company is selected, show their profile view
  if (selectedCompany) {
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
                    router.push("/companies");
                  }
                }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i> {from ? "Back to Event" : "Back to Companies"}
              </button>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="/agents" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Agents
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
          <CompanyProfileView 
            profile={selectedCompany}
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
          <span className="text-sm font-bold text-slate-800">Companies</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Home
          </Link>
          <Link href="/agents" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Agents
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="py-8 px-4 text-center max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Companies Directory
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore and connect with verified travel businesses & SaaS solutions
        </p>
      </header>

      {/* Main Listing Section */}
      <main className="max-w-xl mx-auto px-4 pb-16">
        {/* Search Bar (Instagram style) */}
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

        {/* Tag Filters (Pills) */}
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

        {/* Instagram style Business/User List Box */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {filteredCompanies.length > 0 ? (
            <div className="flex flex-col">
              {filteredCompanies.map((company) => (
                <div 
                  key={company.companyName}
                  className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left Side: Logo + Details */}
                  <div 
                    onClick={() => router.push(`/companies?id=${company.companyName}`)}
                    className="flex items-center flex-1 min-w-0 cursor-pointer group"
                  >
                    {/* Circle Avatar / Logo Wrapper */}
                    <div className="h-12 w-12 rounded-full border border-slate-100 overflow-hidden bg-slate-50 shrink-0 relative">
                      {company.logo ? (
                        <img src={company.logo} alt={company.companyName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-500 text-lg font-bold bg-slate-250">{company.companyName[0]}</div>
                      )}
                    </div>

                    {/* Company name + Tagline + Industry/Location */}
                    <div className="ml-4 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800 group-hover:text-amber-500 transition-colors truncate">
                          {company.companyName}
                        </span>
                        {company.isVerified && (
                          <i className="fa-solid fa-circle-check text-blue-500 text-xs" title="Verified Partner"></i>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate font-semibold leading-snug">
                        {company.tagline}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {company.location} • {company.industry}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: View Action Button */}
                  <button 
                    onClick={() => router.push(`/companies?id=${company.companyName}`)}
                    className="ml-4 shrink-0 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <i className="fa-solid fa-building-circle-xmark text-3xl text-slate-300 mb-3"></i>
              <h3 className="text-sm font-bold text-slate-700">No companies found</h3>
              <p className="text-slate-450 text-xs mt-1">Try adapting your search or filter tags</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Directory...</p>
        </div>
      </div>
    }>
      <CompaniesContent />
    </Suspense>
  );
}
