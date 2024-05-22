import React from 'react'
import authImage from 'src/assets/logo-pulse-flow.svg'
import {
  Box, styled, Modal as MuiModal, useTheme, Typography,
  TextField,
  Button
} from '@mui/material'

const SignInPage: React.FC = () => {
  const theme = useTheme()
  const img = <img src={authImage} alt="img" />

  const [password, setPassword] = React.useState('')
  const [login, setLogin] = React.useState('')

  const handleAuthLogin: () => void = () => {
    localStorage.setItem('name', login)
    window.location.reload()
  }

  const handleChangeLogin: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setLogin(event.target.value)
  }

  const handleChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setPassword(event.target.value)
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
        <>
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
          >Sign In</Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flexStart',
            gap: '24px'
          }}>
            <CustomizedInput
              value={login}
              type='text'
              placeholder='Enter Login'
              onChange={handleChangeLogin}
            />
            <CustomizedInput
              value={password}
              type='text'
              placeholder='Enter Password'
              onChange={handleChangePassword}
            />
          </Box>

          <Button
            onClick={handleAuthLogin}
            sx={{
              width: '381px',
              height: '43px',
              marginTop: '75px',
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
            >Sign In</Typography>
          </Button>
        </>
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
  min-height: 627px;
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
