import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { setAuthToken, clearAuthToken } from '../lib/axios'
import { validateToken } from '../services/urls'

const loginSchema = z.object({
  token: z.string().min(1, 'O token é obrigatório'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    setTokenError(null)
    setAuthToken(data.token)

    const valid = await validateToken()

    if (!valid) {
      clearAuthToken()
      setTokenError('Token inválido. Tente novamente.')
      setIsLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">URL Shortener</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">API Token</label>
            <input
              {...register('token')}
              type="password"
              placeholder="Insira seu token"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.token && (
              <span className="text-red-500 text-xs">{errors.token.message}</span>
            )}
            {tokenError && (
              <span className="text-red-500 text-xs">{tokenError}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
