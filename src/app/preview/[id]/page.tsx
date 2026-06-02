"use client";

import HeroSection from "@/components/editor/HeroSection";
import EventNavbar from "@/components/editor/EventNavbar";
import { 
  WhyAttendSection, 
  SpeakersSection, 
  FeaturedSessionsSection, 
  SponsorsSection, 
  VenueSection,
  AgendaSection,
  MediaTextSection,
  MediaGroupSection,
  NumberCounterSection,
  TestimonialsSection,
  CountdownSection,
  TextSection,
  ListSection,
  EmbedWidgetSection,
  ContactFormSection,
  SponsorCategorySection,
  FloorPlanSection,
  CustomHTMLSection
} from "@/components/editor/ContentSections";
import GetInTouchSection from "@/components/editor/GetInTouchSection";
import Footer from "@/components/Footer";
import { useEffect, useState, use } from "react";
import ThemeOne from "@/components/editor/ThemeOne";
import ThemeTwo from "@/components/editor/ThemeTwo";
import ThemeThree from "@/components/editor/ThemeThree";

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("HOME");

  useEffect(() => {
    if (!id) return;
    console.log("Fetching website with ID:", id);
    setLoading(true);
    fetch(`/api/websites`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch websites from API");
        return res.json();
      })
      .then(data => {
        console.log("All websites received:", data.length);
        const current = data.find((w: any) => w.id === parseInt(id));
        if (current) {
          console.log("Website found:", current.title);
          setWebsite(current);
          if (current.content?.eventProfiles) {
            const defaultProfile = current.content.eventProfiles.find((p: any) => p.isDefault) || current.content.eventProfiles[0];
            if (defaultProfile) {
              setActiveProfileId(defaultProfile.id);
              setActiveTab(defaultProfile.name.toUpperCase());
            }
          }
        } else {
          console.error("Website not found in the list for ID:", id);
          setError(`Website with ID "${id}" not found. Please ensure you have saved your work in the editor.`);
        }
      })
      .catch(err => {
        console.error("Preview fetch error:", err);
        setError("Error loading preview: " + err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px', color: '#64748b' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid #f3f3f3', 
        borderTop: '3px solid #ff6b00', 
        borderRadius: '50%',
        animation: 'spin-preview 1s linear infinite'
      }}></div>
      <p>Loading your event website...</p>
      <style>{`
        @keyframes spin-preview { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (error || !website) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '10px' }}>
      <h1 style={{ fontSize: '48px' }}>😕</h1>
      <h2>{error || "Website not found"}</h2>
      <p>The link might be broken or the website has been removed.</p>
    </div>
  );

  const eventProfiles = website.content?.eventProfiles || [];
  const activeProfile = eventProfiles.find((p: any) => p.id === activeProfileId) || eventProfiles[0];
  const sections = (activeProfile?.sections || website.content?.sections || []).filter((s: any) => s.isVisible !== false);

  const themeConfig = website.content?.themeConfig || {
    primaryColor: '#FFC107',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    navbarColor: '#ffffff',
    navbarTextColor: '#1e293b'
  };

  const renderPreviewSection = (section: any) => {
    const props = { data: section.data || {}, updateData: () => {}, isReadOnly: true, themeConfig };
    switch (section.type) {
      case 'HERO': return <HeroSection key={section.id} {...props} />;
      case 'MEDIA_TEXT': return <MediaTextSection key={section.id} {...props} />;
      case 'MEDIA_GROUP': return <MediaGroupSection key={section.id} {...props} />;
      case 'COUNTER': return <NumberCounterSection key={section.id} {...props} />;
      case 'TESTIMONIALS': return <TestimonialsSection key={section.id} {...props} />;
      case 'COUNTDOWN': return <CountdownSection key={section.id} {...props} />;
      case 'TEXT': return <TextSection key={section.id} {...props} />;
      case 'LIST': return <ListSection key={section.id} {...props} />;
      case 'WIDGET': return <EmbedWidgetSection key={section.id} {...props} />;
      case 'SPEAKERS': return <SpeakersSection key={section.id} {...props} />;
      case 'SPONSORS': return <SponsorsSection key={section.id} {...props} />;
      case 'SPONSOR_CAT': return <SponsorCategorySection key={section.id} {...props} />;
      case 'AGENDA':
      case 'SESSIONS':
      case 'SCHEDULE': return <AgendaSection key={section.id} {...props} />;
      case 'FLOOR_PLAN': return <FloorPlanSection key={section.id} {...props} />;
      case 'CUSTOM_HTML': return <CustomHTMLSection key={section.id} {...props} />;
      case 'VENUE': return <VenueSection key={section.id} {...props} />;
      case 'GET_IN_TOUCH':
      case 'CONTACT': return <ContactFormSection key={section.id} {...props} />;
      case 'WHY_ATTEND': return <WhyAttendSection key={section.id} {...props} />;
      default: return null;
    }
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    const matchingProfile = eventProfiles.find((p: any) => p.name.toUpperCase() === tabName.toUpperCase());
    if (matchingProfile) {
      setActiveProfileId(matchingProfile.id);
    }
  };

  if (themeConfig.activeLayout === 'theme-one') {
    return (
      <ThemeOne 
        data={{ sections }} 
        themeConfig={themeConfig} 
        isReadOnly={true} 
        profiles={eventProfiles}
        footerData={website.content?.footerData}
        onUpdateFooter={() => {}}
        onTabChange={handleTabChange}
      />
    );
  }

  if (themeConfig.activeLayout === 'theme-two') {
    return (
      <ThemeTwo 
        data={{ sections }} 
        themeConfig={themeConfig} 
        isReadOnly={true} 
        profiles={eventProfiles}
        footerData={website.content?.footerData}
        onUpdateFooter={() => {}}
        onTabChange={handleTabChange}
      />
    );
  }

  return (
    <div style={{ backgroundColor: themeConfig.backgroundColor, color: themeConfig.textColor, minHeight: '100vh' }}>

      <EventNavbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        links={eventProfiles.filter((p: any) => p.isVisible !== false).map((p: any) => p.name.toUpperCase())}
        isReadOnly={true} 
        themeConfig={themeConfig} 
      />
      <main>
        {sections.map((s: any) => renderPreviewSection(s))}
        <Footer 
          profiles={eventProfiles} 
          data={website.content?.footerData} 
          isReadOnly={true} 
        />
      </main>
      <style jsx global>{`
        [contenteditable] {
          pointer-events: none !important;
          outline: none !important;
        }
        .edit-toolbar, .editable-element::before, .editable-element::after {
          display: none !important;
        }
        .editBtn, .settingsBtn, .addSlideBtnPanel, .deleteIcon {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
