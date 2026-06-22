"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MessageCircle, 
  Pencil, 
  MapPin, 
  Globe, 
  Building2,
  BadgeCheck,
  Navigation,
  Mail,
  Phone,
  Calendar,
  Users,
  Briefcase,
  Star,
  Quote,
  Link as LinkIcon,
  ExternalLink,
  FileText,
  Download,
  Share2,
  Check,
  ChevronRight,
  LayoutGrid
} from "lucide-react";
import { Facebook, Linkedin, Twitter, Instagram, Youtube } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface CompanyProfileViewProps {
  profile: any;
  onEdit?: () => void;
  isOwner?: boolean;
}

export function CompanyProfileView({ profile, onEdit, isOwner = false }: CompanyProfileViewProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const downloadPDF = async () => {
    const element = document.getElementById("company-profile-content");
    if (!element) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fafafa"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${profile.companyName.replace(/\s+/g, "_")}_Profile.pdf`);
      toast({ title: "Success", description: "Company profile PDF downloaded!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/companies?id=${profile.companyName}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link Copied", description: "Company link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div id="company-profile-content" className="w-full max-w-full flex flex-col gap-6 animate-in fade-in duration-500 bg-transparent font-sans overflow-x-hidden">
      
      {/* ─── HEADER CARD (LinkedIn Style) ─── */}
      <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white w-full">
        {/* Banner Cover Image */}
        <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] bg-slate-100">
          <img 
            src={profile?.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"} 
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
          {/* Overlapping Square Company Logo */}
          <div className="relative inline-block w-24 h-24 md:w-32 md:h-32 -mt-12 md:-mt-16">
            <div className="w-full h-full rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
              {profile?.logo ? (
                <img src={profile.logo} alt={profile.companyName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 font-extrabold text-3xl bg-slate-100">
                  {profile?.companyName?.[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow" title="Active Exhibitor">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Details & Info Block */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  {profile.companyName}
                </h1>
                {profile.isVerified && (
                  <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" strokeWidth={2.5} title="Verified Travel Partner" />
                )}
              </div>
              
              <p className="text-amber-600 font-bold text-sm sm:text-base tracking-wide uppercase">
                {profile.tagline || "Innovating Travel Experiences"}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-slate-500 text-sm font-medium pt-1">
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {profile.location}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  {profile.industry}
                </span>
                <span className="text-slate-300">•</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                  Exhibitor
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
                <Button className="h-10 px-5 bg-amber-500 hover:bg-amber-600 hover:shadow-md text-slate-900 font-extrabold rounded-xl border-none transition-all active:scale-95 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 fill-slate-900 text-slate-900" /> Contact Business
                </Button>
              </a>

              <button 
                onClick={copyToClipboard}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-bold text-xs shadow-sm transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4 text-slate-500" />}
                {copied ? "Copied!" : "Share Page"}
              </button>

              <button 
                onClick={downloadPDF}
                disabled={downloading}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-bold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-slate-500" />
                {downloading ? "Saving..." : "Save PDF"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── TWO-COLUMN WORKSPACE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Columns: Main Details (66.6% on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* About Company Section */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Building2 className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Company Overview
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              {profile.description || "At Trav Platforms, we specialize in delivering world-class travel technology and B2B solutions. Our mission is to empower travel agents with the tools they need to succeed in a digital-first world. With over a decade of experience, we've built a reputation for excellence, innovation, and reliability."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Founded</span>
                <span className="text-lg font-bold text-slate-800">{profile.foundedYear || "2015"}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Company Size</span>
                <span className="text-lg font-bold text-slate-800">{profile.teamSize || "50-200"}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Industry</span>
                <span className="text-lg font-bold text-slate-800 truncate block">{profile.industry?.split(" ")[0]}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">HQ Location</span>
                <span className="text-lg font-bold text-slate-800 truncate block">{profile.location?.split(",")[0]}</span>
              </div>
            </div>
          </Card>

          {/* Testimonials Slider (LinkedIn recommendation style with css marquee) */}
          {profile?.testimonials && profile.testimonials.length > 0 && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8 overflow-hidden relative">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  Client Recommendations
                </h2>
              </div>

              <div className="marquee-wrapper">
                <div className="marquee-content">
                  {profile.testimonials.map((t: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="w-[280px] sm:w-[350px] p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 shrink-0 flex flex-col gap-3"
                    >
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="h-3 w-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <Quote className="h-6 w-6 text-slate-200 shrink-0" />
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold italic flex-grow">
                        "{t.content}"
                      </p>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 mt-auto">
                        <img 
                          src={t.image} 
                          alt={t.name} 
                          className="h-9 w-9 rounded-xl object-cover border border-white shadow-sm" 
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-850 truncate">{t.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duplicate for seamless visual loop */}
                <div className="marquee-content" aria-hidden="true">
                  {profile.testimonials.map((t: any, idx: number) => (
                    <div 
                      key={`dup-${idx}`} 
                      className="w-[280px] sm:w-[350px] p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 shrink-0 flex flex-col gap-3"
                    >
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="h-3 w-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <Quote className="h-6 w-6 text-slate-200 shrink-0" />
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold italic flex-grow">
                        "{t.content}"
                      </p>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 mt-auto">
                        <img 
                          src={t.image} 
                          alt={t.name} 
                          className="h-9 w-9 rounded-xl object-cover border border-white shadow-sm" 
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-850 truncate">{t.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <style jsx>{`
                .marquee-wrapper {
                  display: flex;
                  overflow: hidden;
                  gap: 1.5rem;
                  user-select: none;
                  position: relative;
                  width: 100%;
                }
                .marquee-content {
                  flex-shrink: 0;
                  display: flex;
                  justify-content: space-around;
                  gap: 1.5rem;
                  min-width: 100%;
                  animation: scroll-marquee 25s linear infinite;
                }
                .marquee-wrapper:hover .marquee-content {
                  animation-play-state: paused;
                }
                @keyframes scroll-marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(calc(-100% - 1.5rem)); }
                }
              `}</style>
            </Card>
          )}

          {/* Visual Gallery */}
          {profile?.gallery && profile.gallery.length > 0 && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
                <LayoutGrid className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                  Visual Gallery
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {profile.gallery.map((imgUrl: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-150 relative group cursor-zoom-in bg-slate-50 shadow-sm"
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

          {/* HQ Map Directions Section */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-5 md:p-6 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-[35%] relative aspect-[16/9] md:aspect-square lg:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-100 shadow-inner shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" 
                  alt="Location" 
                  className="w-full h-full object-cover grayscale contrast-125" 
                />
                <div className="absolute inset-0 bg-amber-500/10 mix-blend-multiply" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow flex items-center justify-center animate-bounce">
                    <MapPin className="h-5 w-5 text-amber-500" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-[65%] space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">Corporate HQ</span>
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase">Headquarters</h3>
                </div>
                <p className="text-slate-600 font-semibold leading-relaxed text-sm">
                  {profile.businessAddress || "123, Travel Avenue, BKC, Mumbai, Maharashtra 400051"}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button 
                    onClick={() => profile.googleMapLink && window.open(profile.googleMapLink, '_blank')}
                    className="bg-amber-500 hover:bg-amber-600 hover:shadow text-slate-900 font-extrabold rounded-xl px-6 h-10 border-none transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" strokeWidth={3} /> Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Columns: Sidebar Core Info (33.3% on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Direct Channels */}
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
              <Mail className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Direct Contact Channels</h4>
            </div>
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Corporate Email", val: profile.email, color: 'text-amber-600', bg: 'bg-amber-50', link: `mailto:${profile.email}` },
                { icon: Phone, label: "Call Desk", val: profile.contactNumber, color: 'text-indigo-650', bg: 'bg-indigo-50', link: `tel:${profile.contactNumber}` },
                { icon: MessageCircle, label: "WhatsApp Support", val: profile.whatsappNumber, color: 'text-emerald-600', bg: 'bg-emerald-50', link: `https://wa.me/${profile.whatsappNumber?.replace(/[^0-9]/g, "")}` }
              ].map((chan, i) => (
                <a 
                  key={i} 
                  href={chan.link} 
                  target={chan.icon === MessageCircle ? "_blank" : undefined}
                  rel={chan.icon === MessageCircle ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", chan.bg)}>
                    <chan.icon className={cn("h-4.5 w-4.5", chan.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{chan.label}</span>
                    <span className="text-xs font-extrabold text-slate-800 truncate block group-hover:text-amber-500">{chan.val || "Not Available"}</span>
                  </div>
                </a>
              ))}
            </div>
          </Card>

          {/* Social Presence Card */}
          {profile?.socialLinks && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
                <Share2 className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Social Network Channels</h4>
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
                {profile.socialLinks.instagram && (
                  <a 
                    href={profile.socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-[#c13584]/10 text-[#c13584] hover:bg-[#c13584] hover:text-white transition-all flex items-center justify-center"
                    title="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.youtube && (
                  <a 
                    href={profile.socialLinks.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-[#ff0000]/10 text-[#ff0000] hover:bg-[#ff0000] hover:text-white transition-all flex items-center justify-center"
                    title="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
                {profile.website && (
                  <a 
                    href={profile.website} 
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

          {/* Specialities & Tags */}
          {profile?.tags && profile.tags.length > 0 && (
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl p-6">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
                <Globe className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Business Specialities</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag: string, i: number) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-100 hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-default"
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
