import React from 'react'
import { Box, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import { CompanyItem } from 'src/components/items/CompanyItem'

const CompanyPage: React.FC = () => {
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
          Вітаємо
          на платформі PulseFlow
        </Typography>
        <Typography fontSize={20} >
          Тут ви можете долучитися до вже створеної компанії
          або додати та налаштувати власну.
        </Typography>
        <Typography fontSize={20} >
          Доступні компанії:
        </Typography>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          gap={'15px'}
        >
          <CompanyItem title={'Company 1'} />
          <CompanyItem title={'Company 2'} />
        </Box>
      </Box>
    </WrapperPage>
  )
}

export default CompanyPage
