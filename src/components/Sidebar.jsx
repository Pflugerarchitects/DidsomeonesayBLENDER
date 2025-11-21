import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, HardDrive, Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import ProjectList from './ProjectList';
import { formatBytes } from '../utils/api';

const Sidebar = ({ projects, activeProjectId, isCollapsed, getDisplayName, onToggleCollapse, onSelectProject, onCreateProject, onRenameProject, onDeleteProject, onReorderProjects, storageUsed, storageLimit }) => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const cities = [
    { abbreviation: 'DAL', name: 'Dallas' },
    { abbreviation: 'AUS', name: 'Austin' },
    { abbreviation: 'HOU', name: 'Houston' },
    { abbreviation: 'SA', name: 'San Antonio' },
    { abbreviation: 'CC', name: 'Corpus Christi' }
  ];

  const projectTypes = [
    { abbreviation: 'ES', name: 'Elementary School' },
    { abbreviation: 'MS', name: 'Middle School' },
    { abbreviation: 'HS', name: 'High School' },
    { abbreviation: 'HE', name: 'Higher Education' },
    { abbreviation: 'BP', name: 'Bond Proposal' },
    { abbreviation: 'UQ', name: 'Unique' }
  ];

  const handleCreateProject = () => {
    onCreateProject();
  };

  // Filter projects based on search term, selected cities, and project types
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const displayName = getDisplayName(project.name);
      const searchMatch = searchTerm === '' ||
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Parse project name format: CITY-TYPE-name
      const parts = project.name.split('-');
      if (parts.length < 2) return true; // Show projects that don't follow the format

      const projectCity = parts[0];
      const projectType = parts[1];

      const cityMatch = selectedCities.length === 0 || selectedCities.includes(projectCity);
      const typeMatch = selectedProjectTypes.length === 0 || selectedProjectTypes.includes(projectType);

      return cityMatch && typeMatch;
    });
  }, [projects, selectedCities, selectedProjectTypes, searchTerm, getDisplayName]);

  const handleToggleCity = (cityAbbr) => {
    setSelectedCities(prev =>
      prev.includes(cityAbbr)
        ? prev.filter(c => c !== cityAbbr)
        : [...prev, cityAbbr]
    );
  };

  const handleToggleProjectType = (typeAbbr) => {
    setSelectedProjectTypes(prev =>
      prev.includes(typeAbbr)
        ? prev.filter(t => t !== typeAbbr)
        : [...prev, typeAbbr]
    );
  };

  const handleClearFilters = () => {
    setSelectedCities([]);
    setSelectedProjectTypes([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCities.length > 0 || selectedProjectTypes.length > 0 || searchTerm !== '';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2 className="sidebar-title">Projects</h2>}
        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="sidebar-toggle-icon" size={20} />
          ) : (
            <ChevronLeft className="sidebar-toggle-icon" size={20} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="sidebar-content">
            {/* Search Bar */}
            <div className="project-search">
              <div className="project-search-input-wrapper">
                <Search size={16} className="project-search-icon" />
                <input
                  type="text"
                  className="project-search-input"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="project-search-clear"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Collapsible Filters */}
            <div className="project-filters">
              <div className="project-filters-toggle" onClick={() => setFiltersExpanded(!filtersExpanded)}>
                <div className="project-filters-toggle-left">
                  <Filter size={16} />
                  <span className="project-filters-toggle-label">Filters</span>
                  {hasActiveFilters && <span className="project-filters-active-indicator">{selectedCities.length + selectedProjectTypes.length}</span>}
                </div>
                {filtersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {filtersExpanded && (
                <>
                  {hasActiveFilters && (
                    <button
                      className="project-filters-clear-all"
                      onClick={handleClearFilters}
                      title="Clear all filters"
                    >
                      <X size={14} />
                      Clear all
                    </button>
                  )}

                  <div className="project-filter-group">
                    <label className="project-filter-label">City</label>
                    <div className="filter-bubbles">
                      {cities.map(city => (
                        <button
                          key={city.abbreviation}
                          className={`filter-bubble ${selectedCities.includes(city.abbreviation) ? 'active' : ''}`}
                          onClick={() => handleToggleCity(city.abbreviation)}
                          title={city.name}
                        >
                          {city.abbreviation}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="project-filter-group">
                    <label className="project-filter-label">Type</label>
                    <div className="filter-bubbles">
                      {projectTypes.map(type => (
                        <button
                          key={type.abbreviation}
                          className={`filter-bubble ${selectedProjectTypes.includes(type.abbreviation) ? 'active' : ''}`}
                          onClick={() => handleToggleProjectType(type.abbreviation)}
                      title={type.name}
                    >
                      {type.abbreviation}
                    </button>
                  ))}
                </div>
              </div>
                </>
              )}
            </div>

            <button
              className="sidebar-add-button"
              onClick={handleCreateProject}
            >
              <Plus className="sidebar-add-icon" size={20} />
              New Project
            </button>

            <ProjectList
              projects={filteredProjects}
              activeProjectId={activeProjectId}
              getDisplayName={getDisplayName}
              onSelectProject={onSelectProject}
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
              onReorderProjects={onReorderProjects}
            />
          </div>

          <div className="sidebar-footer">
            <div className="storage-info">
              <div className="storage-info-header">
                <HardDrive size={16} />
                <span className="storage-info-title">Storage Used</span>
              </div>
              <div className="storage-info-bar">
                <div
                  className="storage-info-bar-fill"
                  style={{
                    width: `${Math.min((storageUsed / storageLimit) * 100, 100)}%`,
                    backgroundColor:
                      (storageUsed / storageLimit) >= 0.9 ? '#ef4444' :
                      (storageUsed / storageLimit) >= 0.75 ? '#f59e0b' :
                      '#10b981'
                  }}
                />
              </div>
              <div className="storage-info-text">
                {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
              </div>
              <div className="storage-info-percent">
                {Math.round((storageUsed / storageLimit) * 100)}% used
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
