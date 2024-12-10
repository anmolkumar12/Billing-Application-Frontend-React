import React from 'react'
import { ImageUrl } from '../../../../utils/ImageUrl'
// import './NoRecord.scss'
import classes from './NoRecord.module.scss'

export const NoRecord: React.FC<{
  NoRecordDivHeight?: string
  NoRecordDivWidth?: string
  NoRecordImg?: string
}> = ({ NoRecordDivHeight, NoRecordDivWidth, NoRecordImg }) => {
  return (
    <>
      <div
        className={classes['no-recordDiv']}
        style={{ height: NoRecordDivHeight, width: NoRecordDivWidth }}
      >
        <img src={NoRecordImg || ImageUrl.NoRecImg} alt="" />
        <p>No Record Found!</p>
      </div>
    </>
  )
}
