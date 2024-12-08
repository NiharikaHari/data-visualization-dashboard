import React from 'react';

/**
 * Props interface for the Modal component.
 * @property {string} title - The title displayed at the top of the modal.
 * @property {string} message - The message or content displayed in the modal body.
 * @property {() => void} onClose - Callback function triggered when the modal is closed.
 */
interface Props {
  title: string;
  message: string;
  onClose: () => void;
}

/**
 * Modal Component
 * Renders a centered modal overlay with a title, message, and a close button.
 *
 * @param {Props} props - The properties passed to the Modal component.
 * @returns {JSX.Element} - The rendered Modal component.
 */
const Modal: React.FC<Props> = ({ title, message, onClose }) => {
  // Close the modal when the "Escape" key is pressed
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Modal content */}
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm">
        {/* Modal title */}
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        {/* Modal message */}
        <p id="modal-message" className="mt-2 text-gray-600">
          {message}
        </p>
        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
