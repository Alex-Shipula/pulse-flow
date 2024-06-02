import React, { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import WrapperPage from 'src/components/WrapperPage'
import { useNavigate } from 'react-router-dom'
import { CompanyItem } from 'src/components/items/CompanyItem'
import CustomizedModal from 'src/components/CustomizedModal'
import CustomizedInput from 'src/components/CustomizedInput'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentCompany } from 'src/store/company'
import { selectProjectState, setProjectState, useCreateProjectMutation, useSearchProjectQuery } from 'src/store/project'
import { formatDate } from 'src/components/utils/formatDate'
import CustomizedDatePickers from 'src/components/CustomizedDatePickers'

const ProjectPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentCompany = useSelector(selectCurrentCompany)
  const projects = useSearchProjectQuery({ company: currentCompany?.id })?.data
  const [createProject] = useCreateProjectMutation()
  const projectsState = useSelector(selectProjectState)

  const [openModal, setOpenModal] = React.useState(false)
  const [nameProject, setNameProject] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [endDate, setEndDate] = React.useState<Date | null>(null)
  const [income, setIncome] = React.useState<number>()

  useEffect(() => {
    projects && dispatch(setProjectState(projects))
  }, [projects, currentCompany])

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleChangeProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameProject(e.target.value)
  }

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  const handleCreateProject = async () => {
    currentCompany && await createProject({
      name: nameProject,
      description,
      company: currentCompany.id,
      start_date: startDate,
      end_date: endDate ?? undefined,
      income
    })
      .then(() => {
        handleCloseModal()
      })
  }

  const handleClick = (id: number) => {
    navigate(`/task/${id}`)
  }

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date)
  }

  const handleChangeEndDate = (date: Date) => {
    setEndDate(date)
  }

  const handleChangeIncome = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(Number(e.target.value))
  }

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
          <Typography fontSize={30} >
            Проекти
          </Typography>
          {currentCompany
            ? <>
              <Typography fontSize={20} >
                Створюй свої проекти та долучайся до вже існуючих
              </Typography>
              <Typography fontSize={20} >
                Доступні проекти:
              </Typography>
            </>
            : <Typography fontSize={20} >
              Оберіть проект
            </Typography>}
          {currentCompany && <Box
            width={'300px'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'start'}
            alignItems={'start'}
            gap={'15px'}
          >
            {projectsState?.length > 0 && projectsState.map((project) => {
              const date = formatDate(project?.start_date).format2
              return (<Box
                key={project?.id}
                display={'flex'}
                alignItems={'center'}
                gap={'15px'}
                onClick={() => handleClick(project.id)}
              >
                <CompanyItem
                  title={project?.name}
                  subTitle={project?.description}
                  info={date} />
              </Box>)
            })}
            <Button variant='contained' color='primary' sx={{
              width: '100%',
              marginTop: '20px'
            }}
            onClick={handleOpenModal}
            >
              Створити новий проект
            </Button>
          </Box>}
        </Box>
      </WrapperPage>
      {openModal && <CustomizedModal
        title={'Створення нового проекту'}
        handleClose={handleCloseModal}
        action={handleCreateProject}
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
            value={nameProject}
            onChange={handleChangeProject}
            type='text'
            placeholder='Назва проекту' />

          <CustomizedInput
            value={description}
            onChange={handleChangeDescription}
            type='text'
            placeholder='Опис проэкту' />

          <CustomizedInput
            value={income}
            onChange={handleChangeIncome}
            type='number'
            placeholder='Дохід' />

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

export default ProjectPage
