import React, { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { ImageUrl } from '../../../../utils/ImageUrl'
import './ConfigurationCard.scss'
import classes from './ConfigurationCard.module.scss'
type cardDetailProps = {
  //     brand: string
  //     numberofCoupons: number
  //     amount: number
  //     qty: number
  //     denomination: number
  cardDetail: any
}

const ConfigurationCard: React.FC<cardDetailProps> = (props) => {
  const [cardDetails, setcardDetails]: any = useState(props.cardDetail)
  // let cardDetails = props.cardDetail
  const incDecIndex = (flag: any, cardDet: any) => {
    const obj = { ...cardDet }
    if (
      flag == 'inc' &&
      obj['currIndex'] < obj['denomnationWiseData']?.length - 1
    )
      obj['currIndex']++
    else if (flag == 'dec' && obj['currIndex'] > 0) obj['currIndex']--
    setcardDetails(obj)
  }
  return (
    <>
      <div
        className={classes['configuration-card']}
        style={{ borderLeft: `6px solid ${cardDetails?.borderLeftColor}` }}
      >
        <div
          className="row m-0 pt-1 pb-2"
          style={{ borderBottom: '1px solid #E6EBFF' }}
        >
          <div className="col-3 px-0 text-center">
            <div className={classes['card-brand-logo']}>
              {cardDetails?.brandLogo ? (
                <img
                  crossOrigin="anonymous"
                  src={`${process.env.REACT_APP_API_BASEURL}/${cardDetails?.brandLogo}`}
                  alt=""
                />
              ) : (
                <>
                  <img src={ImageUrl.GeneralBrandLogo} alt="" />
                </>
              )}
            </div>
            {/* <img crossOrigin="anonymous" src={cardDetails?.brandLogo} alt="" /> */}
          </div>
          <div className="col-5 px-1 perfect-left-column">
            <h3 className="ellipsis-text">{cardDetails?.brandName}</h3>
            <p>{cardDetails?.brandCount} coupons</p>
          </div>
          <div className="col-4 px-1 perfect-right-row">
            <h4>
              {/* {cardDetails?.currencySymbol} {cardDetails?.brandAmount} */}
              <NumericFormat
                value={cardDetails?.brandAmount}
                displayType={'text'}
                thousandSeparator={true}
                prefix={cardDetails?.currencySymbol + ' '}
              />
            </h4>
          </div>
        </div>
        <div className="card-lower-part">
          {cardDetails?.denomnationWiseData?.length > 4 ? (
            <i
              className="pi pi-angle-left"
              onClick={() => {
                incDecIndex('dec', cardDetails)
              }}
            ></i>
          ) : null}
          <div className="row m-0 justify-content-center">
            {cardDetails?.denomnationWiseData?.map(
              (element: any, index: any) => {
                return (
                  <>
                    {index >= cardDetails?.currIndex &&
                    index < cardDetails?.currIndex + 4 ? (
                      <div className="col-3 p-2 text-center" key={index}>
                        <h5>{element?.denomination.toLocaleString()}</h5>
                        <h6>({element?.count} Qty)</h6>
                      </div>
                    ) : null}
                  </>
                )
              }
            )}
          </div>
          {cardDetails?.denomnationWiseData?.length > 4 ? (
            <i
              className="pi pi-angle-right"
              onClick={() => {
                incDecIndex('inc', cardDetails)
              }}
            ></i>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default ConfigurationCard
