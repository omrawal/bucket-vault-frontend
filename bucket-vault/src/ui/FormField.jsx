// src/ui/FormField.jsx
import React, { useState } from 'react';

function normalizeOptions(options = []) {
  return options.map((opt) =>
    typeof opt === 'string' || typeof opt === 'number'
      ? { label: String(opt), value: opt }
      : { label: opt.label, value: opt.value }
  );
}

function FormField({
  type = 'text',             // 'text' | 'textarea' | 'select' | 'multiselect'
  name,
  label,
  value,
  onChange,
  placeholder = '',
  options = [],
  disabled = false,
  required = false,
  className = '',
}) {
  const [focused, setFocused] = useState(false);
  const normalized = normalizeOptions(options);

  const hasValue =
    type === 'multiselect'
      ? Array.isArray(value) && value.length > 0
      : value !== undefined && value !== null && String(value).trim() !== '';

  const float = focused || hasValue;

  const handleTextChange = (e) => {
    onChange?.(e.target.value);
  };

  const handleSelectChange = (e) => {
    onChange?.(e.target.value);
  };

  const handleMultiSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    onChange?.(selected);
  };

  const commonEvents = {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  const baseInputClass = 'form-input';
  const selectClass = 'portfolio-select';

  const renderControl = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          className={baseInputClass}
          value={value ?? ''}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          {...commonEvents}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={name}
          name={name}
          className={selectClass}
          value={value ?? ''}
          onChange={handleSelectChange}
          disabled={disabled}
          {...commonEvents}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'multiselect') {
      return (
        <select
          id={name}
          name={name}
          className={selectClass}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={handleMultiSelectChange}
          disabled={disabled}
          {...commonEvents}
        >
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // text-like inputs
    return (
      <input
        id={name}
        name={name}
        type={type}
        className={baseInputClass}
        value={value ?? ''}
        onChange={handleTextChange}
        placeholder={placeholder}
        disabled={disabled}
        {...commonEvents}
      />
    );
  };

  return (
    <div className={`form-group floating-field ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={
            'floating-label' +
            (float ? ' floating-label--active' : '') +
            (disabled ? ' floating-label--disabled' : '')
          }
        >
          {label}
          {required && <span className="floating-required">*</span>}
        </label>
      )}
      {renderControl()}
    </div>
  );
}

export default FormField;
