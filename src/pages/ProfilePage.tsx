import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import { setUserState, useSearchUserQuery, selectUserState, selectEmailState } from 'src/store/users'
import { useDispatch, useSelector } from 'react-redux'

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch()
  const userEmail = useSelector(selectEmailState)
  const searchUser: any = userEmail && useSearchUserQuery({ email: userEmail })?.data
  const user = useSelector(selectUserState)?.[0]

  useEffect(() => {
    searchUser && dispatch(setUserState(searchUser))
  }, [searchUser])

  return (
    <WrapperPage>
      <Typography fontSize={30} >
        Мій профіль
      </Typography>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        alignItems={'start'}
        gap={'30px'}
      >

      </Box>
    </WrapperPage>
  )
}

export default ProfilePage
