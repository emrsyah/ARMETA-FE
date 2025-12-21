import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import api from '../api/client'
import { LECTURER_SUBJECT_ENDPOINTS } from '../api/endpoints'
import type {
  LecturerListResponse,
  SubjectListResponse,
  CreateLecturerInput,
  UpdateLecturerInput,
  CreateSubjectInput,
  UpdateSubjectInput
} from '../schemas/lecturer-subject.schema'

// Query Keys Factory
export const lecturerSubjectKeys = {
  all: ['lecturer-subject'] as const,
  lecturers: () => [...lecturerSubjectKeys.all, 'lecturers'] as const,
  subjects: () => [...lecturerSubjectKeys.all, 'subjects'] as const,
}

// Query Options (for use in route loaders)
export const lecturersQueryOptions = () =>
  queryOptions({
    queryKey: lecturerSubjectKeys.lecturers(),
    queryFn: async () => {
      const response = await api.get<LecturerListResponse>(LECTURER_SUBJECT_ENDPOINTS.GET_LECTURERS)
      return response.data.data
    },
    staleTime: 1000 * 60 * 30,
  })

export const subjectsQueryOptions = () =>
  queryOptions({
    queryKey: lecturerSubjectKeys.subjects(),
    queryFn: async () => {
      const response = await api.get<SubjectListResponse>(LECTURER_SUBJECT_ENDPOINTS.GET_SUBJECTS)
      return response.data.data
    },
    staleTime: 1000 * 60 * 30,
  })

// Query: Get all lecturers
export function useLecturers() {
  return useQuery(lecturersQueryOptions())
}

// Query: Get all subjects
export function useSubjects() {
  return useQuery(subjectsQueryOptions())
}

// --- Admin Mutations ---

export function useCreateLecturer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateLecturerInput) => {
      const response = await api.post(LECTURER_SUBJECT_ENDPOINTS.CREATE_LECTURER, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerSubjectKeys.lecturers() })
    }
  })
}

export function useUpdateLecturer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLecturerInput }) => {
      const response = await api.patch(`${LECTURER_SUBJECT_ENDPOINTS.UPDATE_LECTURER}/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerSubjectKeys.lecturers() })
    }
  })
}

export function useDeleteLecturer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`${LECTURER_SUBJECT_ENDPOINTS.DELETE_LECTURER}/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerSubjectKeys.lecturers() })
    }
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateSubjectInput) => {
      const response = await api.post(LECTURER_SUBJECT_ENDPOINTS.CREATE_SUBJECT, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerSubjectKeys.subjects() })
    }
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSubjectInput }) => {
      const response = await api.patch(`${LECTURER_SUBJECT_ENDPOINTS.UPDATE_SUBJECT}/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerSubjectKeys.subjects() })
    }
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`${LECTURER_SUBJECT_ENDPOINTS.DELETE_SUBJECT}/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerSubjectKeys.subjects() })
    }
  })
}

