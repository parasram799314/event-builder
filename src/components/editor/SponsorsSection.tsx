"use client";

import React from 'react';
import styles from './SponsorsSection.module.css';

interface Sponsor {
  name: string;
  image: string;
}

interface SponsorTier {
  name: string;
  sponsors: Sponsor[];
}

interface SponsorsSectionProps {
  colors?: any;
  data?: any;
  onUpdate?: (newData: any) => void;
  isReadOnly?: boolean;
  isFirst?: boolean;
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({ 
  colors, 
  data, 
  onUpdate, 
  isReadOnly,
  isFirst
}) => {
  // Use theme colors or fallbacks
  const primaryColor = colors?.primary || '#ff6b00';
  const textColor = colors?.text || '#1e293b';
  const textGrey = colors?.textGrey || '#64748b';
  const background = colors?.background || '#ffffff';
  const badgeBg = `${primaryColor}15`; // 15% opacity of primary

  const sectionData = {
    badge: data?.badge || 'OUR PARTNERS',
    title: data?.title || 'Supported by Industry Leaders',
    subtitle: data?.subtitle || 'Meet the forward-thinking organizations making this event possible.',
    // Support both flat items and tiered categories
    items: data?.items || [],
    categories: data?.categories || []
  };

  // If no data, use defaults
  if (sectionData.items.length === 0 && sectionData.categories.length === 0) {
    sectionData.items = [
      { name: 'Microsoft', image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
      { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { name: 'Amazon', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
      { name: 'Meta', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
      { name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
      { name: 'Netflix', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' }
    ];
  }

  const updateField = (field: string, value: string) => {
    if (isReadOnly) return;
    onUpdate?.({ ...data, [field]: value });
  };

  const deleteItem = (index: number) => {
    if (isReadOnly) return;
    const newItems = [...sectionData.items];
    newItems.splice(index, 1);
    onUpdate?.({ ...data, items: newItems });
  };

  const addItem = () => {
    if (isReadOnly) return;
    const newItems = [...sectionData.items, { name: 'New Partner', image: 'https://via.placeholder.com/200x100?text=Logo' }];
    onUpdate?.({ ...data, items: newItems });
  };

  const triggerUpload = (index: number) => {
    if (isReadOnly) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newItems = [...sectionData.items];
          newItems[index] = { ...newItems[index], image: reader.result as string };
          onUpdate?.({ ...data, items: newItems });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <section 
      className={styles.sectionContainer} 
      id="sponsors"
      style={{ 
        '--primary-color': primaryColor,
        '--text-color': textColor,
        '--text-grey': textGrey,
        '--background': background,
        '--badge-bg': badgeBg,
        '--badge-text': primaryColor,
        paddingTop: isFirst ? '0' : undefined
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
          <p 
            className={styles.subtitle}
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) => updateField('subtitle', e.currentTarget.innerText)}
          >
            {sectionData.subtitle}
          </p>
        </div>

        {sectionData.categories.length > 0 ? (
          // Tiered Layout
          sectionData.categories.map((cat: SponsorTier, i: number) => (
            <div key={i} className={styles.tierContainer}>
              <h3 className={styles.tierTitle}>{cat.name} Sponsors</h3>
              <div className={styles.grid}>
                {cat.sponsors.map((s: Sponsor, j: number) => (
                  <div key={j} className={styles.sponsorCard}>
                    <div className={styles.logoWrapper}>
                      <img src={s.image} alt={s.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat Grid Layout
          <>
            <div className={styles.grid}>
              {sectionData.items.map((s: any, i: number) => (
                <div key={i} className={styles.sponsorCard}>
                  <div className={styles.logoWrapper}>
                    <img src={s.image} alt={s.name} title={s.name} />
                  </div>
                  {!isReadOnly && (
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => triggerUpload(i)} title="Change Logo">
                        <i className="fas fa-camera"></i>
                      </button>
                      <button className={styles.actionBtn} onClick={() => deleteItem(i)} title="Delete Sponsor">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!isReadOnly && (
              <div className={styles.addBtnContainer}>
                <button className={styles.addBtn} onClick={addItem}>
                  <i className="fas fa-plus"></i> Add Sponsor Logo
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;
