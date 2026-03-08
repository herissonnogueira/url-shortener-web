import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { clearAuthToken } from '../lib/axios'
import { getUrls, shortenUrl, deleteUrl } from '../services/urls'

const shortenSchema = z.object({
  url: z.string().url('Insira uma URL válida'),
})

type ShortenFormData = z.infer<typeof shortenSchema>

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  function handleLogout() {
    clearAuthToken()
    queryClient.clear()
    navigate('/')
  }

  const { data: urls, isLoading, isError } = useQuery({
    queryKey: ['urls'],
    queryFn: getUrls,
  })

  const shortenMutation = useMutation({
    mutationFn: (data: ShortenFormData) => shortenUrl(data.url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] })
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] })
    },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShortenFormData>({
    resolver: zodResolver(shortenSchema),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Erro ao carregar URLs. Verifique seu token.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Minhas URLs</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>

      <form onSubmit={handleSubmit((data) => shortenMutation.mutate(data))} className="flex gap-2 mb-8">
        <div className="flex flex-col gap-1 flex-1">
          <input
            {...register('url')}
            placeholder="https://exemplo.com/url-longa"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          {errors.url && (
            <span className="text-red-500 text-xs">{errors.url.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={shortenMutation.isPending}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {shortenMutation.isPending ? 'Encurtando...' : 'Encurtar'}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {urls?.map((url) => (
          <div key={url.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 truncate">{url.originalUrl}</p>
              <p className="text-blue-600 font-medium">
                http://localhost:3000/{url.shortCode}
              </p>
              <p className="text-xs text-gray-400 mt-1">{url.clicks} cliques</p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(url.id)}
              disabled={deleteMutation.isPending}
              className="text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
            >
              Deletar
            </button>
          </div>
        ))}

        {urls?.length === 0 && (
          <p className="text-gray-500">Nenhuma URL cadastrada ainda.</p>
        )}
      </div>
    </div>
  )
}
