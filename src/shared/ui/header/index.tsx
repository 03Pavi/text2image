import { appName } from '@/shared/constants/app-constants'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { AppLogo } from './assets'

const Header = () => {
  return (
    <Box>
      <Typography className='app-title'><AppLogo />{appName}</Typography>
    </Box>
    
  )
}

export default Header
