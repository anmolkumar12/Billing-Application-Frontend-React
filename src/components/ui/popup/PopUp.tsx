import { ImageUrl } from '../../../utils/ImageUrl'
import classes from './PopUp.module.scss'

type popUpProps = {
  style?: any
  title?: string
  Width?: string
  margin?: string
  maxWidth?: string
  boxShadow?: string
  background?: string
  borderRadius?: string
  opacity?: number
  padding?: string
  height?: string
  children?: any
  border?: string
  size?: string
  backGroundDarknesss?: string
  onClose?: any
  display?: string
  popupinnerh2?: string
  popupinnerBackground?: string
}

const PopUp = (props: popUpProps) => {
  const {
    title = 'Give Title Please',
    size = '',
    display = '',
    popupinnerBackground = '#F2F6FE',
    popupinnerh2 = 'popup-inner-h2',
    backGroundDarknesss = '0.7',
    Width = '',
  } = props
  const displayDetail = false
  let popupHeight = '590px'
  let width = ''

  if (size === 'very small') {
    width = '500px'
    popupHeight = '220px'
  } else if (size === 'small') {
    width = '750px'
  } else if (size === 'large') {
    width = '1000px'
    popupHeight = '650px'
  } else if (size === 'auto') {
    width = 'auto'
    popupHeight = 'auto'
  } else if (size === 'extra large') {
    width = '100%'
    popupHeight = '1100px'
  } else {
    width = '875px'
  }
  const popupOuterStyle: any = {
    width: '100%',
    background: `rgba(0, 0, 0, ${backGroundDarknesss})`,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px 0px 20px 15px',
  }
  const popupInnerStyle: any = {
    maxWidth: width,
    // background: '#F2F6FE',
    background: popupinnerBackground,
    padding: '0',
    borderRadius: '10px',
    boxShadow: '0 2px 18px 0 #607d8b8a',
    overflow: 'hidden',
    position: 'relative',
    width: Width ? Width : '85%',
    //maxHeight: popupHeight,
  }

  return (
    <div style={popupOuterStyle}>
      <div style={popupInnerStyle}>
        <span
          className={classes['popup-inner-h2-span']}
          onClick={() => props.onClose(displayDetail)}
          style={{ cursor: 'pointer' }}
        >
          <i className="pi pi-times"></i>
        </span>
        <div className={classes['popup-padding']}>
          <div className={classes['popup-content-bggg']}>
            {display ? (
              <div className="text-center" style={{ margin: '8px' }}>
                {display === 'green' ? (
                  <img src={ImageUrl.AcceptIconImage} />
                ) : (
                  <img src={ImageUrl.RejectIconImage} />
                )}
              </div>
            ) : null}
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PopUp
