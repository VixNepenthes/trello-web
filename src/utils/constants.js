let apiRoot = ''
// import.meta.env
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3333'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-hxxt.onrender.com'
}
export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}
