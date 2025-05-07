import React, { useState } from 'react';
import PopUp from '../popup/PopUp';
import { Box } from '@material-ui/core';
import Button from './button/ButtonComponent';
import { Calendar } from 'primereact/calendar';

interface ConfirmDialogueInterface {
  actionPopupToggle: {
    displayToggle?: boolean;
    title?: string;
    message?: string;
    acceptButtonType?:
      | 'secondary'
      | 'info'
      | 'default'
      | 'cancel'
      | 'danger'
      | 'warning';
    rejectFunction?: any;
    acceptFunction?: any;
    askForDeactivationDate?: boolean; // New property to enable/disable date picker,
    minDate?: any;
  };
  onCloseFunction: any;
  loading?: boolean;
}

const ConfirmDialogue: React.FC<ConfirmDialogueInterface> = (props: any) => {
  const { actionPopupToggle, onCloseFunction, loading } = props;
  const [deactivationDate, setDeactivationDate] = useState<Date | null>(null); // State for Calendar
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  const defaultMinDate = new Date();
  defaultMinDate.setMonth(defaultMinDate.getMonth() - 3);

  const handleConfirmClick = () => {
    if (actionPopupToggle.askForDeactivationDate && !deactivationDate) {
      // Show an error if the date is required but not selected
      setErrorMessage('Deactivation date is required.');
      return;
    }

    // Clear the error and call the acceptFunction with the date (if required)
    setErrorMessage(null);
    if (actionPopupToggle.askForDeactivationDate) {
      actionPopupToggle.acceptFunction(deactivationDate); // Pass the selected date
    } else {
      actionPopupToggle.acceptFunction();
    }
  };

  return (
    <PopUp
      title={actionPopupToggle.title}
      size="very small"
      onClose={onCloseFunction}
      display={
        !(
          actionPopupToggle?.acceptButtonType === 'warning' ||
          actionPopupToggle?.acceptButtonType === 'danger'
        )
          ? 'green'
          : 'red'
      }
    >
      <h4
        className="popup-message"
        color="primary"
        style={{
          margin: '1rem  0 0.75rem 0',
          fontSize: '14px',
          padding: 0,
          color: '#000',
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        {actionPopupToggle.message}
      </h4>

      {/* Render the Calendar if deactivation date is required */}
      {actionPopupToggle.askForDeactivationDate ? (
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <Calendar
            value={deactivationDate}
            onChange={(e: any) => setDeactivationDate(e.value)}
            dateFormat="yy-mm-dd"
            placeholder="Select Deactivation Date"
            minDate={actionPopupToggle?.minDate ? new Date(actionPopupToggle.minDate) : defaultMinDate}
            style={{
              height: '30px',
              width: '250px',
              fontSize: '14px',
              // padding: '4px 10px',
              // border: '1px solid #ccc',
              // borderRadius: '5px',
            }}
          />
          {/* Display error message if date is not selected */}
          {errorMessage && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {errorMessage}
            </p>
          )}
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '1rem 0 0.5rem',
        }}
      >
        <Box style={{ marginRight: '10px' }}>
          <Button
            label="Confirm"
            onClick={handleConfirmClick} // Use the custom handler
            loading={loading}
            severity={actionPopupToggle.acceptButtonType}
          />
        </Box>
        <Box>
          <Button
            label="Cancel"
            onClick={(e: any) => actionPopupToggle.rejectFunction(e)}
            severity="secondary"
          />
        </Box>
      </div>
    </PopUp>
  );
};

export default ConfirmDialogue;
