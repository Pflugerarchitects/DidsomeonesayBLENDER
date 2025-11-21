import React from 'react';

const PhaseFilter = ({ selectedPhases, onTogglePhase, onClearFilters }) => {
  const phases = [
    { value: 'SD', label: 'SD', name: 'Schematic Design' },
    { value: 'DD', label: 'DD', name: 'Design Development' },
    { value: 'Final', label: 'Final', name: 'Final' },
    { value: 'Approved', label: 'Approved', name: 'Approved' }
  ];

  const hasActiveFilters = selectedPhases.length > 0;

  return (
    <div className="phase-filter-container">
      <div className="phase-filter-header">
        <span className="phase-filter-label">Phase</span>
        {hasActiveFilters && (
          <button
            className="phase-filter-clear"
            onClick={onClearFilters}
            title="Clear phase filters"
            aria-label="Clear phase filters"
          >
            Clear
          </button>
        )}
      </div>
      <div className="phase-filter-buttons">
        {phases.map((phase) => (
          <button
            key={phase.value}
            className={`phase-filter-button ${selectedPhases.includes(phase.value) ? 'active' : ''}`}
            onClick={() => onTogglePhase(phase.value)}
            title={phase.name}
            aria-label={`Filter by ${phase.name}`}
            aria-pressed={selectedPhases.includes(phase.value)}
          >
            {phase.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhaseFilter;
