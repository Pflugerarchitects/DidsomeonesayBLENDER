import React from 'react';
import { Filter, X } from 'lucide-react';

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
        <Filter size={16} />
        <span className="phase-filter-label">Filter by Phase</span>
        {hasActiveFilters && (
          <button
            className="phase-filter-clear"
            onClick={onClearFilters}
            title="Clear phase filters"
            aria-label="Clear phase filters"
          >
            <X size={14} />
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
