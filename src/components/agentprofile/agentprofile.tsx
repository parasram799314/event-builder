"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  MessageCircle, 
  MoreHorizontal, 
  Pencil, 
  Camera, 
  MapPin, 
  Globe, 
  Users,
  FileText,
  Briefcase,
  Settings,
  Share2,
  Loader2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Copy,
  Check,
  Building2,
  BadgeCheck,
  Navigation,
  Download,
  Mail,
  Phone,
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Facebook, Linkedin, Twitter, Instagram, Youtube } from "@/components/ui/brand-icons"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"


interface AgentProfileViewAltProps {
  profile: any
  onEdit: () => void
  onUpdate?: (updatedProfile: any) => void
  isOwner?: boolean
  onThemeChange?: () => void
}

export function AgentProfileViewAlt({ profile, onEdit, onUpdate, isOwner = false, onThemeChange }: AgentProfileViewAltProps) {
  const { toast } = useToast()
  const profileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [updatingVisibility, setUpdatingVisibility] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const downloadPDF = async () => {
    const element = document.getElementById("agent-profile-alt-content")
    if (!element) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] })
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save(`${profile.fullName.replace(/\s+/g, "_")}_Modern_Profile.pdf`)
      toast({ title: "Success", description: "Modern profile downloaded" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" })
    } finally {
      setDownloading(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile/${profile.userId}` : ''

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({ title: "Link Copied", description: "Profile link copied" })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {}
  }

  const toggleVisibility = async () => {
    if (!isOwner) return
    setUpdatingVisibility(true)
    try {
      const newVisibility = !profile.isPublic
      const res = await fetch('/api/agent-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, isPublic: newVisibility })
      })
      if (res.ok) {
        const updated = await res.json()
        if (onUpdate) onUpdate(updated)
      }
    } catch (error) {} finally {
      setUpdatingVisibility(false)
    }
  }

  const socialPlatforms = [
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'bg-[#25D366]', 
      url: `https://wa.me/?text=Check out my professional profile on Trav Platforms: ${shareUrl}` 
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-[#1877F2]', 
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-[#0A66C2]', 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` 
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'bg-[#1DA1F2]', 
      url: `https://twitter.com/intent/tweet?text=Check out my professional profile on Trav Platforms&url=${shareUrl}` 
    },
  ]

  if (!profile) return null;

  return (
    <div id="agent-profile-alt-content" className="w-full flex flex-col gap-6 animate-in fade-in duration-700">
      <input type="file" ref={profileInputRef} className="hidden" accept="image/*" />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" />

      {/* Modern Split Header */}
      <div className="relative group/header">
        <div className="h-[300px] w-full rounded-[32px] overflow-hidden relative">
          <img src={profile?.coverImage || "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop"} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="h-40 w-40 rounded-full border-[6px] border-white/10 backdrop-blur-md shadow-2xl overflow-hidden bg-white/20">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt={profile.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white font-black text-5xl">{profile?.fullName?.[0]}</div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-blue-500 border-4 border-blue-950 flex items-center justify-center shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              
              <div className="text-white">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-black tracking-tight">{profile.fullName}</h1>
                  {profile.isVerified && <BadgeCheck className="h-6 w-6 text-blue-400 fill-blue-400/20" />}
                </div>
                <p className="text-blue-100 font-bold text-sm uppercase tracking-[0.2em] opacity-80">{profile.title || "Elite Travel Consultant"}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-blue-200/70 text-xs font-bold">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location || "Global"}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-blue-400/50" />
                  <div className="flex items-center gap-1.5 text-blue-200/70 text-xs font-bold">
                    <Building2 className="h-3.5 w-3.5" />
                    {profile.agencyName || "Trav Platforms"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] border-none transition-all active:scale-95">
                Connect Now
              </Button>
              <button 
                onClick={(e) => { e.stopPropagation(); onThemeChange?.(); }}
                className="h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#F3C03D] hover:text-white transition-all shadow-xl"
              >
                <LayoutGrid className="h-4 w-4" />
                Change Theme
              </button>
              <button 
                onClick={downloadPDF}
                className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-blue-900 transition-all shadow-xl"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats Card */}
          <Card 
            className="rounded-[32px] border border-slate-100 shadow-sm p-6 text-slate-900 overflow-hidden relative group bg-white"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-700/60">Membership Status</p>
                <div className="px-2 py-1 rounded-lg bg-black/5 backdrop-blur-sm text-[9px] font-black uppercase border border-black/10">Gold Member</div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black">Professional</h3>
                <p className="text-slate-700 text-sm font-bold">Verified Travel Partner</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-600">Network</p>
                  <p className="text-lg font-black mt-1">1.2k+</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-600">Rating</p>
                  <div className="flex items-center gap-1 mt-1 font-black">
                    4.9 <div className="h-3 w-3 bg-white rounded-full flex items-center justify-center"><div className="h-1 w-1 bg-slate-900 rounded-full" /></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Methods */}
          <Card className="rounded-[32px] border border-slate-100 shadow-sm bg-white p-6 space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Direct Channels</h4>
            <div className="space-y-3">
              {[
                { icon: Mail, val: profile.email, color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Phone, val: profile.contactNumber, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: MessageCircle, val: profile.whatsappNumber, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: Globe, val: profile.socialLinks?.website, color: 'text-slate-600', bg: 'bg-slate-50' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 hover:border-blue-100 transition-colors cursor-pointer group">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                    <item.icon className={cn("h-4 w-4", item.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">{item.val || "Unavailable"}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Specialization Tags */}
          <Card className="rounded-[32px] border border-slate-100 shadow-sm bg-white p-6">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Core Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {(profile?.tags?.length > 0 ? profile.tags : ["Corporate", "Luxury", "Group Tours", "Visa Expert"]).map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-tight border border-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Gallery & Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Business Summary Card */}
          <Card className="rounded-[32px] border border-slate-100 shadow-sm bg-white p-8 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Corporate Identity</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Professional Business Details</p>
                </div>
              </div>
              {isOwner && (
                <button onClick={onEdit} className="h-10 w-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase text-blue-600 tracking-widest mb-2">Agency Partner</p>
                  <p className="text-lg font-black text-slate-900 leading-tight uppercase">{profile.agencyName || "Trav Platforms"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-blue-600 tracking-widest mb-2">Operational Hub</p>
                  <p className="text-sm font-bold text-slate-600 uppercase leading-relaxed">{profile.businessAddress || "New Delhi Head Office"}</p>
                </div>
                <div className="pt-4 flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</span>
                    <span className="text-base font-black text-slate-900 mt-1">12+ Years</span>
                  </div>
                  <div className="h-10 w-px bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Size</span>
                    <span className="text-base font-black text-slate-900 mt-1">15 Members</span>
                  </div>
                </div>
              </div>

              <div 
                className="h-[220px] rounded-[24px] overflow-hidden border border-slate-100 relative group/map cursor-pointer shadow-lg"
                onClick={() => profile.googleMapLink && window.open(profile.googleMapLink, '_blank')}
              >
                <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover/map:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-blue-900/20 group-hover/map:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-blue-600 group-hover/map:scale-110 transition-transform">
                    <Navigation className="h-6 w-6" fill="currentColor" fillOpacity={0.1} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-900">Live HQ Location</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>
          </Card>

          {/* Visual Gallery - New Horizontal Layout */}
          <Card className="rounded-[32px] border border-slate-100 shadow-sm bg-white p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <LayoutGrid className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Showcase</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gallery & Portfolio</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(profile?.gallery?.filter((u: string) => u.trim() !== "").length > 0 ? profile.gallery : [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2074&auto=format&fit=crop"
              ]).slice(0, 3).map((img: string, i: number) => (
                <div key={i} className="aspect-[4/5] rounded-[24px] overflow-hidden border border-slate-100 group shadow-md bg-slate-50">
                  <img src={img} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Document Repository */}
          <Card className="rounded-[32px] border border-slate-100 shadow-sm bg-white p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Documents</h3>
              <div className="flex gap-2">
                {socialPlatforms.slice(0, 3).map(p => (
                   <a key={p.name} href={p.url} className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-white shadow-md", p.color)}>
                     <p.icon className="h-4 w-4" />
                   </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile?.moreInfo?.length > 0 ? profile.moreInfo : [
                { label: "Company Brochure", url: "#" },
                { label: "Rate Card / Price List", url: "#" },
                { label: "Business Certifications", url: "#" }
              ]).map((info: any, i: number) => (
                <a 
                  key={i} 
                  href={info.url === "#" ? undefined : info.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:border-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{info.label}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Secure PDF</p>
                    </div>
                  </div>
                  <LinkIcon className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
