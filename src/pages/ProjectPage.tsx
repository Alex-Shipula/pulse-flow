import React from 'react'
import { Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import { useNavigate } from 'react-router-dom'

const ProjectPage: React.FC = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/task/1')
  }

  return (
    <WrapperPage>
      <Typography fontSize={30} onClick={handleClick}>
      Project Page
      </Typography>
    </WrapperPage>
  )
}

export default ProjectPage
