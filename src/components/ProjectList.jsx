import React, { useState, useRef, useEffect } from 'react';
import { Folder, Trash2 } from 'lucide-react';
import { formatBytes } from '../utils/api';

const ProjectList = ({ projects, activeProjectId, getDisplayName, onSelectProject, onRenameProject, onDeleteProject, onReorderProjects }) => {
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingPrefix, setEditingPrefix] = useState(''); // Store CITY-TYPE- prefix
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [draggedOverItemId, setDraggedOverItemId] = useState(null);
  const inputRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingProjectId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingProjectId]);

  const handleStartEdit = (project) => {
    setEditingProjectId(project.id);
    // Extract just the name part for editing
    const displayName = getDisplayName(project.name);
    setEditingName(displayName);
    // Store the prefix to reconstruct full name on save
    const parts = project.name.split('-');
    if (parts.length >= 3) {
      setEditingPrefix(`${parts[0]}-${parts[1]}-`);
    } else {
      setEditingPrefix('');
    }
  };

  const handleSaveEdit = () => {
    if (editingProjectId && onRenameProject) {
      // Reconstruct full name with prefix
      const fullName = editingPrefix ? `${editingPrefix}${editingName}` : editingName;
      const success = onRenameProject(editingProjectId, fullName);
      if (success !== false) {
        setEditingProjectId(null);
        setEditingName('');
        setEditingPrefix('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditingName('');
    setEditingPrefix('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, projectId) => {
    setDraggedItemId(projectId);
    e.dataTransfer.effectAllowed = 'move';

    // Create an invisible drag image to hide the default ghost
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEnter = (e, projectId) => {
    e.preventDefault();
    if (draggedItemId !== projectId && draggedItemId !== null) {
      setDraggedOverItemId(projectId);

      // Reorder in real-time for immediate visual feedback
      const draggedIndex = projects.findIndex(p => p.id === draggedItemId);
      const targetIndex = projects.findIndex(p => p.id === projectId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newProjects = [...projects];
        const [draggedProject] = newProjects.splice(draggedIndex, 1);
        newProjects.splice(targetIndex, 0, draggedProject);

        if (onReorderProjects) {
          onReorderProjects(newProjects);
        }
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedItemId(null);
    setDraggedOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDraggedOverItemId(null);
  };

  if (projects.length === 0) {
    return (
      <div className="project-list-empty">
        <p>No projects yet. Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <div className={`project-list ${draggedItemId ? 'dragging-active' : ''}`}>
      {projects.map((project) => {
        const isEditing = editingProjectId === project.id;

        return (
          <button
            key={project.id}
            className={`project-item ${project.id === activeProjectId ? 'active' : ''} ${draggedItemId === project.id ? 'dragging' : ''} ${draggedOverItemId === project.id ? 'drag-over' : ''}`}
            onClick={() => !isEditing && onSelectProject(project.id)}
            draggable={!isEditing}
            onDragStart={(e) => handleDragStart(e, project.id)}
            onDragEnter={(e) => handleDragEnter(e, project.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, project.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="project-item-icon">
              <Folder size={24} />
            </div>
            <div className="project-item-content">
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {editingPrefix && (
                    <span style={{
                      color: 'var(--text-tertiary)',
                      fontSize: 'var(--font-size-sm)',
                      marginRight: '2px',
                      userSelect: 'none'
                    }}>
                      {editingPrefix}
                    </span>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    className="project-item-input"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSaveEdit}
                    onClick={(e) => e.stopPropagation()}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                </div>
              ) : (
                <div
                  className="project-item-name"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(project);
                  }}
                >
                  {getDisplayName(project.name)}
                </div>
              )}
              <div className="project-item-count">
                {(project.images || []).length} {(project.images || []).length === 1 ? 'image' : 'images'}
                {project.total_size > 0 && (
                  <span className="project-item-size"> • {formatBytes(project.total_size)}</span>
                )}
              </div>
            </div>
            {!isEditing && (
              <button
                className="project-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
                aria-label={`Delete ${project.name}`}
              >
                <Trash2 size={18} />
              </button>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectList;
