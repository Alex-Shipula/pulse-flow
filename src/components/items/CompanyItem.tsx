import React from 'react'
import { Box, Typography } from '@mui/material'

export const CompanyItem = ({ title, subTitle, info }:
{ title: string, subTitle?: string, info?: string }) => {
  return (
    <Box
      width={'300px'}
      height={'100px'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      padding={'20px'}
      borderRadius={'10px'}
      border={'1px solid #000'}
      boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.25)'}
      sx={{
        '&:hover': {
          backgroundColor: '#f5f5f5'
        },
        cursor: 'pointer',
        backgroundColor: 'rgba(243, 245, 249, .5)'
      }}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'3px'}
        overflow={'hidden'}
      >
        <Typography fontSize={20}>{title}</Typography>
        <Typography fontSize={14}>{subTitle}</Typography>
        <Typography fontSize={10}>{info}</Typography>
      </Box>
    </Box>
  )
}
