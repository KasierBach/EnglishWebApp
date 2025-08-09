'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { QuizQuestion } from '../types'
import { useTranslation } from '../utils/translations'

interface RandomQuizPlayerProps {
  quiz: QuizQuestion
  onBack: () => void
  onNext: () => void
  isLoading: boolean
}

export default function RandomQuizPlayer({ quiz, onBack, onNext, isLoading }: RandomQuizPlayerProps) {
  const t = useTranslation()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    onNext()
  }

  if (!quiz) return null;

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-center mb-6">{t.randomQuiz}</h3>
        <div className="mb-6">
          <div className="text-xl font-semibold mb-4">
            {quiz.question}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Object.entries(quiz.options).map(([key, option]) => (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === key
                    ? selectedAnswer === quiz.correct_answer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="text-lg font-medium">
                  {key}: {option}
                </div>
              </button>
            ))}
          </div>
          {showResult && (
            <div className="text-center">
              {selectedAnswer === quiz.correct_answer ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-semibold">{t.correct}</p>
                </div>
              ) : (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-semibold">{t.incorrect}</p>
                  <p className="text-sm text-gray-600">
                    {t.correctAnswer}: {quiz.correct_answer}
                  </p>
                </div>
              )}
              <button
                onClick={handleNext}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {t.nextRandom}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
