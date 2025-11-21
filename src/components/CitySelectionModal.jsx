import React, { useEffect, useState, useRef } from 'react';

const CitySelectionModal = ({ onSelectCity, onCancel }) => {
  const [step, setStep] = useState('city'); // 'city', 'type', 'number', or 'name'
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [projectNumber, setProjectNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const inputRef = useRef(null);

  const cities = [
    { name: 'Dallas', abbreviation: 'DAL' },
    { name: 'Austin', abbreviation: 'AUS' },
    { name: 'Houston', abbreviation: 'HOU' },
    { name: 'San Antonio', abbreviation: 'SA' },
    { name: 'Corpus Christi', abbreviation: 'CC' }
  ];

  const projectTypes = [
    { name: 'Elementary School', abbreviation: 'ES' },
    { name: 'Middle School', abbreviation: 'MS' },
    { name: 'High School', abbreviation: 'HS' },
    { name: 'Higher Education', abbreviation: 'HE' },
    { name: 'Bond Proposal', abbreviation: 'BP' },
    { name: 'Unique', abbreviation: 'UQ' }
  ];

  // Handle escape key to cancel
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (step === 'name' || step === 'type' || step === 'number') {
          handleBack();
        } else {
          onCancel();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel, step]);

  // Focus input when step changes to number or name
  useEffect(() => {
    if ((step === 'number' || step === 'name') && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleCityClick = (abbreviation) => {
    setSelectedCity(abbreviation);
    setStep('type');
  };

  const handleTypeClick = (abbreviation) => {
    setSelectedType(abbreviation);
    setProjectNumber('');
    setStep('number');
  };

  const handleNumberSubmit = (e) => {
    e.preventDefault();
    if (projectNumber.trim() && /^\d{2}-\d{3}$/.test(projectNumber)) {
      setProjectName('');
      setStep('name');
    }
  };

  const handleNumberChange = (e) => {
    let value = e.target.value.replace(/[^\d-]/g, ''); // Only allow digits and dash

    // Auto-format: add dash after 2 digits
    if (value.length === 2 && !value.includes('-')) {
      value = value + '-';
    }

    // Limit to xx-xxx format
    if (value.length <= 6) {
      setProjectNumber(value);
    }
  };

  const handleBack = () => {
    if (step === 'type') {
      setStep('city');
      setSelectedCity(null);
    } else if (step === 'number') {
      setStep('type');
      setSelectedType(null);
      setProjectNumber('');
    } else if (step === 'name') {
      setStep('number');
      setProjectName('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSelectCity(selectedCity, selectedType, projectNumber, projectName.trim());
    }
  };

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  if (step === 'city') {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content city-selection-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">Select Project Location</h2>

          <p className="modal-message">
            Choose a city for your new project:
          </p>

          <div className="city-selection-grid">
            {cities.map((city) => (
              <button
                key={city.abbreviation}
                className="city-selection-button"
                onClick={() => handleCityClick(city.abbreviation)}
              >
                <span className="city-abbreviation">{city.abbreviation}</span>
                <span className="city-name">{city.name}</span>
              </button>
            ))}
          </div>

          <div className="modal-actions">
            <button
              className="modal-button modal-button-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'type') {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content city-selection-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">Select Project Type</h2>

          <p className="modal-message">
            What type of project is this?
          </p>

          <div className="project-type-grid">
            {projectTypes.map((type) => (
              <button
                key={type.abbreviation}
                className="project-type-button"
                onClick={() => handleTypeClick(type.abbreviation)}
              >
                <span className="project-type-abbreviation">{type.abbreviation}</span>
                <span className="project-type-name">{type.name}</span>
              </button>
            ))}
          </div>

          <div className="modal-actions">
            <button
              className="modal-button modal-button-cancel"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="modal-button modal-button-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'number') {
    const isValidNumber = /^\d{2}-\d{3}$/.test(projectNumber);

    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content city-selection-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">Enter Project Number</h2>

          <p className="modal-message">
            Enter the project number (format: XX-XXX):
          </p>

          <form onSubmit={handleNumberSubmit} className="project-name-form">
            <div className="project-name-input-wrapper">
              <span className="project-name-prefix">{selectedCity}-{selectedType}-</span>
              <input
                ref={inputRef}
                type="text"
                className="project-name-input"
                value={projectNumber}
                onChange={handleNumberChange}
                placeholder="12-345"
                autoComplete="off"
                maxLength={6}
              />
            </div>
            {projectNumber && !isValidNumber && (
              <p className="modal-error-message">
                Format must be XX-XXX (e.g., 12-345)
              </p>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-cancel"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="modal-button modal-button-primary"
                disabled={!isValidNumber}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content city-selection-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Name Your Project</h2>

        <p className="modal-message">
          Enter a name for your project:
        </p>

        <form onSubmit={handleSubmit} className="project-name-form">
          <div className="project-name-input-wrapper">
            <span className="project-name-prefix">{selectedCity}-{selectedType}-{projectNumber}-</span>
            <input
              ref={inputRef}
              type="text"
              className="project-name-input"
              value={projectName}
              onChange={handleInputChange}
              placeholder="project name"
              autoComplete="off"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-button modal-button-cancel"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="submit"
              className="modal-button modal-button-primary"
              disabled={!projectName.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitySelectionModal;
