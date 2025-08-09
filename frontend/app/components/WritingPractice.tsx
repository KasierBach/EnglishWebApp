'use client'

import { useState, useEffect } from 'react'
import { Vocabulary } from '../types'
import { useTranslation } from '../utils/translations'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface WritingPracticeProps {
  vocabularies: Vocabulary[]
  onComplete: () => void
}

export default function WritingPractice({ vocabularies, onComplete }: WritingPracticeProps) {
  const t = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const currentVocab = vocabularies[currentIndex]

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === currentVocab.word.toLowerCase().trim()
    setIsCorrect(correct)
    setShowResult(true)
    setAttempts(attempts + 1)
    
    if (correct) {
      setScore(score + 1)
    }
  }

  const nextWord = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      onComplete()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer()
    } else if (e.key === 'Enter' && showResult) {
      nextWord()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">{t.writing}</h3>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span>Câu {currentIndex + 1}/{vocabularies.length}</span>
          <span>Điểm: {score}/{attempts}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / vocabularies.length) * 100}%` }}
        ></div>
      </div>

      <div className="card">
        {/* Question */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-semibold mb-2">Viết từ tiếng Anh cho nghĩa:</h4>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {currentVocab.meaning}
          </div>
          <div className="text-gray-600 italic">
            "{currentVocab.example}"
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Phát âm: {currentVocab.pronunciation}
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập từ tiếng Anh..."
            disabled={showResult}
            className="w-full text-center text-2xl font-bold p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Result */}
        {showResult && (
          <div className={`text-center p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isCorrect ? (
              <div>
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold">Chính xác! 🎉</div>
              </div>
            ) : (
              <div>
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold">Đáp án đúng: {currentVocab.word}</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="text-center">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kiểm tra
            </button>
          ) : (
            <button onClick={nextWord} className="btn-primary">
              {currentIndex === vocabularies.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            </button>
          )}
        </div>
      </div>

      {/* Final Score */}
      {currentIndex === vocabularies.length - 1 && showResult && (
        <div className="mt-8 p-6 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Kết quả cuối cùng</h3>
          <p>Bạn đã viết đúng {score}/{attempts} từ ({Math.round((score/attempts) * 100)}%)</p>
        </div>
      )}
    </div>
  )
}
