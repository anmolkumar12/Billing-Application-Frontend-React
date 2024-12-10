import PopUp from '../popup/PopUp'
import { Box, Typography } from '@material-ui/core'
import Button from './button/ButtonComponent'

interface ConfirmDialogueInterface {
  actionPopupToggle: {
    displayToggle?: boolean
    title?: string
    message?: string
    acceptButtonType?:
      | 'secondary'
      | 'info'
      | 'default'
      | 'cancel'
      | 'danger'
      | 'warning'
    rejectFunction?: any
    acceptFunction?: any
  }
  onCloseFunction: any
  loading?: boolean
}

const ConfirmDialogue: React.FC<ConfirmDialogueInterface> = (props: any) => {
  const { actionPopupToggle, onCloseFunction, loading } = props

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
          color: '#374baa',
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        {actionPopupToggle.message}
      </h4>

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
            onClick={(e: any) => actionPopupToggle.acceptFunction(e)}
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
  )
}

export default ConfirmDialogue
