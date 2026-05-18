"use client";

import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import EditToolbar from './EditToolbar';
import SettingsPanel from './SettingsPanel';
import styles from './GetInTouchSection.module.css';

interface GetInTouchSectionProps {
  id?: string;
  isVisible?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isReadOnly?: boolean;
  data?: any;
  updateData?: (newData: any) => void;
  themeConfig?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

const GetInTouchSection: React.FC<GetInTouchSectionProps> = (props) => {
  const sectionData = props.data || {
    label: 'SUBMIT',
    link: '#',
    title: 'Get in touch',
    subtitle: "HAVE QUESTIONS WE'D LOVE TO HEAR FROM YOU.",
    titleStyle: { color: props.themeConfig?.textColor || '#1e293b' },
    subtitleStyle: { color: props.themeConfig?.textColor || '#475569' }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<any>('BUTTON');
  const [sidebarData, setSidebarData] = useState<any>({});

  const openButtonSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarMode('BUTTON');
    setSidebarData({ label: sectionData.label, link: sectionData.link });
    setIsSidebarOpen(true);
  };

  const openTextSettings = (key: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarMode('TEXT');
    setSidebarData({ ...sectionData[key], _key: key });
    setIsSidebarOpen(true);
  };

  const handleUpdate = (newData: any) => {
    if (sidebarMode === 'BUTTON') {
      props.updateData?.({ ...sectionData, label: newData.label, link: newData.link });
    } else {
      const { _key, ...styleData } = newData;
      props.updateData?.({ ...sectionData, [_key]: styleData });
    }
    setSidebarData(newData);
  };

  return (
    <SectionWrapper {...props} themeConfig={props.themeConfig}>
      <SettingsPanel 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        mode={sidebarMode}
        data={sidebarData}
        updateData={handleUpdate}
      />
      <div className={styles.sectionContainer} style={{ color: props.themeConfig?.textColor || '#1e293b' }}>
        <div className="editable-element">
          {!props.isReadOnly && <EditToolbar onTextSettingsClick={openTextSettings('titleStyle')} />}
          <h2 className={styles.orangeTitle} style={{ color: props.themeConfig?.primaryColor || '#ff5722', ...sectionData.titleStyle }} contentEditable suppressContentEditableWarning onBlur={(e) => {
            props.updateData?.({ ...sectionData, title: e.target.innerText });
          }}>{sectionData.title}</h2>
        </div>

        <div className="editable-element">
          {!props.isReadOnly && <EditToolbar onTextSettingsClick={openTextSettings('subtitleStyle')} />}
          <p className={styles.subtitle} style={{ color: props.themeConfig?.textColor || '#475569', ...sectionData.subtitleStyle }} contentEditable suppressContentEditableWarning onBlur={(e) => {
            props.updateData?.({ ...sectionData, subtitle: e.target.innerText });
          }}>
            {sectionData.subtitle}
          </p>
        </div>
        
        <div className={styles.formCard} style={{ backgroundColor: 'white', color: '#1e293b' }}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label style={{ color: '#475569' }}>FIRST NAME</label>
                <input type="text" placeholder="Enter your first name" />
              </div>
              <div className={styles.field}>
                <label style={{ color: '#475569' }}>LAST NAME</label>
                <input type="text" placeholder="Enter your last name" />
              </div>
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569' }}>EMAIL <span className={styles.required}>*</span></label>
              <input type="email" placeholder="Enter your email address" required />
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569' }}>PHONE</label>
              <div className={styles.phoneInputContainer}>
                <span className={styles.countryCode}>+1</span>
                <input type="tel" className={styles.phoneInput} placeholder="Phone number" />
              </div>
            </div>

            <div className={styles.field}>
              <label style={{ color: '#475569' }}>MESSAGE</label>
              <textarea 
                className={styles.textareaField} 
                placeholder="Write your message here..." 
                rows={6}
              ></textarea>
            </div>

            <div className="editable-element" style={{ width: '100%' }}>
              <EditToolbar onSettingsClick={openButtonSettings} />
              <button type="submit" className={styles.submitBtn} style={{ backgroundColor: props.themeConfig?.primaryColor || '#ff5722', color: '#ffffff' }}>{sectionData.label}</button>
            </div>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GetInTouchSection;
