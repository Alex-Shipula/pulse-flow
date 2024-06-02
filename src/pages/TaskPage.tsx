import React, { useMemo } from 'react'
import { Box, IconButton, InputAdornment, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import KanbanBoard from 'src/components/kanban/KanbanBoard'
import CustomizedInput from 'src/components/CustomizedInput'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { selectProjectState, useGetProjectFinanceQuery } from 'src/store/project'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IKanbanColumns, ITask, selectKanbanColumns, selectTaskState, useSearchTaskQuery } from 'src/store/task'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IChat, useCreateChatMutation, useSearchChatQuery } from 'src/store/chat'
import { selectCurrentUserState } from 'src/store/users'

const ChatTextMessage = ({ message }: { message: IChat }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '0.5px solid #e0e0e0',
        padding: '10px',
        gap: '10px',
        width: '100%',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={'15px'}
        overflow={'hidden'}
        sx={{
          width: '100%',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        <Typography fontSize={'8px'}>
          {message?.user?.email}
        </Typography>
        <Typography fontSize={'12px'}>
          {message?.text}
        </Typography>
      </Box>
    </Box>
  )
}

const TaskPage: React.FC = () => {
  const [createMesaage] = useCreateChatMutation()
  const projectId = useLocation().pathname.split('/')[2]
  const currentUser = useSelector(selectCurrentUserState)
  const projectFinance = useGetProjectFinanceQuery(projectId)?.data
  const chatMessagesRemote: IChat[] | undefined = useSearchChatQuery(projectId ? projectId.toString() : '')?.data
  const currentProject = useSelector(selectProjectState).filter(project => project.id === Number(projectId))[0]
  const tasksState = useSelector(selectTaskState)
  const { data, isLoading } = useSearchTaskQuery({ project: Number(projectId) })
  const kanbanColumnsState = useSelector(selectKanbanColumns)

  const [message, setMessage] = React.useState('')

  const kanbanColumns = () => {
    const kanban: IKanbanColumns = JSON.parse(JSON.stringify(kanbanColumnsState))
    tasksState && tasksState?.length > 0 && tasksState?.forEach((task: ITask) => {
      kanban[task?.state]?.items?.push(task)
    })
    return kanban
  }

  const handleSetMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleCreateMessage = async () => {
    await createMesaage({ project: Number(projectId), text: message, user: Number(currentUser?.id) })
  }

  const handlePushMessage = () => {
    // eslint-disable-next-line no-void
    void handleCreateMessage()
    setMessage('')
  }

  const KanbanTable = useMemo(() => {
    const kanban = kanbanColumns()
    return <KanbanBoard kanbanColumns={kanban} />
  }, [isLoading, kanbanColumnsState, tasksState, data])

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
        {currentProject && <Box
          width={'1045px'}
          height={'fit-content'}
          sx={{
            backgroundColor: 'aliceblue',
            borderRadius: '10px',
            border: '3px solid #e0e0e0',
            padding: '15px',
            marginTop: '16px',
            overflow: 'hidden',
            whiteSpace: 'break-word',
            wordWrap: 'break-word'
          }}>
          <Typography fontSize={18} >
            {currentProject?.description}
          </Typography>
        </Box>}
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'start'}>

          {!isLoading && KanbanTable}
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            maxWidth={'500px'}
            height={'750px'}
            sx={{
              backgroundColor: 'aliceblue',
              borderRadius: '10px',
              border: '3px solid #e0e0e0',
              padding: '15px',
              marginTop: '16px'
            }}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              width={'100%'}
              height={'100%'}
              sx={{
                backgroundColor: 'aliceblue',
                overflowY: 'auto',
                gap: '8px'
              }}
            >
              {chatMessagesRemote && chatMessagesRemote?.length > 0 &&
                chatMessagesRemote?.map((message: any, index: number) => (
                  <ChatTextMessage key={index} message={message} />
                ))}
            </Box>
            <CustomizedInput
              value={message}
              type='text'
              onChange={handleSetMessage}
              placeholder='Enter Message'
              sx={{
                position: 'relative',
                bottom: '0',
                marginTop: '20px',
                '& .MuiOutlinedInput-root': {
                  width: '100%'
                }
              }}
              InputProps={{
                endAdornment:
                  < InputAdornment position="end" >
                    <IconButton
                      onClick={handlePushMessage}
                      edge="end"
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Box>
        </Box>
        {projectFinance && <Box
          width={'1045px'}
          height={'fit-content'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          marginBottom={'30px'}
          sx={{
            backgroundColor: 'aliceblue',
            borderRadius: '10px',
            border: '3px solid #e0e0e0',
            padding: '15px',
            marginTop: '16px',
            overflow: 'hidden',
            whiteSpace: 'break-word',
            wordWrap: 'break-word'
          }}>
          <Typography fontSize={18} >
            Дохід {projectFinance?.income}
          </Typography>
          <Typography fontSize={18} >
            Профіт {projectFinance?.profit}
          </Typography>
          <Typography fontSize={18} >
            Начало {projectFinance?.start_date}
          </Typography>
          <Typography fontSize={18} >
            Кінець {projectFinance?.end_date}
          </Typography>
        </Box>}
      </Box>
    </WrapperPage>
  )
}

export default TaskPage
