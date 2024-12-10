import React, { useEffect, useState } from 'react'
import { ImageUrl } from '../../../utils/ImageUrl'
import classes from './Button.module.scss'

export const ButtonComponent: React.FC<{
  label?: string
  width?: string
  height?: string
  type?: string
  apihitting?: boolean
  submitEvent: any
  disabled?: boolean
  id?: string
  icon?: string
  iconPos?: string
  loading?: string
}> = ({
  label,
  width,
  type,
  apihitting,
  submitEvent,
  disabled,
  id,
  height,
}) => {
  const [btnwidth, setBtnWidth] = useState(width)
  const [btncolor, setBtnColor] = useState(type)
  const [btnapihitting, setBtnApihitting] = useState(apihitting)
  const [btnLabel, setLabel] = useState(label)
  const [btndisabled, setDisabled] = useState(disabled)
  const [btnid, setBtnid] = useState(id)

  useEffect(() => {
    setBtnApihitting(apihitting)
  }, [apihitting])

  useEffect(() => {
    setDisabled(disabled)
  }, [disabled])

  useEffect(() => {
    setBtnWidth(width)
  }, [width])

  useEffect(() => {
    setBtnColor(type)
  }, [type])

  useEffect(() => {
    setLabel(label)
  }, [label])
  useEffect(() => {
    setBtnid(id)
  }, [id])

  return (
    <button
      className={classes['btn-main']}
      style={{
        position: 'relative',
        ...(btnwidth
          ? { width: btnwidth, minWidth: btnwidth }
          : { width: 'auto', minWidth: '110px' }),
        ...(height ? { height: height } : ''),
        ...(btncolor === 'success'
          ? { background: '#536dfc', boxShadow: '0px 3px 6px #38383843' }
          : btncolor === 'danger'
          ? {
              background:
                'linear-gradient(to bottom, #ff0000 16%,#a84c4c 100%)',
            }
          : btncolor === 'verify'
          ? { background: '#39C85D' }
          : btncolor === 'default'
          ? {
              background:
                'linear-gradient(rgb(177 174 174) 16%, rgb(130 127 127) 100%)',
            }
          : {
              background:
                'linear-gradient(to bottom, #4661ff 1%,rgb(46 68 173) 86%)',
            }),
        ...(btnapihitting && !height ? { height: '40px' } : {}),
      }}
      disabled={btnapihitting || btndisabled}
      onClick={submitEvent}
      id={id}
    >
      {btnapihitting ? (
        <img
          className={classes['button-loader']}
          src={ImageUrl.BtnLoader}
          alt=""
        />
      ) : (
        <span>{btnLabel ? btnLabel : 'Submit'}</span>
      )}
    </button>
  )
}
