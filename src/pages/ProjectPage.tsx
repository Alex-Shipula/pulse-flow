import React from 'react'
import { Box, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import { useNavigate } from 'react-router-dom'
import { CompanyItem } from 'src/components/items/CompanyItem'

const ProjectPage: React.FC = () => {
  const navigate = useNavigate()

  const handleClick = (id: string) => {
    navigate(`/task/${id}`)
  }

  return (
    <WrapperPage>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        gap={'30px'}
      >
        <Typography fontSize={30} >
          Проекти
        </Typography>
        <Typography fontSize={20} >
          Створюй свої проекти та долучайся до вже існуючих
        </Typography>
        <Typography fontSize={20} >
          Доступні проекти:
        </Typography>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          gap={'15px'}
        >
          <Box onClick={() => handleClick('1')}>
            <CompanyItem title={'Project 1'} />
          </Box>
          <Box onClick={() => handleClick('2')}>
            <CompanyItem title={'Project 2'} />
          </Box>
        </Box>
      </Box>
    </WrapperPage>
  )
}

export default ProjectPage
