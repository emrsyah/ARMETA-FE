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

export const ULASAN_ENDPOINTS = {
  CREATE: '/api/ulasan/createUlasan',
  EDIT: '/api/ulasan/editUlasan',
  GET_ALL: '/api/ulasan/getUlasan',
  GET_BY_ID: '/api/ulasan/getUlasan', // With id_review param
  SEARCH: '/api/ulasan/search',
  LIKE: '/api/ulasan/likeUlasan',
  GET_LIKED: '/api/ulasan/likeUlasan',
  BOOKMARK: '/api/ulasan/bookmarkUlasan',
  GET_BOOKMARKED: '/api/ulasan/bookmarkUlasan',
} as const

export const FORUM_ENDPOINTS = {
  CREATE: '/api/forum/createForum',
  GET_ALL: '/api/forum/getForums', // Can be used without id_subject for all forums
  GET_BY_SUBJECT: '/api/forum/getForums',
  GET_BY_ID: '/api/forum/getForum', // Single forum with id_forum param
} as const

export const REPORT_ENDPOINTS = {
  CREATE: '/api/reports/createReport',
  GET_USER_REPORTS: '/api/reports/getReports',
} as const

export const CHATBOT_ENDPOINTS = {
  ASK: '/api/chatbot/ask',
  HISTORY: '/api/chatbot/history',
} as const

