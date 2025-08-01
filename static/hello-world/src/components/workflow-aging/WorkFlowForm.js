import React, { useState, useMemo } from 'react';

const WorkFlowForm = ({ data, onSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  console.log("data",data)

  const assigneeOptions = useMemo(() => {
    const uniqueMap = new Map();
    data.forEach(issue => {
      const issueName = issue.fields?.summary;
      const key = issue.key;
      if (issueName && key && !uniqueMap.has(key)) {
        uniqueMap.set(key, {
          label: `${key} ${issueName}`,
          value: issue.id
        });
      }
    });
    return Array.from(uniqueMap.values());
  }, [data]);

  const toggleOption = (option) => {
    if (selectedOptions.find(o => o.value === option.value)) {
      setSelectedOptions(prev => prev.filter(o => o.value !== option.value));
    } else {
      setSelectedOptions(prev => [...prev, option]);
    }
    setDropdownOpen(false);
  };

  const removeOption = (value) => {
    setSelectedOptions(prev => prev.filter(o => o.value !== value));
  };

  const validate = () => {
    const newErrors = {};
    if (selectedOptions.length === 0) {
      newErrors.select = 'Please select at least one issue.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      const formResult = {
        selectedOptions
      };
      onSubmit?.(formResult);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <>
      <h1 className='form-heading'>WorkFlow Aging</h1>
      <form className="workflow-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Issues:</label>
          <div className="custom-select-container">
            <div
              className="select-display"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedOptions.length === 0 ? (
                <span className="placeholder">Select...</span>
              ) : (
                selectedOptions.map(opt => (
                  <span key={opt.value} className="chip">
                    {opt.label}
                    <button type="button" onClick={() => removeOption(opt.value)}>×</button>
                  </span>
                ))
              )}
              <span className="dropdown-arrow">▾</span>
            </div>

            {dropdownOpen && (
              <div className="options-dropdown">
                {assigneeOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`dropdown-option ${selectedOptions.find(o => o.value === opt.value) ? 'selected' : ''}`}
                    onClick={() => toggleOption(opt)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.select && <div className="error-text">{errors.select}</div>}
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </>
  );
};

export default WorkFlowForm;
