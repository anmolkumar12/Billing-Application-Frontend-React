import React from 'react'
// import './Loader.scss'
import classes from './Loader.module.scss'
import { ImageUrl } from '../../../utils/ImageUrl'

export const Loader: React.FC<{
  loaderHeight?: string
}> = ({ loaderHeight }) => {
  return (
    <div
      className={classes['loader-container']}
      style={{ height: loaderHeight || 'calc(100vh - 70px)' }}
    >
      <img
        className={classes['main-loader']}
        src={ImageUrl.Loader}
        alt="Loader Img"
      />
      <p className={'waitcls'}>Please Wait ...</p>
    </div>
  )
}
