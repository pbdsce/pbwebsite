"use client";

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  className?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const CustomSelect = forwardRef<HTMLInputElement, CustomSelectProps>((
  {
    options,
    value = "",
    onChange,
    placeholder = "Select an option",
    name,
    className = "",
    error,
    required = false,
    disabled = false,
    ...props
  },
  ref
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (highlightedIndex >= 0 && onChange) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <input
        ref={ref}
        type="hidden"
        name={name}
        value={value}
        required={required}
        {...props}
      />

      <div
        className={`
          w-full px-4 py-3 rounded-xl border cursor-pointer
          bg-gray-900/50 text-white
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          transition-all duration-200 hover:border-gray-600
          flex items-center justify-between
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${isOpen ? 'ring-2 ring-green-500 border-transparent' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            id={dropdownId}
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute z-50 w-full mt-1 
              bg-gray-900 border border-gray-700 rounded-xl shadow-lg
              max-h-60 overflow-auto
            "
            role="listbox"
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`
                  px-4 py-3 cursor-pointer text-white
                  transition-colors duration-150
                  ${index === highlightedIndex ? 'bg-green-500/20 text-green-300' : 'hover:bg-gray-800'}
                  ${value === option.value ? 'bg-green-500/10 text-green-400' : ''}
                  ${index === 0 ? 'rounded-t-xl' : ''}
                  ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                `}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;