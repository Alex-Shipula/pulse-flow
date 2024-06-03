import React, { useEffect, useMemo } from 'react'
import { Box, Button, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import KanbanBoard from 'src/components/kanban/KanbanBoard'
import CustomizedInput from 'src/components/CustomizedInput'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { selectProjectState, useGetProjectFinanceQuery, useProjectIsPmQuery } from 'src/store/project'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IKanbanColumns, ITask, selectKanbanColumns, selectTaskState, setTaskState } from 'src/store/task'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IChat, useCreateChatMutation } from 'src/store/chat'
import { selectCurrentUserState } from 'src/store/users'
import axios from 'axios'
import { serverURL } from 'src/config'
import AddTasksModal from 'src/components/AddTasksModal'

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
  const theme = useTheme()
  const dispatch = useDispatch()
  const [createMesaage] = useCreateChatMutation()
  const projectId = useLocation().pathname.split('/')[2]
  const currentUser = useSelector(selectCurrentUserState)
  const projectFinance = useGetProjectFinanceQuery(projectId)?.data
  const { data: isProjectManager } = useProjectIsPmQuery(projectId)
  const currentProject = useSelector(selectProjectState).filter(project => project.id === Number(projectId))[0]
  const tasksState = useSelector(selectTaskState)
  const kanbanColumnsState = useSelector(selectKanbanColumns)

  const [isLoading, setIsLoading] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [chatMessagesRemote, setChatMessagesRemote] = React.useState<IChat[]>([])

  const getChatMessageRemote = async (projectId: string) => {
    const token = localStorage.getItem('token') ?? ''
    await axios.get(`${serverURL}/api/chat/search?project=${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res?.data) {
        setChatMessagesRemote(res.data)
      }
    }).catch(() => {
      console.log('error')
    })
  }

  const getTasksRemote = async (projectId: string) => {
    const token = localStorage.getItem('token') ?? ''
    setIsLoading(true)
    await axios.get(`${serverURL}/api/task/search?project=${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res?.data) {
        dispatch(setTaskState(res.data))
        setIsLoading(false)
      }
    }).catch(() => {
      console.log('error')
      setIsLoading(false)
    })
  }

  useEffect(() => {
    if (projectId) {
      // eslint-disable-next-line no-void
      void getTasksRemote(projectId)
    }
  }, [projectId])

  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line no-void
      void getChatMessageRemote(projectId)
    }, 7000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const kanbanColumns = () => {
    const kanban: IKanbanColumns = JSON.parse(JSON.stringify(kanbanColumnsState))
    tasksState && tasksState?.length > 0 && tasksState?.forEach((task: ITask) => {
      kanban[task?.state]?.items?.push(task)
    })
    return kanban
  }

  const handleGetTasksRemote = () => {
    // eslint-disable-next-line no-void
    void getTasksRemote(projectId)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleSetMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleCreateMessage = async () => {
    await createMesaage({ project: Number(projectId), text: message, user: Number(currentUser?.id) })
  }

  const handlePushMessage = () => {
    // eslint-disable-next-line no-void
    void handleCreateMessage().then(() => {
      // eslint-disable-next-line no-void
      void getChatMessageRemote(projectId)
      setMessage('')
    })
  }
  const kanban = useMemo(() => {
    const kanban = kanbanColumns()
    return kanban
  }, [kanbanColumnsState, tasksState])

  return (
    <>
      <WrapperPage>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          alignItems={'start'}
          gap={'30px'}
        >
          <Box
            width={'1045px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography fontSize={30} >
              Страниця проекту
            </Typography>
            {isProjectManager && <Button
              onClick={handleOpenModal}
              sx={{
                width: '100px',
                height: '40px',
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
              >+ Додати</Typography>
            </Button>}
          </Box>

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

            {!isLoading && <KanbanBoard kanbanColumns={kanban} />}
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
                placeholder='Введіть повідомлення'
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
              Дохід: {projectFinance?.income}
            </Typography>
            <Typography fontSize={18} >
              Профіт: {projectFinance?.profit}
            </Typography>
            <Typography fontSize={18} >
              Начало: {projectFinance?.start_date}
            </Typography>
            <Typography fontSize={18} >
              Кінець: {projectFinance?.end_date}
            </Typography>
          </Box>}
        </Box>
      </WrapperPage>
      {openModal && <AddTasksModal openModal={openModal}
        handleClose={handleCloseModal} getTasksRemoteState={handleGetTasksRemote} />}
    </>
  )
}

export default TaskPage
