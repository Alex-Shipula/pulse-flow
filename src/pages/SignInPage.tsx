import React from 'react'
import authImage from 'src/assets/logo-pulse-flow.svg'
import {
  Box, styled, Modal as MuiModal, useTheme, Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const SignInPage: React.FC = () => {
  const theme = useTheme()
  const img = <img src={authImage} alt="img" />

  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [login, setLogin] = React.useState('')
  const [signUp, setSignUp] = React.useState(false)
  const [name, setName] = React.useState('')

  const handleAuthLogin: () => void = () => {
    !signUp && localStorage.setItem('name', login)
    !signUp && window.location.reload()
  }

  const handleChangeLogin: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setLogin(event.target.value)
  }

  const handleChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setPassword(event.target.value)
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSetUp = () => setSignUp((sign) => !sign)

  const handleChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setName(event.target.value)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden'
        }}
      >
        {img}
      </Box>
      <CustomizedModal open>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '546px'
          }}
        >
          <Box
            sx={{
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 'bold',
              lineHeight: '40px',
              marginBottom: '24px',
              marginTop: '8px',
              color: theme.palette.text.primary
            }}
          >{!signUp ? 'Sign In' : 'Sign Up'}</Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flexStart',
            gap: '24px'
          }}>

            {signUp && <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flexStart'
            }}>
              <Typography variant='body1' sx={{
                color: theme.palette.text.primary,
                marginBottom: '4.5px'
              }}>Name</Typography>
              <CustomizedInput
                value={name}
                type='text'
                placeholder='Enter Name'
                onChange={handleChangeName}
              />
            </Box>}

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flexStart'
            }}>
              <Typography variant='body1' sx={{
                color: theme.palette.text.primary,
                marginBottom: '4.5px'
              }}>Login</Typography>
              <CustomizedInput
                value={login}
                type='text'
                placeholder='Enter Login'
                onChange={handleChangeLogin}
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
                value={password}
                onChange={handleChangePassword}
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

          <Typography variant='body1' sx={{
            color: theme.palette.text.primary,
            marginBottom: '4.5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>{signUp ? 'You have account' : 'You not have account?'}
            <Button onClick={handleSetUp}>{signUp ? 'Sign In' : 'Sign Up'}</Button>
          </Typography>

          <Button
            onClick={handleAuthLogin}
            sx={{
              width: '381px',
              height: '43px',
              borderRadius: '12px',
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}>
            <Typography variant='button'
              sx={{
                textTransform: 'capitalize',
                color: theme.palette.text.primary
              }}
            >{!signUp ? 'Sign In' : 'Sign Up'}</Typography>
          </Button>
        </Box>
      </CustomizedModal >
    </>
  )
}

export default SignInPage

const CustomizedModal = styled(MuiModal)(`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
.MuiBackdrop-root {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 24px;
  transform: translate(-50%, -50%);
  width: 429px;
  min-height: 600px;
  border-radius: 24px;
  border: 3px solid rgba(65, 65, 213, 0.30);
  background: rgba(255, 255, 255, 0.60);
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(25px);
}
`)

const CustomizedInput = styled(TextField)(`
.MuiInputBase-input{
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  outline: none;
  padding: 2px 4px;
  &::placeholder {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
}
.MuiOutlinedInput-root {
  width: 381px;
  height: 40px;
  border-radius: 16px;
  border-color: rgba(65, 65, 213, 0.30);
  input {
    padding-left: 16px;
  }
}
.MuiOutlinedInput-notchedOutline {
  border-radius: 16px;
  border-color: rgba(65, 65, 213, 0.30);
}
`)
