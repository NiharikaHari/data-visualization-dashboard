import { useCallback, useReducer } from 'react';
import { FormData } from '@/lib/types';
import RadioInput from '@/components/run-pipeline/RadioInput';
import { runPipeline } from '@/lib/apiUtils';
import Modal from '@/components/run-pipeline/Modal';
import TextArea from '@/components/run-pipeline/TextArea';

// Define available pipeline stages
const stages = ['all', 'clean', 'merge', 'aggregate'];

// TypeScript type for tracking the current status of the component
type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Action types for useReducer hook.
 * Defines the actions that can modify the state in the reducer.
 *
 * @property {Object} UPDATE_FORM - Action to update form data with a partial FormData object.
 * @property {Object} SET_STATUS - Action to update the component's status.
 * @property {Object} SET_AGGREGATION_VALID - Action to set the aggregation validation state.
 */

type Action =
  | { type: 'UPDATE_FORM'; payload: Partial<FormData> }
  | { type: 'SET_STATUS'; payload: Status }
  | { type: 'SET_AGGREGATION_VALID'; payload: boolean };

/**
 * State interface for the useReducer hook.
 * Represents the structure of the state managed by the reducer.
 *
 * @property {FormData} formData - The form data containing user inputs for the pipeline.
 * @property {boolean} aggregationValid - Indicates whether the JSON input for aggregation parameters is valid.
 * @property {Status} status - Tracks the current status of the component, such as 'idle', 'loading', 'success', or 'error'.
 */

interface State {
  formData: FormData;
  aggregationValid: boolean; // Tracks validity of JSON input for aggregation parameters
  status: Status; // Tracks the current status of the component
}

// Initial state for the component
const initialState: State = {
  formData: {
    demographic_file: undefined,
    expenditure_file: undefined,
    action: 'all',
    aggregation_parameters: undefined,
  },
  aggregationValid: true,
  status: 'idle',
};

/**
 * Reducer function for managing state updates.
 * Handles the state changes based on the dispatched actions.
 *
 * @param {State} state - The current state of the component.
 * @param {Action} action - The action dispatched to modify the state.
 * @returns {State} The updated state based on the action type.
 */

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_AGGREGATION_VALID':
      return { ...state, aggregationValid: action.payload };
    default:
      return state;
  }
};

/**
 * Component to run the pipeline.
 * It takes the input parameters and triggers the pipeline with them.
 */
const RunPipelineTab = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Handles changes in form inputs (text, radio, or textarea).
   * Updates state using the appropriate action based on the input type.
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      if (type === 'radio') {
        // Update the "action" field when a radio input is changed
        dispatch({ type: 'UPDATE_FORM', payload: { action: value } });
      } else if (type === 'textarea') {
        // Validate and parse JSON for aggregation parameters
        try {
          const data = JSON.parse(value);
          dispatch({
            type: 'UPDATE_FORM',
            payload: { aggregation_parameters: data },
          });
          dispatch({ type: 'SET_AGGREGATION_VALID', payload: true });
        } catch {
          // If parsing fails, mark the input as invalid
          dispatch({ type: 'SET_AGGREGATION_VALID', payload: false });
        }
      } else {
        // Update other form fields
        dispatch({ type: 'UPDATE_FORM', payload: { [name]: value } });
      }
    },
    []
  );

  /**
   * Handles form submission.
   * Triggers the pipeline execution via an API call and updates the status accordingly.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_STATUS', payload: 'loading' });

    try {
      // Execute the pipeline and update the status upon success
      await runPipeline(state.formData);
      dispatch({ type: 'SET_STATUS', payload: 'success' });
    } catch (error) {
      // Log error and update the status to "error"
      console.error('Error submitting form:', error);
      dispatch({ type: 'SET_STATUS', payload: 'error' });
    }
  };

  return (
    <div>
      {/* Component Header */}
      <h1>Input Parameters</h1>

      {/* Show loading overlay when the status is "loading" */}
      {state.status === 'loading' && (
        <div className="load-bg">
          <div className="loader loader-style"></div>
        </div>
      )}

      {/* Display modal for success or error messages */}
      {['success', 'error'].includes(state.status) && (
        <Modal
          title={state.status === 'success' ? 'Success' : 'Error'}
          message={
            state.status === 'success'
              ? 'Pipeline executed successfully!'
              : 'An error occurred. Please try again.'
          }
          onClose={() => dispatch({ type: 'SET_STATUS', payload: 'idle' })}
        />
      )}

      {/* Input Form */}
      <form className="max-w-lg ml-10" onSubmit={handleSubmit}>
        {/* Input for demographic file name */}
        <div className="mb-5">
          <label>
            Raw Demographics Data File Name (Optional)
            <input
              name="demographic_file"
              className="text-input"
              placeholder="Block_4_Demographic particulars of household members_sample.tsv"
              value={state.formData.demographic_file}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* Input for expenditure file name */}
        <div className="mb-5">
          <label>
            Raw Expenditure Data File Name (Optional)
            <input
              name="expenditure_file"
              className="text-input"
              placeholder="Block_8_Household consumer expenditure_sample.tsv"
              value={state.formData.expenditure_file}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* Radio input for selecting pipeline stages */}
        <fieldset>
          <label>
            Actions to Run:
            {stages.map((stage) => (
              <RadioInput
                key={stage}
                value={stage}
                checked={state.formData.action === stage}
                onChange={handleInputChange}
              />
            ))}
          </label>
        </fieldset>

        {/* Text area for aggregation parameters */}
        <TextArea
          name="aggregation_parameters"
          label="Aggregation Parameters (Optional)"
          rows={4}
          value={JSON.stringify(state.formData.aggregation_parameters, null, 2)}
          onChange={handleInputChange}
          isValid={state.aggregationValid}
        />

        {/* Submit button */}
        <button type="submit" className="button-1">
          Run Pipeline
        </button>
      </form>
    </div>
  );
};

export default RunPipelineTab;
