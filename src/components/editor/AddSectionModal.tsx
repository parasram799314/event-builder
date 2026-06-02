"use client";

import React from 'react';
import styles from './AddSectionModal.module.css';

interface Category {
  id: string;
  label: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'HERO', label: 'Hero Banner', icon: 'fa-image' },
  { id: 'MEDIA_TEXT', label: 'Media with Text', icon: 'fa-file-invoice' },
  { id: 'MEDIA_GROUP', label: 'Media with Text Group', icon: 'fa-layer-group' },
  { id: 'COUNTER', label: 'Number Counter', icon: 'fa-stopwatch-20' },
  { id: 'TESTIMONIALS', label: 'Testimonials', icon: 'fa-quote-left' },
  { id: 'COUNTDOWN', label: 'Countdown', icon: 'fa-clock' },
  { id: 'TEXT', label: 'Text', icon: 'fa-font' },
  { id: 'LIST', label: 'List', icon: 'fa-list-ul' },
  { id: 'WIDGET', label: 'Embed Widget', icon: 'fa-code' },
  { id: 'GALLERY', label: 'Gallery', icon: 'fa-images' },
  { id: 'SPEAKERS', label: 'Speakers', icon: 'fa-users' },
  { id: 'SPONSORS', label: 'Sponsors', icon: 'fa-handshake' },
  { id: 'SESSIONS', label: 'Featured Sessions', icon: 'fa-calendar-check' },
  { id: 'SCHEDULE', label: 'Schedule', icon: 'fa-calendar-alt' },
  { id: 'VENUE', label: 'Venue & Location', icon: 'fa-map-location-dot' },
  { id: 'MOVING_LINE', label: 'Moving Line (Ticker)', icon: 'fa-arrows-left-right' },
  { id: 'CONTACT', label: 'Contact Form', icon: 'fa-envelope' },
];

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: string) => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({ isOpen, onClose, onAddSection }) => {
  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} onClick={onClose} />
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>ADD SECTION</h2>
          <button className={styles.closeBtn} onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.previewHeader}>
            <h3>Available Layouts</h3>
            <p>Select a section to add to your event.</p>
          </div>

          <div className={styles.layoutGrid}>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className={styles.layoutCard} onClick={() => onAddSection(cat.id)}>
                <div className={styles.layoutPreview}>
                   <i className={`fa-solid ${cat.icon}`} style={{ fontSize: '20px', color: '#64748b' }}></i>
                </div>
                <div className={styles.layoutInfo}>
                  <span>{cat.label}</span>
                  <button className={styles.addBtn}>+ Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSectionModal;
