"use client";

import React, { useState } from 'react';
import styles from './SectionWrapper.module.css';
import EditToolbar from './EditToolbar';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  isVisible?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onAddSection?: () => void;
  onAddSectionBelow?: () => void;
  onSettingsClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isReadOnly?: boolean;
  // Dynamic button data
  data?: any;
  themeConfig?: any;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  id, 
  isVisible = true, 
  onMoveUp, 
  onMoveDown, 
  onDelete, 
  onToggleVisibility,
  onAddSection,
  onAddSectionBelow,
  onSettingsClick,
  isFirst,
  isLast,
  isReadOnly = false,
  data,
  themeConfig
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryColor = themeConfig?.primaryColor || '#ff5722';
  const fontFamily = themeConfig?.fontFamily || 'inherit';

  const renderSectionButton = () => {
    if (!data?.showButton) return null;

    const alignment = data.buttonPosition || 'center';
    const bgColor = data.buttonColor || primaryColor;
    const label = data.buttonLabel || 'Learn More';
    const link = data.buttonLink || '#';

    return (
      <div 
        className={styles.sectionButtonContainer}
        style={{ 
          justifyContent: alignment === 'center' ? 'center' : (alignment === 'right' ? 'flex-end' : 'flex-start'),
          fontFamily: fontFamily
        }}
      >
        <button 
          onClick={() => !isReadOnly && link !== '#' && window.open(link, '_blank')}
          style={{ 
            backgroundColor: bgColor,
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isReadOnly ? 'pointer' : 'default',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
        >
          {label}
        </button>
      </div>
    );
  };

  const verticalPadding = data?.verticalPadding !== undefined ? data.verticalPadding : 0;

  // Calculate scale factor for internal elements (100 is normal, 0 is compact)
  // We clamp it so it doesn't get too tiny
  const scaleFactor = Math.max(0.4, (verticalPadding + 50) / 150);

  const getDynamicStyles = () => {
    return {
      '--section-v-padding': `0px`,
      '--content-scale': scaleFactor,
      '--dynamic-gap': `${Math.max(4, 32 * scaleFactor)}px`,
      '--dynamic-item-padding': `${Math.max(8, 40 * scaleFactor)}px`,
      '--dynamic-title-size': `${Math.max(18, 42 * scaleFactor)}px`,
      paddingTop: `0px`, 
      paddingBottom: `0px`
    };
  };

  if (isReadOnly) {
    if (!isVisible) return null;
    return (
      <div 
        id={id?.toLowerCase().replace(/\s+/g, '-')} 
        className={styles.container} 
        style={{ fontFamily: fontFamily }}
      >
        <div className={styles.content} style={getDynamicStyles()}>
          {children}
          {renderSectionButton()}
        </div>
      </div>
    );
  }

  return (
    <div 
      id={id?.toLowerCase().replace(/\s+/g, '-')}
      className={`${styles.container} ${isSelected || isHovered ? styles.active : ''} editable-element`}
      style={{ 
        fontFamily: fontFamily,
        '--primary': primaryColor 
      } as any}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
    >
      {!isVisible ? (
        <div className={styles.hiddenPlaceholder}>
          Hidden Section: {id?.replace(/([A-Z])/g, ' $1').toUpperCase()}
          <button onClick={onToggleVisibility} className={styles.showBtn}>Show</button>
        </div>
      ) : (
        <>
          {/* Add Section Button Above */}
          <div className={`${styles.addSectionContainer} ${styles.top}`}>
            <button className={styles.addSectionBtn} onClick={(e) => { e.stopPropagation(); onAddSection?.(); }}>+ Add Section</button>
          </div>

          {/* Action Toolbar */}
          {(isSelected || isHovered) && (
            <div className={styles.toolbar}>
              <button 
                className={styles.toolBtn} 
                onClick={(e) => { e.stopPropagation(); onSettingsClick?.(); }}
                title="Section Settings"
              >
                <i className="fas fa-cog"></i>
              </button>
              <button 
                className={`${styles.toolBtn} ${isFirst ? styles.disabled : ''}`} 
                onClick={(e) => { e.stopPropagation(); !isFirst && onMoveUp?.(); }}
                title="Move Up"
              >
                <i className="fas fa-chevron-up"></i>
              </button>
              <button 
                className={`${styles.toolBtn} ${isLast ? styles.disabled : ''}`} 
                onClick={(e) => { e.stopPropagation(); !isLast && onMoveDown?.(); }}
                title="Move Down"
              >
                <i className="fas fa-chevron-down"></i>
              </button>
              <button 
                className={styles.toolBtn} 
                onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(); }}
                title={isVisible ? "Hide Section" : "Show Section"}
              >
                <i className={`fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
              <button 
                className={`${styles.toolBtn} ${styles.delete}`} 
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                title="Delete Section"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )}

          {/* Content */}
          <div className={styles.content} style={getDynamicStyles()}>
            {children}
            {renderSectionButton()}
          </div>

          {/* Add Section Button Below */}
          <div className={`${styles.addSectionContainer} ${styles.bottom}`}>
            <button className={styles.addSectionBtn} onClick={(e) => { e.stopPropagation(); onAddSectionBelow?.(); }}>+ Add Section</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SectionWrapper;
