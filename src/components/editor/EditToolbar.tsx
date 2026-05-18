import React from 'react';
import styles from './EditToolbar.module.css';

interface EditToolbarProps {
  isVisible?: boolean;
  onToggleVisibility?: (e: React.MouseEvent) => void;
  onSettingsClick?: (e: React.MouseEvent) => void;
  onTextSettingsClick?: (e: React.MouseEvent) => void;
  onAddClick?: (e: React.MouseEvent) => void;
}

const EditToolbar: React.FC<EditToolbarProps> = ({ 
  isVisible = true, 
  onToggleVisibility, 
  onSettingsClick,
  onTextSettingsClick,
  onAddClick
}) => {
  return (
    <div className={styles.editToolbar}>
      {onAddClick && (
        <button 
          className={styles.iconBtn} 
          title="Add Slide/Item" 
          onClick={onAddClick}
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
      {onToggleVisibility && (
        <button 
          className={styles.iconBtn} 
          title={isVisible ? "Hide" : "Show"} 
          onClick={onToggleVisibility}
        >
          <i className={`fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
        </button>
      )}
      {onTextSettingsClick && (
        <button 
          className={styles.iconBtn} 
          title="Text Style" 
          onClick={onTextSettingsClick}
        >
          <i className="fas fa-font"></i>
        </button>
      )}
      {onSettingsClick && (
        <button 
          className={styles.iconBtn} 
          title="Settings" 
          onClick={onSettingsClick}
        >
          <i className="fas fa-cog"></i>
        </button>
      )}
    </div>
  );
};

export default EditToolbar;
