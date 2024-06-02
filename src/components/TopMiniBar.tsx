import React, { useEffect } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { ReactComponent as Logo } from '../assets/logo-pulse-flow.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import Time from './Time'
import LeftBarItem from './items/LeftBarItem'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentCompany } from 'src/store/company'
import CustomizedModal from './CustomizedModal'
import CustomizedInput from './CustomizedInput'
import { setTaskState, useCreateTaskMutation } from 'src/store/task'
import CustomizedDatePickers from './CustomizedDatePickers'
import { useProjectIsPmQuery } from 'src/store/project'
import { useEmployeeInvateMutation } from 'src/store/employee'
import axios from 'axios'
import { serverURL } from 'src/config'

const items = ['ЗАВДАННЯ', 'МОЯ КОМАНДА']

const TopMiniBar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [createTask] = useCreateTaskMutation()
  const [inviteEmployee] = useEmployeeInvateMutation()
  const projectId = location.pathname.split('/')[2]
  const currentCompany = useSelector(selectCurrentCompany)
  const { data: isProjectManager } = useProjectIsPmQuery(projectId)

  const [openModal, setOpenModal] = React.useState(false)
  const [nameTask, setNameTask] = React.useState('')
  const [descriptionTask, setDescriptionTask] = React.useState('')
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [endDate, setEndDate] = React.useState<Date | null>(null)
  const [searchEmail, setSearchEmail] = React.useState<string>('')
  const [modalMode, setModalMode] = React.useState<string>('begin')

  const getTasksRemote = async (projectId: string) => {
    const token = localStorage.getItem('token') ?? ''
    await axios.get(`${serverURL}/api/task/search?project=${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res?.data) {
        dispatch(setTaskState(res.data))
      }
    }).catch(() => {
      console.log('error')
    })
  }

  useEffect(() => {
    if (projectId) {
      // eslint-disable-next-line no-void
      void getTasksRemote(projectId)
    }
  }, [projectId])

  const routerList = [
    `/task/${projectId}`,
    `/team/${projectId}`
  ]

  const handleRefresh = () => {
    navigate(location.pathname)
  }

  const handleNavigate = () => {
    navigate('/')
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalMode('begin')
    setDescriptionTask('')
    setNameTask('')
    setStartDate(new Date())
    setEndDate(null)
  }

  const handleChangeNameTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameTask(e.target.value)
  }

  const handleChangeDescriptionTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionTask(e.target.value)
  }

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date)
  }

  const handleChangeEndDate = (date: Date) => {
    setEndDate(date)
  }

  const handleChangeEmployeeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value)
  }

  const handleAddTaskMode = () => {
    setModalMode('task')
  }

  const handleAddEmployeeMode = () => {
    setModalMode('employee')
  }

  const handleCreateTask = async () => {
    const data: any = {
      state: 'todo',
      priority: 5,
      name: nameTask,
      description: descriptionTask,
      planned_start_date: startDate,
      planned_end_date: endDate,
      project: projectId
    }
    await createTask(data).then(() => {
      handleCloseModal()
      handleRefresh()
      // eslint-disable-next-line no-void
      void getTasksRemote(projectId)
    })
    setModalMode('begin')
  }

  const handleAddEmployee = async () => {
    await inviteEmployee({ email: searchEmail, company_id: Number(currentCompany?.id) }).then(() => {
      handleCloseModal()
    })
    setModalMode('begin')
  }

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: '100px',
          backgroundColor: theme.palette.primary.light,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 80px',
          boxShadow: '2px 18px 25px rgba(4, 2, 0.6, 0.1)'
        }}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={'65px'}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            onClick={handleNavigate}
            sx={{
              cursor: 'pointer'
            }}
          >
            <Logo width={'70px'} height={'70px'} />
          </Box>
          <Box
            sx={{
              fontSize: '24px',
              fontStyle: 'normal',
              fontWeight: 'bold',
              lineHeight: '30px',
              color: theme.palette.primary.dark
            }}
          >{currentCompany?.name}</Box>
          <Box
            sx={{
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: 'bold',
              lineHeight: '30px',
              color: theme.palette.primary.dark
            }}
          >{currentCompany?.unique_identifier}</Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '65px',
              marginTop: '7px'
            }}
          >
            {items.map((item, index) => {
              return <LeftBarItem
                key={index}
                item={item}
                router={routerList[index]}
                isSelect={location.pathname.includes(routerList[index])} />
            })}
          </Box>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={'45px'}
        >
          <Button
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
          </Button>
          <Time />
        </Box>
      </Box>
      {openModal && <CustomizedModal
        title={'Створення нової задачі'}
        handleClose={handleCloseModal}
        action={modalMode === 'task' ? handleCreateTask
          : modalMode === 'employee' ? handleAddEmployee : () => { return null }}
        open={openModal}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'15px'}
        >
          {modalMode === 'task' &&
            <>
              <CustomizedInput
                value={nameTask}
                onChange={handleChangeNameTask}
                type='text'
                placeholder='Назва задачі' />

              <CustomizedInput
                value={descriptionTask}
                onChange={handleChangeDescriptionTask}
                type='text'
                placeholder='Опис задачі' />

              <Box
                display={'flex'}
                alignItems={'center'}
                gap={'8px'}
              >
                <CustomizedDatePickers placeholder='Початкова дата' value={startDate} onChange={handleChangeStartDate} />
                <CustomizedDatePickers placeholder='Фінальна дата' value={endDate} onChange={handleChangeEndDate} />
              </Box>
            </>}
          {modalMode === 'employee' && isProjectManager &&
            <CustomizedInput
              value={searchEmail}
              onChange={handleChangeEmployeeEmail}
              type='text'
              placeholder='Імейл користувача' />}

          {modalMode === 'begin' &&
            <>
              <Button variant='contained' color='primary' sx={{
                width: '100%',
                marginTop: '20px'
              }}
              onClick={handleAddTaskMode}
              >
                Додати задачу
              </Button>
              {isProjectManager && <Button variant='contained' color='primary' sx={{
                width: '100%',
                marginTop: '20px'
              }}
              onClick={handleAddEmployeeMode}
              >
                Додати юзера по імейлу
              </Button>}
            </>}
        </Box>
      </CustomizedModal>}
    </>
  )
}

export default TopMiniBar
