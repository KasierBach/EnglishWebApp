'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, Check, X, Play } from 'lucide-react'
import { Topic, Vocabulary } from '../types'
import { useTranslation } from '../utils/translations'
import StudyModeSelector from './StudyModeSelector'
import MatchingGame from './MatchingGame'
import WritingPractice from './WritingPractice'

interface VocabularySectionProps {
  topic: Topic
  onBack: () => void
  onStartQuiz: () => void
}

export default function VocabularySection({ topic, onBack, onStartQuiz }: VocabularySectionProps) {
  const t = useTranslation()
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [studyMode, setStudyMode] = useState('flashcards')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadVocabularies()
  }, [topic.id])

  const loadVocabularies = async () => {
    try {
      const response = await fetch(`${backendUrl}/topics/${topic.id}/vocabularies`)
      const data = await response.json()
      setVocabularies(data)
    } catch (error) {
      console.error('Failed to load vocabularies:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentVocab = vocabularies[currentIndex]

  const handleNext = (understood: boolean) => {
    // Here you could track progress
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleModeComplete = () => {
    // Reset to flashcards mode or show completion message
    setStudyMode('flashcards')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (vocabularies.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t.noVocabularyFound}</h2>
        <button onClick={onBack} className="btn-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToTopics}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToTopics}
        </button>
        <h2 className="text-3xl font-bold text-gray-800">{t.learning}: {topic.name}</h2>
        <div className="text-sm text-gray-600">
          {vocabularies.length} từ vựng
        </div>
      </div>

      {/* Study Mode Selector */}
      <StudyModeSelector 
        onModeSelect={setStudyMode} 
        selectedMode={studyMode}
      />

      {/* Study Content */}
      {studyMode === 'flashcards' && (
        <div>
          <div className="text-center mb-4 text-sm text-gray-600">
            {currentIndex + 1} / {vocabularies.length}
          </div>

          {/* Flashcard */}
          <div className="mb-8">
            <div
              onClick={handleFlip}
              className="flashcard flex items-center justify-center p-8 cursor-pointer"
            >
              {!isFlipped ? (
                <div className="text-center">
                  <h1 className="text-5xl font-bold mb-6">{currentVocab.word}</h1>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                    <RotateCcw className="h-5 w-5 mr-2 inline" />
                    {t.showMeaning}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-4">{currentVocab.meaning}</h2>
                  <p className="text-xl mb-4 opacity-90">{currentVocab.pronunciation}</p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <p className="text-lg italic">"{currentVocab.example}"</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNext(true)
                      }}
                      className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <Check className="h-5 w-5 mr-2 inline" />
                      {t.gotIt}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNext(false)
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <X className="h-5 w-5 mr-2 inline" />
                      {t.needPractice}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / vocabularies.length) * 100}%` }}
            ></div>
          </div>

          {/* Completion Message */}
          {currentIndex === vocabularies.length - 1 && isFlipped && (
            <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">{t.congratulations}</h3>
              <p>{t.completedTopic}</p>
            </div>
          )}
        </div>
      )}

      {studyMode === 'matching' && (
        <MatchingGame 
          vocabularies={vocabularies} 
          onComplete={handleModeComplete}
        />
      )}

      {studyMode === 'writing' && (
        <WritingPractice 
          vocabularies={vocabularies} 
          onComplete={handleModeComplete}
        />
      )}

      {studyMode === 'listening' && (
        <div className="text-center p-12 bg-gray-100 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">🎧 Chế độ nghe</h3>
          <p className="text-gray-600 mb-4">Tính năng này sẽ sớm được cập nhật!</p>
          <p className="text-sm text-gray-500">Bạn sẽ có thể nghe phát âm và luyện tập nghe hiểu.</p>
        </div>
      )}

      {studyMode === 'speaking' && (
        <div className="text-center p-12 bg-gray-100 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">🎤 Chế độ nói</h3>
          <p className="text-gray-600 mb-4">Tính năng này sẽ sớm được cập nhật!</p>
          <p className="text-sm text-gray-500">Bạn sẽ có thể luyện tập phát âm với AI.</p>
        </div>
      )}

      {/* Quiz Button */}
      <div className="text-center mt-8">
        <button onClick={onStartQuiz} className="btn-primary text-lg px-8 py-4">
          <Play className="h-5 w-5 mr-2" />
          {t.takeQuiz}
        </button>
      </div>
    </div>
  )
}
