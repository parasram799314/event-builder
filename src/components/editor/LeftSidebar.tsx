"use client";

import React from 'react';
import styles from './LeftSidebar.module.css';

const navItems = [
  { id: 'themes', label: 'Themes', icon: 'fa-solid fa-palette' },
  { id: 'visuals', label: 'Visuals', icon: 'fa-solid fa-wand-magic-sparkles' },
  { id: 'pages', label: 'Pages', icon: 'fa-solid fa-file-lines' },
  { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
            title={item.label}
          >
            <span className={styles.icon}>
              <i className={item.icon}></i>
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default LeftSidebar;
