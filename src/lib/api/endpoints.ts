// API Endpoint Constants

export const AUTH_ENDPOINTS = {
  GOOGLE_LOGIN: '/auth/google/login',
  GOOGLE_CALLBACK: '/auth/google/callback',
} as const

export const USER_ENDPOINTS = {
  REFRESH_TOKEN: '/api/users/refresh-token',
  PROFILE: '/api/users/profile',
  CHANGE_PROFILE: '/api/users/changeProfile',
  LOGOUT: '/api/users/logout',
} as const

export const LECTURER_SUBJECT_ENDPOINTS = {
  GET_LECTURERS: '/api/lecturer-subjects/getLecturers',
  GET_SUBJECTS: '/api/lecturer-subjects/getSubjects',
} as const

export const ULASAN_ENDPOINTS = {
  CREATE: '/api/ulasan/createUlasan',
  EDIT: '/api/ulasan/editUlasan',
  GET_ALL: '/api/ulasan/getUlasan',
  GET_BY_ID: '/api/ulasan/getUlasanById',
  SEARCH_VECTOR: '/api/ulasan/search',
  SEARCH_TEXT: '/api/ulasan/searchUlasan',
  FILTER: '/api/ulasan/filterUlasan',
  SORT: '/api/ulasan/sortUlasan',
  LIKE: '/api/ulasan/likeUlasan',
  GET_LIKED: '/api/ulasan/likeUlasan',
  BOOKMARK: '/api/ulasan/bookmarkUlasan',
  GET_BOOKMARKED: '/api/ulasan/bookmarkUlasan',
} as const

export const FORUM_ENDPOINTS = {
  CREATE: '/api/forum/createForum',
  GET_ALL: '/api/forum/getAllForum',
  GET_BY_ID: '/api/forum/getForumId',
  GET_BY_SUBJECT: '/api/forum/getForumSubject',
  SEARCH: '/api/forum/searchForum',
  FILTER: '/api/forum/filterForum',
} as const

export const REPORT_ENDPOINTS = {
  CREATE: '/api/reports/createReport',
  GET_USER_REPORTS: '/api/reports/getReports',
} as const

export const CHATBOT_ENDPOINTS = {
  ASK: '/api/chatbot/ask',
  HISTORY: '/api/chatbot/history',
} as const
