import React from 'react'
import { Box, useTheme } from '@mui/material'
import { ReactComponent as Logo } from '../assets/logo-pulse-flow.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import Time from './Time'
import LeftBarItem from './items/LeftBarItem'
import { useSelector } from 'react-redux'
import { selectCurrentCompany } from 'src/store/company'

const items = ['ЗАВДАННЯ', 'МОЯ КОМАНДА']

const TopMiniBar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const projectId = location.pathname.split('/')[2]
  const currentCompany = useSelector(selectCurrentCompany)

  const routerList = [
    `/task/${projectId}`,
    `/team/${projectId}`
  ]

  const handleNavigate = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100px',
        backgroundColor: theme.palette.primary.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 80px',
        boxShadow: '2px 18px 25px rgba(4, 2, 0.6, 0.1)'
      }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={'65px'}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          onClick={handleNavigate}
          sx={{
            cursor: 'pointer'
          }}
        >
          <Logo width={'70px'} height={'70px'} />
        </Box>
        <Box
          sx={{
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            lineHeight: '30px',
            color: theme.palette.primary.dark
          }}
        >{currentCompany?.name}</Box>
        <Box
          sx={{
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            lineHeight: '30px',
            color: theme.palette.primary.dark
          }}
        >{currentCompany?.unique_identifier}</Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '65px',
            marginTop: '7px'
          }}
        >
          {items.map((item, index) => {
            return <LeftBarItem
              key={index}
              item={item}
              router={routerList[index]}
              isSelect={location.pathname.includes(routerList[index])} />
          })}
        </Box>
      </Box>
      <Time />
    </Box>
  )
}

export default TopMiniBar
