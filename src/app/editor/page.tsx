"use client";

import styles from "./editor.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LeftSidebar from "@/components/editor/LeftSidebar";
import EventNavbar from "@/components/editor/EventNavbar";
import HeroSection from "@/components/editor/HeroSection";
import SectionWrapper from "@/components/editor/SectionWrapper";
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
  CustomHTMLSection,
  MovingLineSection
} from "@/components/editor/ContentSections";
import GetInTouchSection from "@/components/editor/GetInTouchSection";
import Footer from "@/components/Footer";
import VisualsPanel from "@/components/editor/VisualsPanel";
import ThemesPanel, { ThemePreset } from "@/components/editor/ThemesPanel";
import PagesPanel from "@/components/editor/PagesPanel";
import ThemeOne from "@/components/editor/ThemeOne";
import ThemeTwo from "@/components/editor/ThemeTwo";
import ThemeThree from "@/components/editor/ThemeThree";
import GlobalSettingsPanel from "@/components/editor/GlobalSettingsPanel";
import AddSectionModal from "@/components/editor/AddSectionModal";

import { Suspense } from "react";

function NavratriEditorContent() {
  const [activeTab, setActiveTab] = useState("HOME");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [addIndex, setAddIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("none");
  const [activeLayout, setActiveLayout] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showMobileFrame, setShowMobileFrame] = useState(true);

  // Detect real mobile screen
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setViewMode('mobile');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // ─── Multi-Profile State (Pages) ──────────────────────────────────────────
  const [eventProfiles, setEventProfiles] = useState<any[]>([
    { 
      id: 'home', 
      name: 'Home', 
      isDefault: true, 
      isVisible: true, 
      sections: [
        { 
          id: 'hero', 
          type: 'HERO', 
          isVisible: true, 
          data: {
            slides: [{
              id: 1,
              title: 'The Future of Technology',
              subtitle: 'Join us for the most influential tech conference of the year.',
              images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'],
              currentImageIndex: 0,
              button: { label: 'REGISTER NOW', link: '#', bgColor: '#3b82f6', textColor: '#ffffff' },
              titleStyle: { color: '#ffffff', fontSize: '72px', fontWeight: '800', fontFamily: 'inherit' },
              subtitleStyle: { color: '#e2e8f0', fontSize: '24px', fontWeight: 'normal', fontFamily: 'inherit' },
              layout: 'full-bg',
              imageWidth: 100,
              textAlignment: 'center',
              verticalPosition: 'center',
              overlayOpacity: 0.6
            }],
            dateTimeSettings: {
              showDate: true, showTime: true, showVenue: true,
              eventDate: '2026-10-15T18:00',
              venueText: 'Grand Convention Center, San Francisco',
              widgetSize: 'Large', showIcons: true, textColor: '#ffffff'
            }
          } 
        },
        { 
          id: 'whyAttend', 
          type: 'WHY_ATTEND', 
          isVisible: true, 
          data: { 
            title: 'Why Join the Summit?', 
            subtitle: 'Experience the cutting edge of innovation',
            description: 'Discover the latest trends in AI, Web3, and Sustainable Tech. Connect with industry leaders and visionary entrepreneurs who are shaping our digital future.' 
          } 
        },
        { 
          id: 'speakers', 
          type: 'SPEAKERS', 
          isVisible: true, 
          data: { 
            title: 'Our Speakers',
            subtitle: 'Industry leaders sharing their vision',
            items: [
              { name: 'Sarah Johnson', role: 'CEO, TechFlow', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
              { name: 'Michael Chen', role: 'Lead Architect, Google', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
              { name: 'Elena Rodriguez', role: 'AI Research, OpenAI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' }
            ] 
          } 
        },
        { 
          id: 'sessions', 
          type: 'SESSIONS', 
          isVisible: true, 
          data: { 
            title: 'Featured Sessions',
            subtitle: 'Deep dives into modern technology',
            items: [
              { time: '09:00 AM', title: 'Opening Keynote: The AI Era', desc: 'Navigating the future of artificial intelligence.', speaker: 'Sarah Johnson' },
              { time: '11:30 AM', title: 'Blockchain & Beyond', desc: 'Real-world applications of decentralized systems.', speaker: 'Michael Chen' }
            ] 
          } 
        },
        { 
          id: 'venue', 
          type: 'VENUE', 
          isVisible: true, 
          data: { 
            name: 'Innovation Hub', 
            address: '456 Tech Plaza, San Francisco, CA', 
            description: 'A world-class facility equipped with state-of-the-art technology and premium amenities for a superior event experience.' 
          } 
        },
        { 
          id: 'contact', 
          type: 'CONTACT', 
          isVisible: true, 
          data: { 
            title: 'Get in Touch',
            subtitle: 'We are here to answer your questions'
          } 
        },
      ]
    },
  ]);

  const [activeProfileId, setActiveProfileId] = useState('home');

  useEffect(() => {
    setActiveTab('HOME');
  }, []);

  const reorderProfiles = (startIndex: number, endIndex: number) => {
    const result = Array.from(eventProfiles);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setEventProfiles(result);
  };

  const updateProfileVisibility = (id: string, isVisible: boolean) => {
    setEventProfiles(prev => prev.map(p => p.id === id ? { ...p, isVisible } : p));
  };

  // Get active profile data
  const activeProfile = eventProfiles.find(p => p.id === activeProfileId) || eventProfiles[0];
  const sections = activeProfile.sections || [];

  const updateActiveProfileSections = (newSections: any[]) => {
    setEventProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, sections: newSections } : p));
  };

  const updateSectionData = (id: string, newData: any) => {
    const newSections = sections.map((s: any) => s.id === id ? { ...s, data: { ...s.data, ...newData } } : s);
    updateActiveProfileSections(newSections);
  };

  const deleteProfile = (id: string) => {
    const newProfiles = eventProfiles.filter(p => p.id !== id);
    setEventProfiles(newProfiles);
    if (activeProfileId === id) {
      setActiveProfileId(newProfiles[0]?.id || '');
    }
  };

  const [themeConfig, setThemeConfig] = useState<any>({
    primaryColor: '#F59E0B', // Professional Golden Amber
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    navbarColor: '#ffffff',
    navbarTextColor: '#1e293b',
    activeLayout: 'theme1'
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const websiteId = searchParams.get("id");

  const handleSelectTheme = (theme: any) => {
    const newConfig = {
      primaryColor: theme.primaryColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      navbarColor: theme.navbarColor,
      navbarTextColor: theme.navbarTextColor,
      activeLayout: theme.isLayout ? theme.id : null
    };
    setThemeConfig(newConfig);
    setActiveLayout(newConfig.activeLayout);
    // Automatically close the panel after selection
    setSidebarTab("none");
  };

  useEffect(() => {
    if (websiteId) {
      loadWebsite(websiteId);
    }
  }, [websiteId]);

  const [footerData, setFooterData] = useState<any>({
    description: 'Crafting exceptional digital experiences for world-class events and conferences.',
    copyright: '© 2026 EVENTBUILDER INC. ALL RIGHTS RESERVED.'
  });

  const loadWebsite = async (id: string) => {
    try {
      const res = await fetch(`/api/websites`);
      const data = await res.json();
      const current = data.find((w: any) => w.id === parseInt(id));
      if (current) {
        setTitle(current.title);
        if (current.content && current.content.eventProfiles) {
          setEventProfiles(current.content.eventProfiles);
          const defaultProfile = current.content.eventProfiles.find((p: any) => p.isDefault);
          if (defaultProfile) setActiveProfileId(defaultProfile.id);
        } else if (current.content && current.content.sections) {
          // Legacy support
          setEventProfiles([{ id: 'home', name: 'Home', isDefault: true, sections: current.content.sections }]);
          setActiveProfileId('home');
        }

        if (current.content && current.content.themeConfig) {
          setThemeConfig(current.content.themeConfig);
          if (current.content.themeConfig.activeLayout) {
            setActiveLayout(current.content.themeConfig.activeLayout);
          }
        }

        if (current.content && current.content.footerData) {
          setFooterData(current.content.footerData);
        }
      }
    } catch (error) {
      console.error("Error loading website:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const heroSection = sections.find((s: any) => s.type === 'HERO');
      const eventDate = (heroSection?.data as any)?.dateTimeSettings?.eventDate;

      const payload = {
        id: websiteId,
        title,
        theme: "barfi",
        status: "draft",
        eventDate: eventDate || null,
        content: { eventProfiles, themeConfig, footerData },
        lastModifiedBy: "JD",
      };

      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedWebsite = await res.json();
        alert("Website saved successfully!");
        if (!websiteId) {
          router.replace(`/editor?id=${savedWebsite.id}`);
        }
      } else {
        alert("Failed to save website.");
      }
    } catch (error) {
      console.error("Error saving website:", error);
      alert("Error saving website.");
    } finally {
      setIsSaving(false);
    }
  };

  const [title, setTitle] = useState("Global Innovation Summit 2026");

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < sections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      updateActiveProfileSections(newSections);
    }
  };

  const deleteSection = (id: string) => {
    updateActiveProfileSections(sections.filter((s: any) => s.id !== id));
  };

  const toggleSectionVisibility = (id: string) => {
    updateActiveProfileSections(sections.map((s: any) => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const addSection = (type: string) => {
    const id = `${type.toLowerCase()}_${Date.now()}`;
    let defaultData = {};

    // Define rich default data for each category to make them "useful" immediately
    switch (type) {
      case 'HERO':
        defaultData = {
          slides: [{
            id: 1, title: 'Innovate The Future', subtitle: 'Leading the way in global technology shifts.',
            images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600'],
            button: { label: 'REGISTER NOW', link: '#' }
          }]
        };
        break;
      case 'MEDIA_TEXT':
        defaultData = {
          title: 'Strategic Insights',
          description: 'Unlock the potential of your organization with our state-of-the-art methodology and industry-leading expertise.',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
          layout: 'left',
          button: { label: 'LEARN MORE', link: '#' }
        };
        break;
      case 'MEDIA_GROUP':
        defaultData = {
          items: [
            { title: 'Global Connectivity', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400' },
            { title: 'Scalable Solutions', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400' },
            { title: 'Sustainable Growth', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400' }
          ]
        };
        break;
      case 'COUNTER':
        defaultData = {
          items: [
            { label: 'ATTENDEES', value: '5000+' },
            { label: 'SPEAKERS', value: '120+' },
            { label: 'SESSIONS', value: '45' },
            { label: 'COUNTRIES', value: '30+' }
          ]
        };
        break;
      case 'TESTIMONIALS':
        defaultData = {
          items: [
            { quote: "The best tech event I've attended in years. The networking was incredible!", author: "David Miller", role: "CTO, NextGen" },
            { quote: "Seamless organization and top-tier speakers. Highly recommend.", author: "Linda Garcia", role: "Product Lead, Innovate" }
          ]
        };
        break;
      case 'COUNTDOWN':
        defaultData = {
          title: 'THE EVENT STARTS IN',
          targetDate: '2026-10-15T09:00',
          background: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600'
        };
        break;
      case 'TEXT':
        defaultData = {
          title: 'About the Innovation Summit',
          content: 'This year\'s summit brings together the best minds in the industry to explore the future of technology, sustainability, and global impact.'
        };
        break;
      case 'LIST':
        defaultData = {
          items: [
            { title: 'Innovation First', desc: 'We prioritize groundbreaking ideas that change the world.' },
            { title: 'Expert Guidance', desc: 'Learn directly from industry leaders and pioneers.' },
            { title: 'Global Networking', desc: 'Connect with thousands of peers from around the globe.' }
          ]
        };
        break;
      case 'WIDGET':
        defaultData = { title: 'Event Teaser', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' };
        break;
      case 'SPEAKERS':
        defaultData = { 
          title: 'Featured Speakers', 
          subtitle: 'Industry leaders sharing their vision for the next decade of technology.',
          items: [
            { name: 'Sarah Johnson', role: 'CEO, TechFlow', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
            { name: 'Michael Chen', role: 'Lead Architect, Google', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
            { name: 'Elena Rodriguez', role: 'AI Ethics, OpenAI', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }
          ] 
        };
        break;
      case 'SPONSORS':
        defaultData = { 
          title: 'Official Partners', 
          items: [
            { name: 'Microsoft', image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
            { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
            { name: 'Amazon', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
          ] 
        };
        break;
      case 'SPONSOR_CAT':
        defaultData = { categories: [{ name: 'Platinum', sponsors: [] }] };
        break;
      case 'SESSIONS':
      case 'SCHEDULE':
        defaultData = { 
          title: 'Event Schedule', 
          items: [
            { time: '09:00 AM', title: 'Opening Keynote: Innovation Hub', desc: 'A deep dive into the next 10 years of technology.', speaker: 'Sarah Johnson' },
            { time: '11:30 AM', title: 'AI Ethics & Future Privacy', desc: 'Navigating the challenges of an automated world.', speaker: 'Michael Chen' }
          ] 
        };
        break;
      case 'GALLERY':
        defaultData = {
          items: [
            { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
            { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400' },
            { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400' }
          ]
        };
        break;
      case 'FLOOR_PLAN':
        defaultData = { title: 'Exhibition Floor Plan', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200' };
        break;
      case 'CUSTOM_HTML':
        defaultData = { html: '<div style="padding:40px; text-align:center; background:#f8fafc; border-radius:20px;"><h3>Your Custom Content</h3><p>Edit this in settings.</p></div>' };
        break;
      case 'MOVING_LINE':
        defaultData = { text: 'LATEST NEWS • UPCOMING SESSIONS • GLOBAL SUMMIT 2026 • REGISTER NOW • INNOVATE THE FUTURE • ', speed: 30, direction: 'left', fontSize: '24px' };
        break;
      case 'VENUE':
        defaultData = { 
          name: 'Innovation Hub', 
          address: '456 Tech Plaza, San Francisco, CA', 
          description: 'A world-class facility equipped with state-of-the-art technology and premium amenities for a superior event experience.' 
        };
        break;
      case 'CONTACT':
        defaultData = { title: 'Connect With Us', subtitle: 'Our team is ready to assist you with any questions.' };
        break;
    }

    const newSection = { id, type, isVisible: true, data: defaultData };
    const newSections = [...sections];
    if (addIndex !== null) {
      newSections.splice(addIndex, 0, newSection);
    } else {
      newSections.push(newSection);
    }
    updateActiveProfileSections(newSections);
    setIsLibraryOpen(false);
    setAddIndex(null);
  };

  const openLibrary = (index: number | null) => {
    setAddIndex(index);
    setIsLibraryOpen(true);
  };

  const renderSection = (section: any, index: number) => {
    const commonProps = {
      id: section.id,
      isVisible: section.isVisible,
      onMoveUp: () => moveSection(index, 'up'),
      onMoveDown: () => moveSection(index, 'down'),
      onDelete: () => deleteSection(section.id),
      onToggleVisibility: () => toggleSectionVisibility(section.id),
      onAddSection: () => openLibrary(index),
      onAddSectionBelow: () => openLibrary(index + 1),
      isFirst: index === 0,
      isLast: index === sections.length - 1,
      data: section.data || {},
      updateData: (newData: any) => updateSectionData(section.id, newData),
      themeConfig // Pass global theme
    };

    switch (section.type) {
      case 'HERO':
        return <HeroSection key={section.id} {...commonProps} />;
      case 'MEDIA_TEXT':
        return <MediaTextSection key={section.id} {...commonProps} />;
      case 'MEDIA_GROUP':
        return <MediaGroupSection key={section.id} {...commonProps} />;
      case 'COUNTER':
        return <NumberCounterSection key={section.id} {...commonProps} />;
      case 'TESTIMONIALS':
        return <TestimonialsSection key={section.id} {...commonProps} />;
      case 'COUNTDOWN':
        return <CountdownSection key={section.id} {...commonProps} />;
      case 'TEXT':
        return <TextSection key={section.id} {...commonProps} />;
      case 'LIST':
        return <ListSection key={section.id} {...commonProps} />;
      case 'WIDGET':
        return <EmbedWidgetSection key={section.id} {...commonProps} />;
      case 'SPEAKERS':
        return <SpeakersSection key={section.id} {...commonProps} />;
      case 'SPONSORS':
        return <SponsorsSection key={section.id} {...commonProps} />;
      case 'SPONSOR_CAT':
        return <SponsorCategorySection key={section.id} {...commonProps} />;
      case 'AGENDA':
      case 'SESSIONS':
      case 'SCHEDULE':
        return <AgendaSection key={section.id} {...commonProps} />;
      case 'FLOOR_PLAN':
        return <FloorPlanSection key={section.id} {...commonProps} />;
      case 'CUSTOM_HTML':
        return <CustomHTMLSection key={section.id} {...commonProps} />;
      case 'MOVING_LINE':
        return <MovingLineSection key={section.id} {...commonProps} />;
      case 'VENUE':
        return <VenueSection key={section.id} {...commonProps} />;
      case 'GET_IN_TOUCH':
      case 'CONTACT':
        return <ContactFormSection key={section.id} {...commonProps} />;
      case 'WHY_ATTEND':
        return <WhyAttendSection key={section.id} {...commonProps} />;
      default:
        return (
          <SectionWrapper key={section.id} {...commonProps}>
            <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
              <h2 style={{ color: '#64748b' }}>New {section.type.replace(/_/g, ' ')} Section</h2>
              <p style={{ color: '#94a3b8' }}>This section is ready for your content.</p>
            </div>
          </SectionWrapper>
        );
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!websiteId) {
      alert("Please save your website first before publishing.");
      return;
    }
    
    setIsPublishing(true);
    try {
      const heroSection = sections.find((s: any) => s.type === 'HERO');
      const eventDate = (heroSection?.data as any)?.dateTimeSettings?.eventDate;

      const payload = {
        id: websiteId,
        title,
        theme: "barfi",
        status: "published",
        eventDate: eventDate || null,
        content: { eventProfiles, themeConfig, footerData },
        lastModifiedBy: "JD",
      };

      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const url = `${window.location.origin}/preview/${websiteId}`;
        setPublishedUrl(url);
      } else {
        alert("Failed to publish website.");
      }
    } catch (error) {
      console.error("Error publishing website:", error);
      alert("Error publishing website.");
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Sync top bar title with active profile hero title
  useEffect(() => {
    const heroSection = sections.find((s: any) => s.type === 'HERO');
    const heroTitle = heroSection?.data?.slides?.[0]?.title;
    if (heroTitle && heroTitle !== title) {
      setTitle(heroTitle);
    }
  }, [sections]);

  // Handle title change from top bar back to active profile
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const heroSection = sections.find((s: any) => s.type === 'HERO');
    if (heroSection) {
      const newSlides = [...(heroSection.data.slides || [{ id: 1 }])];
      newSlides[0] = { ...newSlides[0], title: newTitle };
      updateSectionData(heroSection.id, { slides: newSlides });
    }
  };

  const handleNavbarTabChange = (tabName: string) => {
    setActiveTab(tabName);
    // Find the profile that matches the tab name (case-insensitive)
    const matchingProfile = eventProfiles.find(p => p.name.toUpperCase() === tabName.toUpperCase());
    if (matchingProfile) {
      setActiveProfileId(matchingProfile.id);
    }
  };

  return (
    <div className={styles.container}>
      {/* Published Success Modal */}
      {publishedUrl && (
        <div className={styles.modalOverlay} onClick={() => setPublishedUrl(null)}>
          <div className={styles.libraryModal} style={{ maxWidth: '550px', textAlign: 'center', padding: '48px' }} onClick={e => e.stopPropagation()}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              <i className="fa-solid fa-rocket text-green-600"></i>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>Your website is live!</h3>
            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>
              Congratulations! Your event website is now accessible to everyone. Share it with your audience below:
            </p>
            
            <div style={{ 
              display: 'flex', 
              backgroundColor: '#f8fafc', 
              padding: '16px', 
              borderRadius: '12px', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '32px',
              border: '1px solid #e2e8f0'
            }}>
              <code style={{ 
                flex: 1, 
                textAlign: 'left', 
                color: '#334155', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {publishedUrl}
              </code>
              <button 
                onClick={copyToClipboard}
                style={{ 
                  background: 'white', 
                  border: '1px solid #e2e8f0', 
                  padding: '8px 16px', 
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Copy Link
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                className={styles.saveBtn} 
                style={{ flex: 1, margin: 0, padding: '12px', borderRadius: '10px' }}
                onClick={() => window.open(publishedUrl, '_blank')}
              >
                <i className="fa-solid fa-arrow-up-right-from-square mr-2"></i> View Website
              </button>
              <button 
                className={styles.previewBtn} 
                style={{ flex: 1, margin: 0, padding: '12px', borderRadius: '10px' }}
                onClick={() => setPublishedUrl(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Add Section Modal */}
      <AddSectionModal 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onAddSection={addSection}
      />

      {/* Top Bar - Golden */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/dashboard" className={styles.backArrow}>←</Link>
          <div className={styles.eventInfo}>
            <div className={styles.titleRow}>
              <input 
                className={styles.eventTitleInput} 
                value={title} 
                onChange={(e) => handleTitleChange(e.target.value)} 
                placeholder="Event Title"
              />
              <span className={styles.draftBadge}>DRAFT</span>
            </div>
          </div>
        </div>

        <div className={styles.deviceToggle}>
          <button 
            className={`${styles.deviceBtn} ${viewMode === 'desktop' ? styles.activeDevice : ''}`}
            onClick={() => setViewMode('desktop')}
            title="Desktop View"
          >
            <i className="fa-solid fa-desktop"></i>
          </button>
          <button 
            className={`${styles.deviceBtn} ${viewMode === 'mobile' ? styles.activeDevice : ''}`}
            onClick={() => setViewMode('mobile')}
            title="Mobile View"
          >
            <i className="fa-solid fa-mobile-screen-button"></i>
          </button>
        </div>

        <div className={styles.topBarRight}>
          {viewMode === 'mobile' && (
            <button 
              className={`${styles.frameToggleBtn} ${!showMobileFrame ? styles.activeFrameToggle : ''}`}
              onClick={() => setShowMobileFrame(!showMobileFrame)}
              title={showMobileFrame ? "Hide Mobile Frame" : "Show Mobile Frame"}
            >
              <i className={`fa-solid ${showMobileFrame ? 'fa-border-none' : 'fa-mobile-screen'}`}></i>
              <span className={styles.btnText}>
                {showMobileFrame ? 'NO FRAME' : 'FRAME'}
              </span>
            </button>
          )}
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving} title="Save">
            <i className="fa-solid fa-floppy-disk"></i>
            <span className={styles.btnText}>{isSaving ? "Saving..." : "Save"}</span>
          </button>
          <button 
            className={styles.previewBtn} 
            title="Preview"
            onClick={() => {
              if (!websiteId) {
                alert("Please save your website first to view the preview.");
                return;
              }
              window.open(`/preview/${websiteId}`, '_blank');
            }}
          >
            <i className="fa-solid fa-eye"></i>
            <span className={styles.btnText}>Preview</span>
          </button>
          <button 
            className={styles.publishBtn} 
            onClick={handlePublish} 
            disabled={isPublishing}
            title="Publish"
          >
            <i className="fa-solid fa-rocket"></i>
            <span className={styles.btnText}>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className={styles.mainLayout}>
        {/* Left Vertical Sidebar Component */}
        <LeftSidebar activeTab={sidebarTab} onTabChange={setSidebarTab} />

        {sidebarTab === 'settings' ? (
          <div className={styles.mobilePanelOverlay}>
            <GlobalSettingsPanel 
              profiles={eventProfiles}
              activeProfileId={activeProfileId}
              onSelectProfile={setActiveProfileId}
              onAddProfile={(newProfile) => setEventProfiles([...eventProfiles, newProfile])}
              onUpdateProfile={(id, newData) => setEventProfiles(eventProfiles.map(p => p.id === id ? { ...p, ...newData } : p))}
              onUpdateSection={updateSectionData}
              onClose={() => setSidebarTab('none')} 
              onSave={handleSave}
            />
          </div>
        ) : (
          <div className={styles.contentWrapper} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {sidebarTab === 'themes' && (
              <div className={viewMode === 'mobile' ? styles.bottomThemesBar : styles.mobilePanelOverlay}>
                <ThemesPanel 
                  variant={viewMode === 'mobile' ? 'horizontal' : 'sidebar'}
                  onSelectTheme={handleSelectTheme} 
                  onClose={() => setSidebarTab('none')} 
                />
              </div>
            )}

            {sidebarTab === 'visuals' && (
              <div className={viewMode === 'mobile' ? styles.bottomPanelOverlay : styles.mobilePanelOverlay} onClick={() => viewMode === 'mobile' && setSidebarTab('none')}>
                <div className={viewMode === 'mobile' ? styles.bottomPanelContent : ''} onClick={e => e.stopPropagation()}>
                  <VisualsPanel 
                    variant={viewMode === 'mobile' ? 'bottom' : 'sidebar'}
                    themeConfig={themeConfig} 
                    updateThemeConfig={setThemeConfig} 
                    onClose={() => setSidebarTab('none')} 
                  />
                </div>
              </div>
            )}

            {sidebarTab === 'pages' && (
              <div className={viewMode === 'mobile' ? styles.bottomPanelOverlay : styles.mobilePanelOverlay} onClick={() => viewMode === 'mobile' && setSidebarTab('none')}>
                <div className={viewMode === 'mobile' ? styles.bottomPanelContent : ''} onClick={e => e.stopPropagation()}>
                  <PagesPanel 
                    variant={viewMode === 'mobile' ? 'bottom' : 'sidebar'}
                    profiles={eventProfiles}
                    activeProfileId={activeProfileId}
                    onSelectProfile={(id) => {
                      setActiveProfileId(id);
                      const profile = eventProfiles.find(p => p.id === id);
                      if (profile) setActiveTab(profile.name.toUpperCase());
                    }}
                    onAddProfile={(newProfile) => setEventProfiles([...eventProfiles, newProfile])}
                    onDeleteProfile={deleteProfile}
                    onUpdateProfile={(id, newData) => setEventProfiles(eventProfiles.map(p => p.id === id ? { ...p, ...newData } : p))}
                    onClose={() => setSidebarTab('none')} 
                  />
                </div>
              </div>
            )}

            <div className={styles.canvasArea} style={{ 
              backgroundColor: themeConfig.backgroundColor,
              flex: 1,
              overflowY: (viewMode === 'mobile' && showMobileFrame) ? 'hidden' : 'auto'
            }}>
              {viewMode === 'mobile' ? (
                <div className={`${styles.mobilePreviewContainer} ${!showMobileFrame ? styles.noFrame : ''} is-mobile-preview`}>
                  {showMobileFrame && (
                    <>
                      {/* Physical Side Buttons */}
                      <div className={`${styles.sideButton} ${styles.volumeUp}`}></div>
                      <div className={`${styles.sideButton} ${styles.volumeDown}`}></div>
                      <div className={`${styles.sideButton} ${styles.powerBtn}`}></div>
                      
                      {/* Notch / Dynamic Island */}
                      <div className={styles.dynamicIsland}></div>
                      
                      {/* Status Bar */}
                      <div className={styles.statusBar}>
                        <span>9:41</span>
                        <div className={styles.statusIcons}>
                          <i className="fa-solid fa-signal"></i>
                          <i className="fa-solid fa-wifi"></i>
                          <i className="fa-solid fa-battery-full"></i>
                        </div>
                      </div>
                    </>
                  )}

                  <div className={`${styles.mobilePreviewContent} ${!showMobileFrame ? styles.noFrameContent : ''}`}>
                    {activeLayout === 'theme-one' ? (
                      <ThemeOne 
                        data={{ sections }} 
                        themeConfig={themeConfig} 
                        isReadOnly={false} 
                        onUpdateSection={updateSectionData}
                        profiles={eventProfiles}
                        footerData={footerData}
                        onUpdateFooter={setFooterData}
                        onMoveUp={(index) => moveSection(index, 'up')}
                        onMoveDown={(index) => moveSection(index, 'down')}
                        onDelete={(index) => deleteSection(sections[index].id)}
                        onAddClick={(index) => { setAddIndex(index); setIsLibraryOpen(true); }}
                        onTabChange={handleNavbarTabChange}
                        forceMobile={viewMode === 'mobile'}
                      />
                    ) : activeLayout === 'theme-two' ? (
                      <ThemeTwo 
                        data={{ sections }} 
                        themeConfig={themeConfig} 
                        isReadOnly={false} 
                        onUpdateSection={updateSectionData}
                        profiles={eventProfiles}
                        footerData={footerData}
                        onUpdateFooter={setFooterData}
                        onMoveUp={(index) => moveSection(index, 'up')}
                        onMoveDown={(index) => moveSection(index, 'down')}
                        onDelete={(index) => deleteSection(sections[index].id)}
                        onAddClick={(index) => { setAddIndex(index); setIsLibraryOpen(true); }}
                        onTabChange={handleNavbarTabChange}
                        forceMobile={viewMode === 'mobile'}
                      />
                    ) : (
                      <>
                        {/* Event Website Navbar Component */}
                        <EventNavbar 
                          activeTab={activeTab} 
                          onTabChange={handleNavbarTabChange} 
                          links={eventProfiles.filter(p => p.isVisible !== false).map(p => p.name.toUpperCase())}
                          themeConfig={themeConfig}
                        />

                        {/* Editor Canvas */}
                        <main className={styles.canvas}>
                          {sections.length === 0 ? (
                            <div 
                              style={{ 
                                height: '400px', display: 'flex', flexDirection: 'column', 
                                alignItems: 'center', justifyContent: 'center', gap: '20px',
                                background: '#f8fafc', border: '2px dashed #e2e8f0', margin: '40px',
                                borderRadius: '24px'
                              }}
                            >
                              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#2563eb' }}>
                                  <i className="fa-solid fa-plus-circle"></i>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Start building your page</h3>
                                  <p style={{ color: '#64748b', marginTop: '4px' }}>Add sections to create beautiful content between navbar and footer.</p>
                              </div>
                              <button 
                                onClick={() => openLibrary(null)}
                                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                + Add Section
                              </button>
                            </div>
                          ) : (
                            <>
                              {sections.map((section: any, index: number) => renderSection(section, index))}
                              {/* Footer Component */}
                              <Footer 
                                profiles={eventProfiles} 
                                data={footerData} 
                                updateData={setFooterData} 
                                isReadOnly={false} 
                                themeConfig={themeConfig}
                              />
                            </>
                          )}
                        </main>
                      </>
                    )}
                  </div>

                  {showMobileFrame && <div className={styles.homeIndicator}></div>}
                </div>
              ) : (
                <div className={styles.layoutCanvas}>
                  {activeLayout === 'theme-one' ? (
                    <ThemeOne 
                      data={{ sections }} 
                      themeConfig={themeConfig} 
                      isReadOnly={false} 
                      onUpdateSection={updateSectionData}
                      profiles={eventProfiles}
                      footerData={footerData}
                      onUpdateFooter={setFooterData}
                      onMoveUp={(index) => moveSection(index, 'up')}
                      onMoveDown={(index) => moveSection(index, 'down')}
                      onDelete={(index) => deleteSection(sections[index].id)}
                      onAddClick={(index) => { setAddIndex(index); setIsLibraryOpen(true); }}
                      onTabChange={handleNavbarTabChange}
                    />
                  ) : activeLayout === 'theme-two' ? (
                    <ThemeTwo 
                      data={{ sections }} 
                      themeConfig={themeConfig} 
                      isReadOnly={false} 
                      onUpdateSection={updateSectionData}
                      profiles={eventProfiles}
                      footerData={footerData}
                      onUpdateFooter={setFooterData}
                      onMoveUp={(index) => moveSection(index, 'up')}
                      onMoveDown={(index) => moveSection(index, 'down')}
                      onDelete={(index) => deleteSection(sections[index].id)}
                      onAddClick={(index) => { setAddIndex(index); setIsLibraryOpen(true); }}
                      onTabChange={handleNavbarTabChange}
                    />
                  ) : (
                    <>
                      {/* Event Website Navbar Component */}
                      <EventNavbar 
                        activeTab={activeTab} 
                        onTabChange={handleNavbarTabChange} 
                        links={eventProfiles.filter(p => p.isVisible !== false).map(p => p.name.toUpperCase())}
                        themeConfig={themeConfig}
                      />

                      {/* Editor Canvas */}
                      <main className={styles.canvas}>
                        {sections.length === 0 ? (
                          <div 
                            style={{ 
                              height: '400px', display: 'flex', flexDirection: 'column', 
                              alignItems: 'center', justifyContent: 'center', gap: '20px',
                              background: '#f8fafc', border: '2px dashed #e2e8f0', margin: '40px',
                              borderRadius: '24px'
                            }}
                          >
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#2563eb' }}>
                                <i className="fa-solid fa-plus-circle"></i>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Start building your page</h3>
                                <p style={{ color: '#64748b', marginTop: '4px' }}>Add sections to create beautiful content between navbar and footer.</p>
                            </div>
                            <button 
                              onClick={() => openLibrary(null)}
                              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                            >
                              + Add Section
                            </button>
                          </div>
                        ) : (
                          <>
                            {sections.map((section: any, index: number) => renderSection(section, index))}
                            {/* Footer Component */}
                            <Footer 
                              profiles={eventProfiles} 
                              data={footerData} 
                              updateData={setFooterData} 
                              isReadOnly={false} 
                              themeConfig={themeConfig}
                            />
                          </>
                        )}
                      </main>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NavratriEditor() {
  return (
    <Suspense fallback={<div>Loading Editor...</div>}>
      <NavratriEditorContent />
    </Suspense>
  );
}
