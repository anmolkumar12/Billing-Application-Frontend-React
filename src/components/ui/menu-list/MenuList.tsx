import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

interface MenuProps {
  arr?: {
    label?: string
    onClick?: any
    icon?: any
  }[]
  anchorEl?: any
  handleClose?: any
  horizontal?: any
  style?: any
  color?: string
  width?: string
  boxShadow?: string
  borderRadius?: string
  marginTop?: string
  marginLeft?: string
}

export default function MenuList(props: MenuProps) {
  const {
    arr = [],
    anchorEl,
    handleClose,
    horizontal = 'center',
    style,
    color,
    width,
    boxShadow,
    borderRadius,
    marginTop,
    marginLeft,
  } = props
  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
      color: color,
      width: width,
      boxShadow: boxShadow,
      borderRadius: borderRadius,
      marginTop: marginTop,
      marginLeft: marginLeft,
    },
  })((props: any) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: horizontal,
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: horizontal,
      }}
      {...props}
    />
  ))

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      fontSize: 14,
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
      selected: {
        '&.Mui-selected': {
          color: 'white',
          fontWeight: 600,
        },
      },
    },
  }))(MenuItem)
  return (
    <div>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // horizonatal={horizontal}
      >
        {arr.map((item: any, index: number) => {
          return (
            <StyledMenuItem
              onClick={item.onClick}
              key={index}
              selected
              style={style}
            >
              {item.icon && <Box p={0.5}>{item.icon()}</Box>}
              {item.label}
            </StyledMenuItem>
          )
        })}
      </StyledMenu>
    </div>
  )
}
