import { api } from '../lib/axios'

export interface Url {
  id: number
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: string
}

export async function validateToken(): Promise<boolean> {
  try {
    await api.get('/urls')
    return true
  } catch {
    return false
  }
}

export async function getUrls(): Promise<Url[]> {
  const response = await api.get('/urls')
  return response.data
}

export async function shortenUrl(url: string): Promise<{ originalUrl: string; shortUrl: string }> {
  const response = await api.post('/shorten', { url })
  return response.data
}
