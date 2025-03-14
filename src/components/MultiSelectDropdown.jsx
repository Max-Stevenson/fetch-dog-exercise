import React, { useState, useRef, useEffect } from "react";
import "./MultiSelectDropdown.scss";

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  onChange,
  placeholder = "Select breeds...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCheckboxChange = (option) => (e) => {
    if (e.target.checked) {
      onChange([...selectedOptions, option]);
    } else {
      onChange(selectedOptions.filter((item) => item !== option));
    }
  };

  const removeChip = (option) => {
    onChange(selectedOptions.filter((item) => item !== option));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="selector-container" onClick={toggleDropdown}>
        <span className="selector-text">{placeholder}</span>
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      <div className="selector-chips-row">
        <div className="chips-container">
          {selectedOptions.map((option) => (
            <span key={option} className="chip">
              {option}
              <button
                onClick={() => removeChip(option)}
                className="remove-chip"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <label key={option} className="dropdown-option">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
