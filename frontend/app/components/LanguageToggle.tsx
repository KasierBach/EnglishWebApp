'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

export default function LanguageToggle() {
  const [language, setLanguage] = useState('vi')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'vi'
    setLanguage(savedLang)
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'vi' ? 'en' : 'vi'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
    window.location.reload() // Reload để áp dụng ngôn ngữ mới
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === 'vi' ? 'Tiếng Việt' : 'English'}
      </span>
    </button>
  )
}