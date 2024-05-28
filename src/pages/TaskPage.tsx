import React from 'react'
import { Box, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import KanbanBoard from 'src/components/kanban/KanbanBoard'

const TaskPage: React.FC = () => {
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
          Task Page
        </Typography>
        <KanbanBoard />
      </Box>
    </WrapperPage>
  )
}

export default TaskPage
