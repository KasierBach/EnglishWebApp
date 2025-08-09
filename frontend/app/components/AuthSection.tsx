'use client'

import { useState } from 'react'
import { User } from '../types'
import { useTranslation } from '../utils/translations'

interface AuthSectionProps {
  onLogin: (user: User, token: string) => void
}

export default function AuthSection({ onLogin }: AuthSectionProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const t = useTranslation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      // Sử dụng biến môi trường cho URL backend Render
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api'; // Default cho local dev
      const endpoint = isLogin ? `${backendUrl}/login` : `${backendUrl}/register`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        if (isLogin) {
          onLogin(result.user, result.token)
        } else {
          setIsLogin(true)
          setError(t.registrationSuccess)
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {isLogin ? t.login : t.register}
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.username}
            </label>
            <input
              type="text"
              name="username"
              required
              className="input-field"
              placeholder={t.enterUsername}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                required
                className="input-field"
                placeholder={t.enterEmail}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.password}
            </label>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              placeholder={t.enterPassword}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? t.processing : (isLogin ? t.login : t.register)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? t.needAccount : t.haveAccount}
          </button>
        </div>
      </div>
    </div>
  )
}
