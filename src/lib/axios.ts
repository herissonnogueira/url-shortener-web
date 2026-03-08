import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization']
}
