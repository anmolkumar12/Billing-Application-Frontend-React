/* eslint-disable @typescript-eslint/no-extra-semi */
import React, { useState, useEffect } from 'react'
// import './FileViewer.scss'
import classes from './FileViewer.module.scss'
import { UtilityService } from '../../../services/utility-service/utility.service'
import { ToasterService } from '../../../services/toaster-service/toaster-service'
import { Loader } from '../loader/Loader'
import { AuthService } from '../../../services/auth-service/auth.service'

interface PropsInterface {
  fileArray: string[] | []
  que: string
  heading: string
  fileViewer: any
  currentFileName: string
  downloadFile?: any
}

export default function FileViewer(props: PropsInterface) {
  const { fileArray, que, heading, fileViewer, currentFileName, downloadFile } =
    props
  const [loading, setLoading] = useState<any>(false)

  // console.log(fileArray)

  const [crouselCount, setCrouselCount] = React.useState(0)
  const [downloadedfile, setFile] = React.useState<any>()

  const displayViewFile = (fileName: any, q: any) => {
    for (let i = 0; i < fileArray.length; i++) {
      if (fileArray[i] === fileName) {
        setCrouselCount(i)
      }
    }
    ;(async () => {
      try {
        setLoading(true)
        const file: any = await new UtilityService().getFileBlobURL(fileName, q)
        setLoading(false)
        if (file) {
          setFile(file)
          fileViewer(true)
        }
      } catch (err) {
        // console.log('Error In Fetching File', err)
        ToasterService.show('File Not Found', 'error')
        setLoading(false)
      }
    })()
  }

  useEffect(() => {
    displayViewFile(currentFileName, que)
  }, [])
  const crouselNextFunctionality = () => {
    const update = crouselCount + 1
    displayViewFile(fileArray[update], que)
    setCrouselCount(update)
  }
  const crouselBackFunctionality = () => {
    const update = crouselCount - 1
    displayViewFile(fileArray[update], que)
    setCrouselCount(update)
  }
  //   `candidates/contest`
  {
    // console.log(downloadedfile)
  }
  return (
    <div className="popup-overlay">
      <div
        className="popup-body stretchLeft"
        style={{
          left: AuthService?.sideNavCollapse?.value ? '70px' : '200px',
          width: AuthService?.sideNavCollapse?.value
            ? 'calc(100% - 70px)'
            : 'calc(100% - 200px)',
        }}
      >
        <div className="popup-header">
          <div className="popup-close">
            <i
              className="pi pi-angle-left"
              onClick={() => fileViewer(false)}
            ></i>
            <h4 className="popup-heading"> {heading} </h4>
          </div>
          <div className="popup-right-close" onClick={() => fileViewer(false)}>
            &times;
          </div>
        </div>
        <div className="popup-content" style={{ height: 'calc(100vh - 50px)' }}>
          {loading && <Loader />}
          {/* <p>{fileArray?.length}</p> */}
          {fileArray.length > 1 ? (
            <div
              style={{
                display: 'flex',
                background: '#F2F6FE',
                justifyContent: 'end',
              }}
            >
              <button
                className={'cndt-card-btn-apply'}
                style={{ margin: '0.3em' }}
                onClick={() => crouselBackFunctionality()}
                disabled={crouselCount <= 0 ? true : false}
              >
                Prev
              </button>
              <button
                className={'cndt-card-btn-apply'}
                style={{ margin: '0.3em', marginRight: '2em' }}
                onClick={() => crouselNextFunctionality()}
                disabled={crouselCount >= fileArray.length - 1 ? true : false}
              >
                Next
              </button>
            </div>
          ) : null}

          <div className={classes['popup-cnt']}>
            <div className="row text-center m-0">
              <div className="col-12 support p-0">
                <iframe
                  // className="doc"
                  // src={`https://docs.google.com/gview?url=${downloadedfile}&embedded=true`}
                  // src={`http://docs.google.com/gview?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true`}
                  // src={`https://view.officeapps.live.com/op/embed.aspx?src=${downloadedfile}`}
                  // src={`https://view.officeapps.live.com/op/embed.aspx?src=https://www.germanna.edu/wp-content/uploads/tutoring/handouts/Google-Docs-Instructions-for-Formatting-an-Academic-Paper.pdf`}
                  // src ={`https://docs.google.com/a/[DOMINIO]/viewer?url=${downloadedfile}`}
                  src={downloadedfile}
                  // height="600px"
                  width="100%"
                  //   scrolling="auto"
                ></iframe>
              </div>
              {/* <div style={{textAlign:'end'}}><button className={classes['cndt-card-btn-apply1']} onClick={downloadFile}>downloadf Pdf</button></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
