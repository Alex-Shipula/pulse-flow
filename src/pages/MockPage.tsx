import React from 'react'
import { Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'

const MockPage: React.FC = () => {
  return (
    <WrapperPage>
      <Typography fontSize={30} >
        Mock Page
      </Typography>
    </WrapperPage>
  )
}

export default MockPage
