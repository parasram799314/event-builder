"use client";

import React from 'react';
import styles from './FeaturedSessions.module.css';

interface FeaturedSession {
  category: string;
  title: string;
  description: string;
  speaker: string;
  time: string;
}

interface FeaturedSessionsProps {
  colors?: any;
  data?: any;
  onUpdate?: (newData: any) => void;
  isReadOnly?: boolean;
}

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
  return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
};

const FeaturedSessions: React.FC<FeaturedSessionsProps> = ({ 
  colors, 
  data, 
  onUpdate, 
  isReadOnly 
}) => {
  // Use theme colors or fallbacks
  const primaryColor = colors?.primary || '#F97316';
  const textColor = colors?.text || '#1e293b';
  const textGrey = colors?.textGrey || '#64748b';
  const cardBg = colors?.white || colors?.background || '#ffffff';
  const badgeBg = `${primaryColor}15`; // 15% opacity of primary

  const sectionData = {
    badge: data?.badge || 'FEATURED SESSIONS',
    title: data?.title || "Don't miss these highlights",
    items: (data?.items && data.items.length > 0) ? data.items : [
      { 
        category: 'KEYNOTE', 
        title: 'Future of AI in Everyday Life', 
        description: 'How AI will reshape work, health, and creativity by 2030', 
        speaker: 'Sarah Johnson', 
        time: '9:00 AM' 
      },
      { 
        category: 'WORKSHOP', 
        title: 'Build Your First AI Product', 
        description: 'Hands-on session from idea to live demo in 90 minutes', 
        speaker: 'Michael Chen', 
        time: '11:30 AM' 
      },
      { 
        category: 'PANEL', 
        title: 'Ethics & Privacy in Automation', 
        description: 'Navigating the challenges of an increasingly automated world', 
        speaker: 'Priya Rao', 
        time: '2:00 PM' 
      }
    ]
  };

  const updateField = (field: string, value: any) => {
    if (isReadOnly) return;
    onUpdate?.({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: string, value: string) => {
    if (isReadOnly) return;
    const newItems = [...sectionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate?.({ ...data, items: newItems });
  };

  return (
    <section 
      className={styles.sectionContainer} 
      id="featured-sessions"
      style={{ 
        '--primary-color': primaryColor,
        '--text-color': textColor,
        '--text-grey': textGrey,
        '--card-bg': cardBg,
        '--badge-bg': badgeBg,
        '--badge-text': primaryColor,
      } as React.CSSProperties}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div 
            className={styles.badge}
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) => updateField('badge', e.currentTarget.innerText)}
          >
            {sectionData.badge}
          </div>
          <h2 
            className={styles.mainHeading}
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) => updateField('title', e.currentTarget.innerText)}
          >
            {sectionData.title}
          </h2>
        </div>

        <div className={styles.grid}>
          {sectionData.items.map((item: any, i: number) => (
            <div key={i} className={styles.card}>
              <div 
                className={styles.cardCategory}
                contentEditable={!isReadOnly}
                suppressContentEditableWarning
                onBlur={(e) => updateItem(i, 'category', e.currentTarget.innerText)}
              >
                {item.category}
              </div>
              <h3 
                className={styles.cardTitle}
                contentEditable={!isReadOnly}
                suppressContentEditableWarning
                onBlur={(e) => updateItem(i, 'title', e.currentTarget.innerText)}
              >
                {item.title}
              </h3>
              <p 
                className={styles.cardDescription}
                contentEditable={!isReadOnly}
                suppressContentEditableWarning
                onBlur={(e) => updateItem(i, 'description', e.currentTarget.innerText)}
              >
                {item.description}
              </p>
              
              <div className={styles.speakerRow}>
                <div className={styles.speakerInfo}>
                  <div className={styles.avatar}>
                    {getInitials(item.speaker)}
                  </div>
                  <span 
                    className={styles.speakerName}
                    contentEditable={!isReadOnly}
                    suppressContentEditableWarning
                    onBlur={(e) => updateItem(i, 'speaker', e.currentTarget.innerText)}
                  >
                    {item.speaker}
                  </span>
                </div>
                <div className={styles.timeInfo}>
                  <i className="far fa-clock"></i>
                  <span 
                    contentEditable={!isReadOnly}
                    suppressContentEditableWarning
                    onBlur={(e) => updateItem(i, 'time', e.currentTarget.innerText)}
                  >
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSessions;
