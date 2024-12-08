import React from 'react';

/**
 * Props interface for the RadioInput component.
 * @property {string} value - The value associated with the radio button.
 * @property {boolean} checked - Indicates whether the radio button is selected.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - Callback function triggered when the radio button state changes.
 */
interface Props {
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * RadioInput Component
 * Renders a single radio input with an associated label.
 *
 * @param {Props} props - The properties passed to the RadioInput component.
 * @returns {JSX.Element} - The rendered RadioInput component.
 */
const RadioInput: React.FC<Props> = ({ value, checked, onChange }) => {
  // Generate a user-friendly label by capitalizing the first letter of the value
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <div className="flex items-center mb-4">
      <input
        type="radio"
        id={`radio-${value}`}
        name="action"
        value={value}
        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={`radio-${value}`}
        className="text-sm font-medium text-gray-900"
      >
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
