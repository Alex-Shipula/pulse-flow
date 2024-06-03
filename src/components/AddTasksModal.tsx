import React from 'react'
import { Box, Button } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentCompany } from 'src/store/company'
import CustomizedModal from './CustomizedModal'
import CustomizedInput from './CustomizedInput'
import { useCreateTaskMutation } from 'src/store/task'
import CustomizedDatePickers from './CustomizedDatePickers'
import { useProjectIsPmQuery } from 'src/store/project'
import { useEmployeeInvateMutation } from 'src/store/employee'

interface IAddTasksModal {
  openModal: boolean
  handleClose: () => void
  getTasksRemoteState: () => void
}

const AddTasksModal = ({ openModal, handleClose, getTasksRemoteState }: IAddTasksModal) => {
  const location = useLocation()
  const [createTask] = useCreateTaskMutation()
  const [inviteEmployee] = useEmployeeInvateMutation()
  const projectId = location.pathname.split('/')[2]
  const currentCompany = useSelector(selectCurrentCompany)
  const { data: isProjectManager } = useProjectIsPmQuery(projectId)

  const [nameTask, setNameTask] = React.useState('')
  const [descriptionTask, setDescriptionTask] = React.useState('')
  const [priority, setPriority] = React.useState(5)
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [endDate, setEndDate] = React.useState<Date | null>(null)
  const [searchEmail, setSearchEmail] = React.useState<string>('')
  const [modalMode, setModalMode] = React.useState<string>('begin')

  const handleCloseModal = () => {
    setModalMode('begin')
    setDescriptionTask('')
    setNameTask('')
    setStartDate(new Date())
    setEndDate(null)
    setPriority(5)
    setSearchEmail('')
    handleClose()
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

  const handleChangePriorityTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(Number(e.target.value))
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
      priority,
      name: nameTask,
      description: descriptionTask,
      planned_start_date: startDate,
      planned_end_date: endDate,
      project: projectId
    }
    await createTask(data).then(() => {
      getTasksRemoteState()
      handleCloseModal()
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

              <CustomizedInput
                value={priority}
                onChange={handleChangePriorityTask}
                type='number'
                placeholder='Пріоритетність' />

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

export default AddTasksModal
