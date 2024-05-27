import React, { useEffect } from 'react'
import { Box, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import { setUserState, useSearchUserQuery, selectUserState, selectEmailState } from 'src/store/users'
import { useDispatch, useSelector } from 'react-redux'
import CustomizedInput from 'src/components/CustomizedInput'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const userEmail = useSelector(selectEmailState)
  const searchUser: any = userEmail && useSearchUserQuery({ email: userEmail })?.data
  const user = useSelector(selectUserState)?.[0]

  const [showPassword, setShowPassword] = React.useState(false)

  useEffect(() => {
    searchUser && dispatch(setUserState(searchUser))
  }, [searchUser])

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
        Мій профіль
        </Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flexStart'
        }}>
          <Typography variant='body1' sx={{
            color: theme.palette.text.primary,
            marginBottom: '4.5px'
          }}>Name</Typography>
          <CustomizedInput
            value={user?.name}
            type='text'
            placeholder='Enter Name'
          />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flexStart'
        }}>
          <Typography variant='body1' sx={{
            color: theme.palette.text.primary,
            marginBottom: '4.5px'
          }}>SurName</Typography>
          <CustomizedInput
            value={user?.surname}
            type='text'
            placeholder='Enter SurName'
          />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flexStart'
        }}>
          <Typography variant='body1' sx={{
            color: theme.palette.text.primary,
            marginBottom: '4.5px'
          }}>Email</Typography>
          <CustomizedInput
            value={user?.email}
            type='text'
            placeholder='Enter Email'
          />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flexStart'
        }}>
          <Typography variant='body1' sx={{
            color: theme.palette.text.primary,
            marginBottom: '4.5px'
          }}>Password</Typography>
          <CustomizedInput
            placeholder='Enter Password'
            value={user?.password}
            id="filled-adornment-password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment:
                    < InputAdornment position="end" >
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
            }}
          />
        </Box>
      </Box>
    </WrapperPage>
  )
}

export default ProfilePage
