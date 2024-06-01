import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { ReactComponent as Logo } from '../assets/logo-pulse-flow.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import Time from './Time'
import LeftBarItem from './items/LeftBarItem'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentCompany } from 'src/store/company'
import CustomizedModal from './CustomizedModal'
import CustomizedInput from './CustomizedInput'
import { selectTaskState, setTaskState, useCreateTaskMutation } from 'src/store/task'
import { useCreateEmployeeMutation } from 'src/store/employee'
import { selectCurrentUserState } from 'src/store/users'
import CustomizedDatePickers from './CustomizedDatePickers'

const items = ['ЗАВДАННЯ', 'МОЯ КОМАНДА']

const TopMiniBar = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [createTask] = useCreateTaskMutation()
  const [createEmployee] = useCreateEmployeeMutation()
  const projectId = location.pathname.split('/')[2]
  const currentCompany = useSelector(selectCurrentCompany)
  const currentUser = useSelector(selectCurrentUserState)
  const tasksState = useSelector(selectTaskState)

  const [openModal, setOpenModal] = React.useState(false)
  const [nameTask, setNameTask] = React.useState('')
  const [descriptionTask, setDescriptionTask] = React.useState('')
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [endDate, setEndDate] = React.useState<Date>(new Date())

  const routerList = [
    `/task/${projectId}`,
    `/team/${projectId}`
  ]

  const handleNavigate = () => {
    navigate('/')
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
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
    await createTask(data).then((res: any) => {
      dispatch(setTaskState([...tasksState, res?.data]))
      handleCloseModal()
    })
  }

  const handleAddEmployee = async () => {
    const data: any = {
      user: currentUser?.id,
      company: currentCompany?.id,
      is_project_manager: false,
      disabled: false
    }
    await createEmployee(data).then(() => {
      handleCloseModal()
    })
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
        action={handleCreateTask}
        open={openModal}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'15px'}
        >
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

        </Box>
      </CustomizedModal>}
    </>
  )
}

export default TopMiniBar
