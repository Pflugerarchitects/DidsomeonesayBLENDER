import React, { useState } from 'react';

const NewProjectForm = ({ onSubmit, onCancel }) => {
  const [projectName, setProjectName] = useState('');

  const cities = [
    'Austin',
    'Dallas',
    'San Antonio',
    'Corpus Christi',
    'Houston'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit(projectName.trim());
      setProjectName('');
    }
  };

  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <div className="new-project-form-header">
        <h3 className="new-project-form-title">New Project</h3>
      </div>
      <div className="new-project-form-body">
        <label htmlFor="project-name" className="new-project-form-label">
          Select City
        </label>
        <select
          id="project-name"
          className="new-project-form-input"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          autoFocus
        >
          <option value="">-- Select a city --</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="new-project-form-footer">
        <button
          type="button"
          className="new-project-form-button cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="new-project-form-button submit"
          disabled={!projectName.trim()}
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
