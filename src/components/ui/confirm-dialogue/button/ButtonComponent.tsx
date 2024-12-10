// import './ButtonComponent.css'
import { Button } from 'primereact/button'
import classes from './ButtonComponent.module.scss'

type ButtonProps = {
  label?: string
  severity?: string
  onClick?: any
  size?: string
  className?: string
  icon?: string
  loading?: boolean
  disabled?: boolean
  iconPos?: string
}

export default function Index(props: ButtonProps) {
  const {
    label,
    severity,
    onClick,
    size = 'md',
    className = classes['default'],
    icon,
    loading = false,
    disabled = false,
    iconPos,
  } = props
  //TODO : make size configurable from props
  if (severity && severity === 'primary') {
    return (
      <Button
        style={{ minWidth: '100px', fontWeight: '500' }}
        onClick={onClick}
        loading={loading}
        label={label}
        disabled={disabled}
      />
    )
  } else if (severity && severity === 'success') {
    return (
      <Button
        className={classes['pp-button-successv1']}
        style={{ minWidth: '100px', fontWeight: '500' }}
        onClick={onClick}
        loading={loading}
        label={label}
        disabled={disabled}
      />
    )
  } else if (severity && severity === 'info') {
    return (
      <Button
        className={classes['pp-button-Infov1']}
        style={{ minWidth: '100px', fontWeight: '500' }}
        onClick={onClick}
        loading={loading}
        label={label}
        disabled={disabled}
      />
    )
  } else if (severity && severity === 'secondary') {
    return (
      <Button
        className={classes['pp-button-secondaryv1']}
        style={{ minWidth: '100px', fontWeight: '500' }}
        onClick={onClick}
        loading={loading}
        label={label}
        disabled={disabled}
      />
    )
  } else if (severity && severity === 'warning') {
    return (
      <Button
        className={classes['pp-button-warningv1']}
        style={{ minWidth: '100px', fontWeight: '500' }}
        onClick={onClick}
        loading={loading}
        label={label}
        disabled={disabled}
      />
    )
  } else if (severity && severity === 'danger') {
    return (
      <Button
        className={classes['pp-button-dangerv1']}
        style={{ minWidth: '100px', fontWeight: '500' }}
        onClick={onClick}
        loading={loading}
        label={label}
        disabled={disabled}
      />
    )
  } else {
    return (
      <div>
        <Button
          className={className}
          style={{ minWidth: '100px', fontWeight: '500' }}
          onClick={onClick}
          loading={loading}
          label={label}
          disabled={disabled}
          icon={icon}
        />
      </div>
    )
  }
}
