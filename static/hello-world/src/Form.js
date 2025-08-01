
import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Form.css'; // Your custom styles

const options = [
  { label: 'Development', value: 'dev' },
  { label: 'Design', value: 'design' },
  { label: 'QA', value: 'qa' },
  { label: 'Deployment', value: 'deploy' },
];

export const Form = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.find((o) => o.value === option.value)
        ? prev.filter((o) => o.value !== option.value)
        : [...prev, option]
    );
  };

  const removeOption = (value) => {
    setSelectedOptions((prev) => prev.filter((o) => o.value !== value));
  };

  const validate = () => {
    const newErrors = {};
    if (selectedOptions.length === 0) newErrors.select = 'Please select at least one option.';
    if (!fromDate) newErrors.fromDate = 'Please choose a start date.';
    if (!toDate) newErrors.toDate = 'Please choose an end date.';
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      newErrors.toDate = 'End date must be after start date.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setErrors({});
      alert('Form submitted!');
      console.log({
        selected: selectedOptions.map((opt) => opt.value),
        fromDate,
        toDate,
      });
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="form-background">
      <form className="custom-form shadow-lg p-4 rounded" onSubmit={handleSubmit} ref={dropdownRef}>
        <h4 className="mb-4 text-center text-white">Team Alocation Form</h4>

        {/* Multi-select */}
        <div className="mb-4">
          <label className="form-label text-white">Assignee</label>
          <div
            className={`custom-multiselect ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="selected-options">
              {selectedOptions.length === 0 ? (
                <span className="placeholder">Select...</span>
              ) : (
                selectedOptions.map((opt) => (
                  <span className="badge-option" key={opt.value}>
                    {opt.label}
                    <button
                      type="button"
                      className="btn-close btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(opt.value);
                      }}
                    ></button>
                  </span>
                ))
              )}
            </div>
            <span className="arrow">▾</span>
          </div>
          {dropdownOpen && (
            <div className="dropdown-options animate-slide">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  className={`dropdown-item ${
                    selectedOptions.find((o) => o.value === opt.value) ? 'selected' : ''
                  }`}
                  onClick={() => toggleOption(opt)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
          {errors.select && <div className="text-danger mt-1">{errors.select}</div>}
        </div>

        {/* From Date */}
        <div className="mb-3">
          <label htmlFor="fromDate" className="form-label text-white">From Date</label>
          <input
            type="date"
            className="form-control"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          {errors.fromDate && <div className="text-danger">{errors.fromDate}</div>}
        </div>

        {/* To Date */}
        <div className="mb-3">
          <label htmlFor="toDate" className="form-label text-white">To Date</label>
          <input
            type="date"
            className="form-control"
            id="toDate"
            value={toDate}
            onFocus={() => setFromDate('')} // 👈 clears first field when second is clicked
            onChange={(e) => setToDate(e.target.value)}
          />
          {errors.toDate && <div className="text-danger">{errors.toDate}</div>}
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-light w-100 mt-3 fw-bold">Submit</button>
      </form>
    </div>
  );
};

export default Form;
