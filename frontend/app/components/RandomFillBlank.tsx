'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { FillBlankQuestion } from '../types'
import { useTranslation } from '../utils/translations'

interface RandomFillBlankProps {
  question: FillBlankQuestion
  onNext: () => void
  isLoading: boolean
}

export default function RandomFillBlank({ question, onNext, isLoading }: RandomFillBlankProps) {
  const t = useTranslation()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-center mb-6">{t.randomFillBlank}</h3>
        
        <div className="space-y-6">
          <div className="mb-6">
            <div className="text-xl font-semibold mb-4">
              {question.sentence}
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={t.yourAnswer}
              />
            </div>
            
            {showResult && (
              <div className="text-center">
                <div className="text-xl font-semibold mb-4">
                  {selectedAnswer === question.correct_word ? (
                    <span className="text-green-600">{t.correct}</span>
                  ) : (
                    <span className="text-red-600">{t.incorrect}</span>
                  )}
                </div>
                <div className="text-gray-600">
                  {t.correctAnswer}: {question.correct_word}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {t.nextRandom}
          </button>
        </div>
      </div>
    </div>
  )
}
