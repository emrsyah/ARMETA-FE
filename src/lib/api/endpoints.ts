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
  GET_USER_BY_ID: '/api/users', // Base path for /:id_user
} as const

export const LECTURER_SUBJECT_ENDPOINTS = {
  GET_LECTURERS: '/api/lecturer-subjects/getLecturers',
  GET_SUBJECTS: '/api/lecturer-subjects/getSubjects',
  CREATE_LECTURER: '/api/lecturer-subjects/lecturer',
  UPDATE_LECTURER: '/api/lecturer-subjects/lecturer', // + /:id
  DELETE_LECTURER: '/api/lecturer-subjects/lecturer', // + /:id
  CREATE_SUBJECT: '/api/lecturer-subjects/subject',
  UPDATE_SUBJECT: '/api/lecturer-subjects/subject', // + /:id
  DELETE_SUBJECT: '/api/lecturer-subjects/subject', // + /:id
} as const

export const ADMIN_ENDPOINTS = {
  STATS: '/api/admin/stats',
  GET_ALL_USERS: '/api/admin/users',
  TOGGLE_BAN: '/api/admin/users', // + /:id_user/ban
  UPDATE_ROLE: '/api/admin/users', // + /:id_user/role
  DELETE_CONTENT: '/api/admin/content', // + /:type/:id
  GET_REPORTS: '/api/admin/reports',
  RESOLVE_REPORT: '/api/admin/reports', // + /:id_report/resolve
} as const

export const ULASAN_ENDPOINTS = {
  CREATE: '/api/ulasan/createUlasan',
  EDIT: '/api/ulasan/editUlasan',
  GET_ALL: '/api/ulasan/getUlasan',
  GET_BY_ID: '/api/ulasan/getUlasanById',
  FILTER: '/api/ulasan/filterUlasan',
  SORT: '/api/ulasan/sortUlasan',
  LIKE: '/api/ulasan/likeUlasan',
  GET_LIKED: '/api/ulasan/likeUlasan',
  BOOKMARK: '/api/ulasan/bookmarkUlasan',
  GET_BOOKMARKED: '/api/ulasan/bookmarkUlasan',
  DELETE: '/api/ulasan/deleteUlasan',
} as const

export const FORUM_ENDPOINTS = {
  CREATE: '/api/forum/createForum',
  EDIT: '/api/forum/editForum',
  DELETE: '/api/forum/deleteForum',
  GET_ALL: '/api/forum/getAllForum',
  GET_BY_ID: '/api/forum/getForumId',
  GET_BY_SUBJECT: '/api/forum/getForumSubject',
  LIKE: '/api/forum/likeForum',
  GET_LIKED: '/api/forum/likeForum',
  BOOKMARK: '/api/forum/bookmarkForum',
  GET_BOOKMARKED: '/api/forum/bookmarkForum',
} as const

export const REPORT_ENDPOINTS = {
  CREATE: '/api/reports/createReport',
  GET_USER_REPORTS: '/api/reports/getReports',
} as const

export const CHATBOT_ENDPOINTS = {
  ASK: '/api/chatbot/ask',
  HISTORY: '/api/chatbot/history',
} as const
