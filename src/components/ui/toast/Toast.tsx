import { Toast } from 'primereact/toast'
import './Toast.scss'
import { ImageUrl } from '../../../utils/ImageUrl'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'

type ToastProps = {
  // TODO Update Props
  toast?: any
  baseZIndex?: number
}

export const Content = (message?: string, type?: string) => {
  const style = {
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
  return (
    <div className="p-flex p-flex-column" style={{ flex: '1' }}>
      <div
        className="p-text-center"
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {type === 'error' ? (
          <div style={{ ...style, background: 'red' }}>
            <img src={ImageUrl.Error} alt="icon" />
          </div>
        ) : type === 'success' ? (
          <div style={{ ...style, background: 'green' }}>
            <img src={ImageUrl.Success} alt="icon" />
          </div>
        ) : (
          <div style={{ ...style, background: 'orange' }}>
            <img src={ImageUrl.Error} alt="icon" />
          </div>
        )}
        <div className="toast-message">
          {message && (
            <p style={{ margin: '0px 0px 0px 0px', padding: '8px' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const ToastComponent = (props: ToastProps) => {
  const { toast, baseZIndex } = props
  // const clear = () => {          //TODO: Need to check its use.
  //   toast.current.clear();
  // }

  return <Toast ref={toast} baseZIndex={baseZIndex} position="top-right" />
}

export default ToastComponent
