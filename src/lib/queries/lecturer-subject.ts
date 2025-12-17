import { useQuery, queryOptions } from '@tanstack/react-query'
import api from '../api/client'
import { LECTURER_SUBJECT_ENDPOINTS } from '../api/endpoints'
import type { LecturerListResponse, SubjectListResponse } from '../schemas/lecturer-subject.schema'

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

