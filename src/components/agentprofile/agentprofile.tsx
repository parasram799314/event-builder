"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  MessageCircle, 
  Pencil, 
  MapPin, 
  Globe, 
  FileText,
  Briefcase,
  Share2,
  Building2,
  BadgeCheck,
  Navigation,
  Download,
  Mail,
  Phone,
  LayoutGrid,
  Check,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Facebook, Linkedin, Twitter, Instagram } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface AgentProfileViewAltProps {
  profile: any;
  onEdit: () => void;
  onUpdate?: (updatedProfile: any) => void;
  isOwner?: boolean;
  onThemeChange?: () => void;
}

export function AgentProfileViewAlt({ profile, onEdit, onUpdate, isOwner = false, onThemeChange }: AgentProfileViewAltProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const downloadPDF = async () => {
    const element = document.getElementById("agent-profile-alt-content");
    if (!element) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#fafafa" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${profile.fullName.replace(/\s+/g, "_")}_Profile.pdf`);
      toast({ title: "Success", description: "Profile PDF downloaded successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/agents?id=${profile.userId}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link Copied", description: "Profile link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div id="agent-profile-alt-content" className="w-full max-w-full flex flex-col gap-6 animate-in fade-in duration-500 bg-transparent font-sans overflow-x-hidden">
      
      {/* ─── HEADER CARD (LinkedIn Style) ─── */}
      <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white w-full">
        {/* Banner Cover Image */}
        <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] bg-slate-100">
          <img 
            src={profile?.coverImage || "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop"} 
            alt="Cover" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/15" />
          
          {isOwner && (
            <button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors">
              <Pencil className="h-3 w-3" /> Edit Cover
            </button>
          )}
        </div>

        {/* Profile Info Details Area */}
        <CardContent className="px-6 sm:px-8 md:px-10 pb-8 pt-0 relative z-10">
          {/* Overlapping Avatar Photo */}
          <div className="relative inline-block w-28 h-28 md:w-36 md:h-36 -mt-14 md:-mt-18">
            <div className="w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={profile.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-700 font-extrabold text-4xl bg-slate-200">
                  {profile?.fullName?.[0]}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-2 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow" title="Online now">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Details & Info Block */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  {profile.fullName}
                </h1>
                {profile.isVerified && (
                  <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" strokeWidth={2.5} title="Verified Travel Professional" />
                )}
              </div>
              
              <p className="text-slate-700 font-semibold text-base sm:text-lg leading-snug">
                {profile.title || "Luxury Destination Planner"} at <span className="text-blue-600 font-bold hover:underline cursor-pointer">{profile.agencyName}</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-slate-500 text-sm font-medium pt-1">
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {profile.location}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-bold hover:underline cursor-pointer">500+ connections</span>
                <span className="text-slate-300">•</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                  Travel Agent
                </span>
              </div>
            </div>

            {/* Actions Button Row */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end shrink-0">
              <a 
                href={`https://wa.me/${profile.whatsappNumber?.replace(/[^0-9]/g, "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="h-10 px-5 bg-[#25D366] hover:bg-[#20ba59] hover:shadow-md text-white font-bold rounded-xl border-none transition-all active:scale-95 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 fill-white" /> Contact Me
                </Button>
              </a>

              <button 
                onClick={copyToClipboard}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-bold text-xs shadow-sm transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4 text-slate-500" />}
                {copied ? "Copied!" : "Share Profile"}
              </button>

              <button 
                onClick={downloadPDF}
                disabled={downloading}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-bold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-slate-500" />
                {downloading ? "Saving..." : "Save PDF"}
              </button>

              {onThemeChange && (
                <button 
                  onClick={onThemeChange}
                  className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-all shadow-sm"
                  title="Change Theme Layout"
                >
                  <LayoutGrid className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── TWO-COLUMN WORKSPACE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Columns: Main Details (66.6% on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* About/Summary Section */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                About & Travel Philosophy
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              As a dedicated destination planner at {profile.agencyName}, I specialize in crafting bespoke holiday plans tailored to individual travel desires. My focus lies in curating premium, hassle-free vacations featuring luxury accommodations, hand-picked activities, and smooth logistics. Whether it is a corporate team retreat or a luxury family wedding abroad, I ensure every travel experience turns into a lifetime memory.
            </p>
          </Card>

          {/* Corporate Identity / Experience Block */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Agency & Operations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Agency Partner</span>
                    <span className="text-sm font-bold text-slate-800 leading-snug">{profile.agencyName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-650 shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Expertise Tier</span>
                    <span className="text-sm font-bold text-slate-800 leading-snug">{profile.title || "Travel Specialist"}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Head Office Address</span>
                    <span className="text-sm font-bold text-slate-700 leading-relaxed block">{profile.businessAddress || "New Delhi, India"}</span>
                  </div>
                </div>
              </div>

              {/* HQ Map Showcase */}
              <div className="h-[180px] rounded-2xl overflow-hidden border border-slate-200 relative group cursor-pointer shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" 
                  alt="Office Map Preview"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600 group-hover:scale-105 transition-all">
                    <Navigation className="h-5 w-5" fill="currentColor" fillOpacity={0.1} />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-100">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide">Live Agency Office</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Visual Gallery Showcase */}
          {profile?.gallery && profile.gallery.length > 0 && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
                <LayoutGrid className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  Experience Gallery
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.gallery.slice(0, 3).map((imgUrl: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-150 relative group cursor-zoom-in bg-slate-50"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Gallery view ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Resource & Documents PDF Center */}
          {profile?.moreInfo && profile.moreInfo.length > 0 && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  Travel Brochures & Resources
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.moreInfo.map((doc: any, idx: number) => (
                  <a 
                    key={idx} 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">{doc.label}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Secure PDF Resource</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            </Card>
          )}

        </div>

        {/* Right Columns: Sidebar Core Info (33.3% on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Membership Tier Indicator */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 relative overflow-hidden">
            {/* Subtle Gradient background highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
              <BadgeCheck className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Networking Status</h4>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-400 to-amber-250 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                ★
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">Gold Travel Agent</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Verified Network Partner</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Trust Index Score</span>
              <span className="text-slate-900 font-extrabold">9.8 / 10</span>
            </div>
          </Card>

          {/* Core Contacts Cards */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
              <Mail className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Direct Contact Channels</h4>
            </div>
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email Address", val: profile.email, color: 'text-blue-600', bg: 'bg-blue-50', link: `mailto:${profile.email}` },
                { icon: Phone, label: "Direct Phone Call", val: profile.contactNumber, color: 'text-indigo-600', bg: 'bg-indigo-50', link: `tel:${profile.contactNumber}` },
                { icon: MessageCircle, label: "WhatsApp Chat", val: profile.whatsappNumber, color: 'text-emerald-600', bg: 'bg-emerald-50', link: `https://wa.me/${profile.whatsappNumber?.replace(/[^0-9]/g, "")}` }
              ].map((chan, i) => (
                <a 
                  key={i} 
                  href={chan.link} 
                  target={chan.icon === MessageCircle ? "_blank" : undefined}
                  rel={chan.icon === MessageCircle ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", chan.bg)}>
                    <chan.icon className={cn("h-4.5 w-4.5", chan.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{chan.label}</span>
                    <span className="text-xs font-extrabold text-slate-800 truncate block group-hover:text-blue-600">{chan.val || "Not Available"}</span>
                  </div>
                </a>
              ))}
            </div>
          </Card>

          {/* Social Presence Card */}
          {profile?.socialLinks && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
                <Share2 className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Social Network Links</h4>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {profile.socialLinks.linkedin && (
                  <a 
                    href={profile.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all flex items-center justify-center"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.facebook && (
                  <a 
                    href={profile.socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-all flex items-center justify-center"
                    title="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a 
                    href={profile.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-[#1da1f2]/10 text-[#1da1f2] hover:bg-[#1da1f2] hover:text-white transition-all flex items-center justify-center"
                    title="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a 
                    href={profile.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center"
                    title="Website Portal"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Expertises and Specializations Tags Card */}
          {profile?.tags && profile.tags.length > 0 && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
                <Globe className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Destinations & Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag: string, i: number) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
