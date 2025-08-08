'use client'

import { useState } from 'react'
import { BookOpen, Shuffle, PenTool, Headphones, Mic } from 'lucide-react'
import { useTranslation } from '../utils/translations'

interface StudyModeSelectorProps {
  onModeSelect: (mode: string) => void
  selectedMode: string
}

export default function StudyModeSelector({ onModeSelect, selectedMode }: StudyModeSelectorProps) {
  const t = useTranslation()

  const modes = [
    { id: 'flashcards', icon: BookOpen, name: t.flashcards, color: 'bg-blue-500' },
    { id: 'matching', icon: Shuffle, name: t.matching, color: 'bg-green-500' },
    { id: 'writing', icon: PenTool, name: t.writing, color: 'bg-purple-500' },
    { id: 'listening', icon: Headphones, name: t.listening, color: 'bg-orange-500' },
    { id: 'speaking', icon: Mic, name: t.speaking, color: 'bg-red-500' }
  ]

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{t.studyModes}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon
          return (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedMode === mode.id
                  ? `${mode.color} text-white border-transparent`
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{mode.name}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}