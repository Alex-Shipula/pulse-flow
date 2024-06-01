import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { serverURL } from 'src/config'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RootState } from '.'

export type IState = 'todo' | 'research' | 'in_progress' | 'testing' | 'done'
export type IRateType = 'fixed' | 'hour'

export enum EState {
  TODO = 'todo',
  RESEARCH = 'research',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  DONE = 'done'
}

export enum ERateType {
  FIXED = 'fixed',
  HOUR = 'hour'
}

interface RequestTask {
  state: string
  priority: number
  actual_start_date: string
  actual_end_date: string
  name: string
  description: string
  planned_start_date: string
  planned_end_date: string
  project: number
}

export interface ITask {
  id: number
  project: {
    id: number
    company: {
      id: number
      name: string
      unique_identifier: string
      website: string
      logo: string
    }
    name: string
    description: string
    start_date: string
    end_date: string
    income: number
  }
  name: string
  state: string
  priority: number
  description: string
  planned_start_date: string
  planned_end_date: string
  actual_start_date: string
  actual_end_date: string
}

interface PutTask {
  state?: string
  priority?: number
  actual_start_date?: string
  actual_end_date?: string
  name?: string
  description?: string
  planned_start_date?: string
  planned_end_date?: string
}

interface SearchTaskRequest {
  actual_end_date?: string
  actual_start_date?: string
  name?: string
  id?: number
  order_by?: '-id' | 'id' | '-name' | 'name' |'-state' | 'state' |'-priority' |
  'priority' |'-actual_start_date' | 'actual_start_date' |'-actual_end_date' |
  'actual_end_date' |'-planned_start_date' | 'planned_start_date' |'-planned_end_date' | 'planned_end_date'
}

export const TaskApi = createApi({
  reducerPath: 'TaskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${serverURL}/api/task`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    createTask: builder.mutation<RequestTask, ITask>({
      query: (task) => ({
        url: '',
        method: 'POST',
        body: task
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }]
    }),
    searchTask: builder.query<ITask[], SearchTaskRequest>({
      query: (params) => ({
        url: '/search',
        method: 'POST',
        ...params
      }),
      providesTags: [{ type: 'Task', id: 'LIST' }]
    }),
    getTask: builder.query<ITask, string>({
      query: (taskId) => ({
        url: `/${taskId}`,
        method: 'GET'
      })
    }),
    updateTask: builder.mutation<ITask, { task: PutTask, taskId: string }>({
      query: ({ task, taskId }) => ({
        url: `/${taskId}`,
        method: 'PUT',
        body: task
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }]
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    deleteTask: builder.mutation<void, string>({
      query: (taskId: string) => ({
        url: `/${taskId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }]
    })
  })
})

export const {
  useCreateTaskMutation,
  useSearchTaskQuery,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = TaskApi

export interface IKanbanColumns {
  [key: string]: {
    title: string
    items: ITask[]
  }
}

interface TaskState {
  tasks: ITask[]
  kanbanColumns: IKanbanColumns
}

const initialState: TaskState = {
  tasks: [],
  kanbanColumns: {
    [EState.TODO]: {
      title: 'To Do',
      items: []
    },
    [EState.RESEARCH]: {
      title: 'Research',
      items: []
    },
    [EState.IN_PROGRESS]: {
      title: 'In Progress',
      items: []
    },
    [EState.TESTING]: {
      title: 'Testing',
      items: []
    },
    [EState.DONE]: {
      title: 'Done',
      items: []
    }
  }
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTaskState: (state, action: PayloadAction<ITask[]>) => {
      state.tasks = action.payload
    },
    setKanbanColumns: (state, action: PayloadAction<IKanbanColumns>) => {
      state.kanbanColumns = action.payload
    }
  }
})

export const { setTaskState, setKanbanColumns } = taskSlice.actions

export const selectTaskState = (state: RootState) => state?.task.tasks
export const selectKanbanColumns = (state: RootState) => state?.task.kanbanColumns

export default taskSlice.reducer
