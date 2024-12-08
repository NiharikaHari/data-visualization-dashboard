import React from 'react';

/**
 * Props interface for the TextArea component.
 * @property {string} name - The name attribute for the textarea, used for form submission.
 * @property {string} label - The label text displayed above the textarea.
 * @property {number} rows - The number of visible text lines in the textarea.
 * @property {string} value - The current value of the textarea.
 * @property {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} onChange - Callback function triggered when the textarea value changes.
 * @property {boolean} isValid - Indicates whether the textarea input is valid.
 * @property {string} [errorMessage] - Optional error message displayed when `isValid` is false.
 */

interface Props {
  name: string;
  label: string;
  rows: number;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * TextArea Component
 * Renders a resizable text area with validation feedback and accessibility features.
 *
 * @param {Props} props - The properties passed to the TextArea component.
 * @returns {JSX.Element} - The rendered TextArea component.
 */

const TextArea: React.FC<Props> = ({
  name,
  label,
  rows,
  value,
  onChange,
  isValid,
  errorMessage,
  ...rest
}) => {
  return (
    <div className="mb-5">
      {/* Label for the textarea */}
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      {/* Textarea element */}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${name}-error` : undefined}
        className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border rounded-lg 
          ${
            isValid
              ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              : 'border-red-500 focus:ring-red-500 focus:border-red-500'
          }
        `}
        {...rest}
      />

      {/* Error message (optional) */}
      {!isValid && errorMessage && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default TextArea;
