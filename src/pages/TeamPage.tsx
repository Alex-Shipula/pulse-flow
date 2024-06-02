import React from 'react'
import { Box, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IEmployee, useSearchEmployeeQuery } from 'src/store/employee'
import { useSelector } from 'react-redux'
import { selectCurrentCompany } from 'src/store/company'
import { CompanyItem } from 'src/components/items/CompanyItem'
import StarIcon from '@mui/icons-material/Star'

const TeamPage: React.FC = () => {
  const currentCompany = useSelector(selectCurrentCompany)
  const team = currentCompany && useSearchEmployeeQuery({ company: currentCompany?.id })?.data

  return (
    <WrapperPage>
      <Box
        display={'flex'}
        alignItems={'start'}
        justifyContent={'space-between'}
        flexDirection={'column'}
        gap={'15px'}>
        <Typography fontSize={30} paddingBottom={'15px'}>
          Team Page
        </Typography>
        {team && team?.length > 0 && team.map((user: IEmployee) => (
          <Box
            key={user?.id}
            display={'flex'}
            alignItems={'center'}
            gap={'15px'}
          >
            <CompanyItem
              title={user?.user?.name}
              subTitle={user?.user?.surname}
              info={user?.user?.email} />
            {(user?.is_admin === true) && <StarIcon style={{ width: '40px', height: '40px' }} />}
          </Box>
        ))}
      </Box>
    </WrapperPage>
  )
}

export default TeamPage
