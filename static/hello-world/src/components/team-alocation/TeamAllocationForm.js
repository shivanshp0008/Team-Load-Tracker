import React, { useState, useMemo, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const TeamAllocationForm = ({ data, onSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);
  const [errors, setErrors] = useState({});

  // Dynamically extract unique assignees from issue data
  const assigneeOptions = useMemo(() => {
    const uniqueMap = new Map();
    data.forEach(issue => {
      const assignee = issue.fields?.assignee;
      if (assignee && !uniqueMap.has(assignee.accountId)) {
        uniqueMap.set(assignee.accountId, {
          label: assignee.displayName,
          value: assignee.accountId
        });
      }
    });
    return Array.from(uniqueMap.values());
  }, [data]);

  const fromDateRef = useRef();
const toDateRef = useRef();

  const toggleOption = (option) => {
    if (selectedOptions.find(o => o.value === option.value)) {
      setSelectedOptions(prev => prev.filter(o => o.value !== option.value));
    } else {
      setSelectedOptions(prev => [...prev, option]);
      setErrors((prev) => ({ ...prev, select: null }));
    }
        setDropdownOpen(false);
  };

  const removeOption = (value) => {
    setSelectedOptions(prev => prev.filter(o => o.value !== value));
  };

  const validate = () => {
    const newErrors = {};
    if (selectedOptions.length === 0) newErrors.select = 'Please select at least one assignee.';
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
      const formResult = {
        selectedOptions,
        fromDate,
        toDate,
      };
      onSubmit?.(formResult); // send to parent component
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <>
    <h1 className='form-heading'>Team Allocation </h1>
    <form className="teamallocation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Select Assignee:</label>
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
                  className={`dropdown-option ${
                    selectedOptions.find(o => o.value === opt.value) ? 'selected' : ''
                  }`}
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

      <div className="form-group" onClick={() => fromDateRef.current?.focus()}>
  <label>From Date:</label>
  <DatePicker
    selected={fromDate}
    // onChange={(date) => setFromDate(date)}
    onChange={(date) => {
    setFromDate(date);
    if (date) setErrors((prev) => ({ ...prev, fromDate: null })); // ✅ clear fromDate error
  }}
    placeholderText="Select a date"
    inputRef={fromDateRef}
    className="custom-datepicker"
    dateFormat="MM/dd/yyyy"
  />
  {errors.fromDate && <div className="error-text">{errors.fromDate}</div>}
</div>

<div className="form-group" onClick={() => toDateRef.current?.focus()}>
  <label>To Date:</label>
  <DatePicker
    selected={toDate}
    // onChange={(date) => setToDate(date)}
    onChange={(date) => {
    setToDate(date);
    if (date) setErrors((prev) => ({ ...prev, toDate: null })); // ✅ clear toDate error
  }}
    placeholderText="Select a date"
    inputRef={toDateRef}
    className="custom-datepicker"
    dateFormat="MM/dd/yyyy"
    minDate={fromDate}
  />
  {errors.toDate && <div className="error-text">{errors.toDate}</div>}
</div>



      <button type="submit" className="submit-btn">Submit</button>
    </form>
    </>
  );
};

export default TeamAllocationForm;
