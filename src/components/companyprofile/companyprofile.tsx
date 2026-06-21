"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  MessageCircle, 
  MoreHorizontal, 
  Pencil, 
  Camera, 
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
  Download
} from "lucide-react"
import { Facebook, Linkedin, Twitter, Instagram, Youtube } from "@/components/ui/brand-icons"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface CompanyProfileViewProps {
  profile: any
  onEdit?: () => void
  isOwner?: boolean
}

export function CompanyProfileView({ profile, onEdit, isOwner = false }: CompanyProfileViewProps) {
  const [downloading, setDownloading] = useState(false)

  const downloadPDF = async () => {
    const element = document.getElementById("company-profile-content")
    if (!element) return

    setDownloading(true)
    try {
      // Hide buttons temporarily for clean PDF
      const buttons = element.querySelectorAll("button")
      buttons.forEach(btn => (btn.style.display = "none"))

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f9fafb"
      })

      // Restore buttons
      buttons.forEach(btn => (btn.style.display = ""))

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      })

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save(`${profile.companyName.replace(/\s+/g, "_")}_Profile.pdf`)
    } catch (error) {
      console.error("PDF Download Error:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (!profile) return null;

  return (
    <div id="company-profile-content" className="w-full flex flex-col gap-6 max-w-5xl mx-auto pb-20 p-4 md:p-0">
      {/* Profile Header - Matching Agent Profile Structure */}
      <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] overflow-hidden bg-white">
        {/* Cover Image Section */}
        <div className={cn("relative h-56 md:h-64 w-full overflow-hidden", isOwner && "cursor-pointer group")}>
          <img 
            src={profile?.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"} 
            alt="Cover" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); downloadPDF(); }}
              disabled={downloading}
              className="h-9 px-4 rounded-full bg-white/95 backdrop-blur-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-900 shadow-xl transition-all hover:bg-[#F3C03D] hover:text-white active:scale-95 disabled:opacity-50"
            >
              <Download className={cn("h-4 w-4", downloading && "animate-bounce")} />
              {downloading ? "Generating..." : "Download PDF"}
            </button>
            {isOwner && (
              <button className="h-9 px-4 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-900 shadow-lg transition-all hover:bg-white">
                <Camera className="h-4 w-4" />
                Change Cover
              </button>
            )}
          </div>
        </div>
        <CardContent className="pt-0 pb-10 px-8 md:px-12">
          <div className="relative">
            {/* Square Logo Overlap */}
            <div className={cn("relative -mt-16 md:-mt-20 ml-4 md:ml-6 inline-block", isOwner && "cursor-pointer group")}>
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-[24px] border-[6px] border-white shadow-2xl overflow-hidden bg-neutral-100 relative">
                {profile?.logo ? (
                  <img src={profile.logo} alt={profile.companyName} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-neutral-200 text-neutral-500 font-bold text-4xl">
                    {profile?.companyName?.[0] || "C"}
                  </div>
                )}
                {isOwner && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              {/* Online Indicator */}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-[4px] border-white shadow-lg flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="mt-6 md:mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight uppercase">
                      {profile?.companyName || "Company Profile"}
                    </h1>
                    {profile?.isVerified && (
                      <BadgeCheck className="h-8 w-8 text-[#0095F6] fill-[#0095F6]/10" strokeWidth={2.5} />
                    )}
                  </div>
                  <p className="text-lg font-bold text-[#F3C03D] mt-1">{profile?.tagline || "Innovating Travel Experiences"}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button className="bg-[#F3C03D] hover:bg-[#eab308] text-neutral-900 font-black rounded-2xl px-8 h-12 shadow-lg shadow-[#F3C03D]/20 border-none transition-all active:scale-95">
                    <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
                    Contact
                  </Button>
                  
                  <Button variant="outline" className="h-12 w-12 rounded-2xl border-[#e5e7eb] hover:bg-neutral-50 flex items-center justify-center">
                    <MoreHorizontal className="h-6 w-6 text-neutral-400" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-6 text-neutral-500 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#F3C03D]" />{profile?.location || "Global HQ"}</div>
                <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-[#F3C03D]" />{profile?.industry || "Travel & Tourism"}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-[#F3C03D]" />{profile?.teamSize || "50-200 Employees"}</div>
                <div className="h-1.5 w-1.5 rounded-full bg-[#F3C03D] hidden md:block" />
                <div className="font-black text-neutral-900">Active Member</div>
              </div>

              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-[#f0f0f0]">
                {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]: any) => {
                  if (!url) return null;
                  const icons: any = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram, twitter: Twitter, youtube: Youtube };
                  const Icon = icons[platform] || Globe;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-[#f9fafb] flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-white hover:shadow-md border border-transparent hover:border-[#F3C03D]/20 transition-all">
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-2 text-xs font-black text-neutral-400 hover:text-[#F3C03D] transition-colors uppercase tracking-[0.1em]">
                    Visit Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Company Section - Full Width */}
      <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white p-8 md:p-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F3C03D]/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-[#F3C03D]" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">About Company</h2>
          </div>
          <p className="text-neutral-600 font-medium leading-relaxed text-lg">
            {profile?.description || "At Trav Platforms, we specialize in delivering world-class travel technology and B2B solutions. Our mission is to empower travel agents with the tools they need to succeed in a digital-first world. With over a decade of experience, we've built a reputation for excellence, innovation, and reliability."}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-6 rounded-[24px] bg-[#f9fafb] border border-[#f0f0f0]">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Founded</p>
              <p className="text-xl font-black text-neutral-900">{profile?.foundedYear || "2015"}</p>
            </div>
            <div className="p-6 rounded-[24px] bg-[#f9fafb] border border-[#f0f0f0]">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Team Size</p>
              <p className="text-xl font-black text-neutral-900">{profile?.teamSize || "50-200"}</p>
            </div>
            <div className="p-6 rounded-[24px] bg-[#f9fafb] border border-[#f0f0f0]">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Industry</p>
              <p className="text-xl font-black text-neutral-900">{profile?.industry?.split(' ')[0] || "Travel"}</p>
            </div>
            <div className="p-6 rounded-[24px] bg-[#f9fafb] border border-[#f0f0f0]">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Location</p>
              <p className="text-xl font-black text-neutral-900">{profile?.location?.split(',')[0] || "Mumbai"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Details Section - Full Width Horizontal */}
      <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F3C03D]/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#F3C03D]" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Contact Information</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Email Address", value: profile?.email || "hello@travplatforms.com", icon: Mail },
            { label: "Phone Number", value: profile?.contactNumber || "+91 98765 43210", icon: Phone },
            { label: "WhatsApp", value: profile?.whatsappNumber || "+91 98765 43210", icon: MessageCircle }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-5 rounded-[24px] bg-[#f9fafb] border border-[#f0f0f0] group hover:bg-white hover:border-[#F3C03D]/20 transition-all">
              <div className="h-12 w-12 rounded-xl bg-white border border-[#f0f0f0] flex items-center justify-center text-neutral-400 group-hover:text-[#F3C03D] transition-colors shadow-sm">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item.label}</p>
                <p className="font-black text-neutral-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Testimonials Section - Infinite Marquee - COMPACT */}
      <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white py-8 md:py-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-[#F3C03D]/5 rounded-full blur-3xl group-hover:bg-[#F3C03D]/10 transition-all duration-1000" />
        
        <div className="flex flex-col items-center text-center mb-8 relative z-10 px-8">
          <p className="text-[10px] font-black text-[#F3C03D] uppercase tracking-[0.4em] mb-1">Success Stories</p>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight uppercase">What Our Clients Say</h2>
          <div className="h-1 w-16 bg-[#F3C03D] mt-3 rounded-full" />
        </div>

        <div 
          className="relative flex overflow-hidden [--gap:1.5rem] [--duration:45s]"
        >
          <div className="flex shrink-0 justify-around gap-[var(--gap)] min-w-full animate-marquee hover:[animation-play-state:paused]">
            {[... (profile?.testimonials?.length > 0 ? profile.testimonials : [
              {
                name: "Sandeep Singh",
                role: "Travel Agency Owner",
                content: "The platform has completely transformed how we handle our B2B bookings. Highly recommended.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop"
              },
              {
                name: "Priya Sharma",
                role: "Operation Manager",
                content: "Exceptional support and cutting-edge features. We've seen a 40% increase in efficiency.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2000&auto=format&fit=crop"
              },
              {
                name: "Rahul Mehra",
                role: "CEO, Mehra Travels",
                content: "Trav Platforms has revolutionized our business. Their itinerary builder is the best in the market.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
              },
              {
                name: "Anjali Gupta",
                role: "Director, Dream Vacations",
                content: "The support team is amazing and the platform is very intuitive. It has saved us countless hours.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
              }
            ])].map((t: any, idx: number) => (
              <div key={idx} className="w-[300px] md:w-[400px] p-6 md:p-8 rounded-[28px] bg-[#f9fafb] border border-[#f0f0f0] hover:border-[#F3C03D]/30 transition-all group/t flex flex-col items-center text-center shrink-0">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-[#F3C03D] text-[#F3C03D]" />)}
                </div>
                <Quote className="h-8 w-8 text-[#F3C03D]/10 mb-4 group-hover/t:text-[#F3C03D]/20 transition-colors" />
                <p className="text-neutral-600 font-medium italic mb-6 leading-relaxed text-sm md:text-base">"{t.content}"</p>
                <div className="mt-auto flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="h-10 w-10 rounded-xl object-cover grayscale group-hover/t:grayscale-0 transition-all border-2 border-white shadow-sm" />
                  <div className="text-left">
                    <p className="text-[11px] font-black text-neutral-900 uppercase tracking-widest leading-none mb-1">{t.name}</p>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0 justify-around gap-[var(--gap)] min-w-full animate-marquee hover:[animation-play-state:paused]" aria-hidden="true">
            {[... (profile?.testimonials?.length > 0 ? profile.testimonials : [
              {
                name: "Sandeep Singh",
                role: "Travel Agency Owner",
                content: "The platform has completely transformed how we handle our B2B bookings. Highly recommended.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop"
              },
              {
                name: "Priya Sharma",
                role: "Operation Manager",
                content: "Exceptional support and cutting-edge features. We've seen a 40% increase in efficiency.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2000&auto=format&fit=crop"
              },
              {
                name: "Rahul Mehra",
                role: "CEO, Mehra Travels",
                content: "Trav Platforms has revolutionized our business. Their itinerary builder is the best in the market.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
              },
              {
                name: "Anjali Gupta",
                role: "Director, Dream Vacations",
                content: "The support team is amazing and the platform is very intuitive. It has saved us countless hours.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
              }
            ])].map((t: any, idx: number) => (
              <div key={`dup-${idx}`} className="w-[300px] md:w-[400px] p-6 md:p-8 rounded-[28px] bg-[#f9fafb] border border-[#f0f0f0] hover:border-[#F3C03D]/30 transition-all group/t flex flex-col items-center text-center shrink-0">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-[#F3C03D] text-[#F3C03D]" />)}
                </div>
                <Quote className="h-8 w-8 text-[#F3C03D]/10 mb-4 group-hover/t:text-[#F3C03D]/20 transition-colors" />
                <p className="text-neutral-600 font-medium italic mb-6 leading-relaxed text-sm md:text-base">"{t.content}"</p>
                <div className="mt-auto flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="h-10 w-10 rounded-xl object-cover grayscale group-hover/t:grayscale-0 transition-all border-2 border-white shadow-sm" />
                  <div className="text-left">
                    <p className="text-[11px] font-black text-neutral-900 uppercase tracking-widest leading-none mb-1">{t.name}</p>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Gallery Section - Full Width */}
      <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#F3C03D] uppercase tracking-[0.25em]">Office & Culture</p>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Visual Gallery</h2>
          </div>
          {isOwner && (
            <button className="h-10 w-10 rounded-xl bg-[#f9fafb] flex items-center justify-center text-neutral-400 hover:text-[#F3C03D] transition-colors border border-[#f0f0f0]">
              <Camera className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[200px]">
          {(profile?.gallery?.length > 0 ? profile.gallery : [
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop"
          ]).slice(0, 6).map((img: string, idx: number) => {
            const spans = ["col-span-2 row-span-2", "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-2 row-span-1"]
            return (
              <div key={idx} className={cn("rounded-[24px] overflow-hidden border border-[#f0f0f0] group cursor-pointer relative shadow-sm", spans[idx % spans.length])}>
                <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Expertise & Resources - Two Equal Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expertise Section */}
        <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#F3C03D]/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-[#F3C03D]" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Expertise</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile?.tags?.length > 0 ? profile.tags : ["B2B Tech", "AI Itinerary", "Inventory Management", "Agent Portals", "White Label"]).map((tag: string, idx: number) => (
              <div key={idx} className="px-5 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs font-black text-neutral-800 uppercase tracking-widest hover:border-[#F3C03D] hover:bg-white transition-all cursor-default shadow-sm">
                {tag}
              </div>
            ))}
          </div>
        </Card>

        {/* Resources Section */}
        <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#F3C03D]/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#F3C03D]" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Resources</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "Corporate Profile", size: "2.4 MB" },
              { name: "Product Roadmap", size: "1.8 MB" },
              { name: "Service Catalog", size: "3.1 MB" }
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] hover:bg-white hover:border-[#F3C03D]/20 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-neutral-400 group-hover:text-[#F3C03D] transition-colors shadow-sm">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-neutral-900 uppercase tracking-tight">{doc.name}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{doc.size}</p>
                  </div>
                </div>
                <Plus className="h-4 w-4 rotate-45 text-neutral-300 group-hover:text-[#F3C03D]" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Map Location Section - Full Width - COMPACT */}
      <Card className="border border-[#e5e7eb] shadow-none rounded-[32px] bg-white p-5 md:p-6 overflow-hidden group/map">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
          <div className="w-full md:w-[38%] relative aspect-[16/9] md:aspect-square lg:aspect-[16/9] rounded-[24px] overflow-hidden border border-[#f0f0f0] shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2000&auto=format&fit=crop" 
              alt="Location" 
              className="w-full h-full object-cover grayscale contrast-125 group-hover/map:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-[#F3C03D]/10 mix-blend-multiply" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-[18px] bg-white shadow-2xl flex items-center justify-center animate-bounce">
                <MapPin className="h-6 w-6 text-[#F3C03D]" fill="#F3C03D" fillOpacity={0.2} strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div className="w-full md:w-[62%] space-y-4">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-[#F3C03D] uppercase tracking-[0.4em]">Global Headquarters</p>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Visit Our Office</h2>
            </div>
            <p className="text-neutral-500 font-bold leading-relaxed text-sm md:text-lg">
              {profile?.businessAddress || "123, Travel Avenue, BKC, Mumbai, Maharashtra 400051"}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                onClick={() => profile?.googleMapLink && window.open(profile.googleMapLink, '_blank')}
                className="bg-[#F3C03D] hover:bg-[#eab308] text-neutral-900 font-black rounded-xl px-8 h-11 shadow-lg shadow-[#F3C03D]/20 border-none transition-all active:scale-95"
              >
                <Navigation className="h-4 w-4 mr-2" strokeWidth={3} />
                Get Directions
              </Button>
              <Button variant="outline" className="rounded-xl px-8 h-11 border-[#e5e7eb] font-black text-[10px] uppercase tracking-widest hover:bg-neutral-50 transition-all">
                Book a Visit
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
