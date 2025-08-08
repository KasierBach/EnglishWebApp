'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { MatchingGame } from '../types'
import { useTranslation } from '../utils/translations'

interface RandomMatchingGameProps {
  game: MatchingGame
  onNext: () => void
  isLoading: boolean
}

export default function RandomMatchingGame({ game, onNext, isLoading }: RandomMatchingGameProps) {
  const t = useTranslation()

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-center mb-6">{t.randomMatching}</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {game.words.map((word, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-semibold">{word}</div>
                <div className="text-sm text-gray-600">{game.meanings[index]}</div>
              </div>
            ))}
          </div>
          
          <button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t.nextRandom}
          </button>
        </div>
      </div>
    </div>
  )
}
