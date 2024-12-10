import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import classes from './BackButton.module.scss'

const BackButton = () => {
  const history = useHistory()
  const [showBackBtn, setShowBackBtn] = useState(false)

  const goBack = () => {
    history.goBack()

    if (window.location.href.includes('#')) {
      history.goBack()
    }
  }
  useEffect(() => {
    if (
      window.location.href.includes('dashboard') ||
      window.location.href.includes('home')
    ) {
      setShowBackBtn(true)
    } else {
      setShowBackBtn(false)
    }
  }, [window.location.href])
  // console.log(window.location.href);

  return (
    <>
      {showBackBtn ? null : (
        <div className={classes['backButton']} onClick={goBack}>
          {/* <img src={ImageUrl.ReplyIcon} alt="" height={20} width={20} /> */}
          <FontAwesomeIcon icon={faReply} />
          <p>Back</p>
        </div>
      )}
    </>
  )
}

export default BackButton
