/* eslint-disable no-void */
import React, { useState } from 'react'
import styled from '@emotion/styled'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import { Box } from '@mui/material'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IKanbanColumns, ITask,
  useAssignedTaskMutation, useEditAssignedMutation,
  useUpdateTaskMutation
} from 'src/store/task'
import CustomizedInput from '../CustomizedInput'
import CustomizedModal from '../CustomizedModal'
import { useSelector } from 'react-redux'
import { selectCurrentUserState } from 'src/store/users'
import { serverURL } from 'src/config'
import axios from 'axios'

const Container = styled.div`
  display: flex;
`

const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  max-width: 230px;
  min-width: 200px;
  border-radius: 5px;
  padding: 10px 10px 10px 0;
  margin-right: 5px;
`

const TaskColumnStyles = styled.div`
  margin: 8px;
  display: flex;
  width: 100%;
  min-height: 80vh;
`

const Title = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  padding: 2px 10px;
  border-radius: 5px;
  align-self: center;
`

type ISetColumns = (columns: IKanbanColumns) => void
interface IColumn {
  title: string
  items: Array<{
    id: string
    task: string
    date: string
  }>
}

const KanbanBoard = ({ kanbanColumns }: { kanbanColumns: IKanbanColumns }) => {
  const currentUser = useSelector(selectCurrentUserState)
  const [updateTask] = useUpdateTaskMutation()
  const [updateAssigned] = useEditAssignedMutation()
  const [assignedTask] = useAssignedTaskMutation()
  const [columns, setColumns] = useState(kanbanColumns)
  const [openModal, setOpenModal] = useState(false)
  const [taskAssign, setTaskAssign] = useState(null as ITask | null)
  const [isAssigned, setIsAssigned] = useState(false)
  const [salary, setSalary] = useState('fixed')
  const [sum, setSum] = useState('')
  const [quantity, setQuantity] = useState('')

  const getAssignedCanChange = async (taskId: number) => {
    const token = localStorage.getItem('token') ?? ''
    await axios.get(`${serverURL}/api/assigned/can_change/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res?.data) {
        setIsAssigned(true)
      }
    }).catch(() => {
      setIsAssigned(false)
    })
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSum('')
    setQuantity('')
  }

  const handleChangeTask = (task: ITask) => {
    setTaskAssign(task)
    void getAssignedCanChange(task?.id)
  }

  const handleUpdateAssignTask = async () => {
    await updateAssigned({
      taskId: taskAssign ? taskAssign?.id : 0,
      rate_type: salary,
      rate: Number(sum),
      hours_spent: Number(quantity)
    }).then(() => {
      handleCloseModal()
    })
  }

  const handleAssignTask = async () => {
    await assignedTask({
      task: taskAssign ? taskAssign?.id : 0,
      rate_type: salary,
      rate: Number(sum),
      employee: Number(currentUser?.id)
    }).then(() => {
      handleCloseModal()
    })
  }

  const handleChangeSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(e.target.value)
  }

  const handleChangeSum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSum(e.target.value)
  }

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value)
  }

  const handleUpdateTask = async (task: ITask, state: string) => {
    const newTask = { ...task, state }
    await updateTask({
      task: newTask,
      taskId: task?.id
    })
  }

  const onDragEnd = (result: DropResult, columns: IKanbanColumns, setColumns: ISetColumns) => {
    if (!result?.destination) return
    const { source, destination } = result
    if (source?.droppableId !== destination?.droppableId) {
      const sourceColumn = columns[source?.droppableId]
      const destColumn = columns[destination?.droppableId]
      const sourceItems = [...sourceColumn?.items]
      const destItems = [...destColumn?.items]
      const [removed] = sourceItems?.splice(source?.index, 1)
      destItems?.splice(destination.index, 0, removed)
      void handleUpdateTask(removed, destination.droppableId)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems?.splice(source.index, 1)
      copiedItems?.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source?.droppableId]: {
          ...column,
          items: copiedItems
        }
      })
    }
  }
  return (
    <>
      <Box
        width={'50wh'}
      >
        <DragDropContext
          onDragEnd={(result: DropResult) => onDragEnd(result, columns, setColumns)}
        >
          <Container>
            <TaskColumnStyles>
              {Object.entries(columns).map(([columnId, column]: any, index) => {
                return (
                  <Droppable key={columnId} droppableId={columnId}>
                    {(provided, snapshot) => (
                      <TaskList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <Title>{column.title}</Title>
                        {column?.items?.map((item: any, index: number) => (
                          <Box
                            key={item?.id}
                            onClick={() => {
                              handleOpenModal()
                              handleChangeTask(item)
                            }}
                          >
                            <TaskCard item={item} index={index} />
                          </Box>
                        ))}
                        {provided.placeholder}
                      </TaskList>
                    )}
                  </Droppable>
                )
              })}
            </TaskColumnStyles>
          </Container>
        </DragDropContext>
      </Box>
      {openModal && <CustomizedModal
        title={'Назначення задачі'}
        handleClose={handleCloseModal}
        action={!isAssigned ? handleAssignTask : handleUpdateAssignTask}
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
            value={salary}
            onChange={handleChangeSalary}
            type='text'
            placeholder='Вид оплати' />

          <CustomizedInput
            value={sum}
            onChange={handleChangeSum}
            type='number'
            placeholder='Cума' />

          {isAssigned && <CustomizedInput
            value={quantity}
            onChange={handleChangeQuantity}
            type='number'
            placeholder='Кількість годин' />}

        </Box>
      </CustomizedModal>}
    </>
  )
}

export default KanbanBoard
