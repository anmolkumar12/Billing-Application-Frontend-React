import React from 'react'
import './Label.scss'

type LabelProps = {
  label?: string
  optionalLabel?: string
  required?: boolean
  fontSize?: number
}

export default function Index(props: LabelProps) {
  const { label, optionalLabel, required = false, fontSize = 12 } = props
  const style: any = {
    fontSize: fontSize,
  }
  return (
    <div className="formLabel" style={style}>
      <div className="FormLabelInner">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </div>
      {optionalLabel && <div>{optionalLabel}</div>}
    </div>
  )
}

// import React from 'react'

// type LabelProps = {
//   label?: string
//   optionalLabel?: string
//   required?: boolean
//   fontSize?: number
// }

// export default function Index(props: LabelProps) {
//   const { label, optionalLabel, required = false, fontSize = 12 } = props
//   const style: any = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     fontWeight: 600,
//     fontSize: fontSize,
//     padding: '0 0 0.35rem 0',
//   }
//   return (
//     <div style={style}>
//       <div>
//         {required && <span style={{ color: 'red' }}>*</span>} {label}
//       </div>
//       {optionalLabel && <div>{optionalLabel}</div>}
//     </div>
//   )
// }
