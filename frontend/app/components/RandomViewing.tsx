'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, RefreshCw, Play } from 'lucide-react'
import { Topic, RandomContent } from '../types'
import { useTranslation } from '../utils/translations'
import RandomVocabViewer from './RandomVocabViewer'
import RandomQuizPlayer from './RandomQuizPlayer'
import RandomMatchingGame from './RandomMatchingGame'
import RandomFillBlank from './RandomFillBlank'
import RandomScramble from './RandomScramble'

interface RandomViewingProps {
  topics: Topic[]
  onBack: () => void
}

type GameMode = 'vocabulary' | 'quiz' | 'matching' | 'fill-blank' | 'scramble'

export default function RandomViewing({ topics, onBack }: RandomViewingProps) {
  const t = useTranslation()
  const [gameMode, setGameMode] = useState<GameMode>('vocabulary')
  const [selectedTopic, setSelectedTopic] = useState<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentContent, setCurrentContent] = useState<RandomContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api'

  const gameModes = [
    { value: 'vocabulary', label: t.randomVocabulary, icon: '📚' },
    { value: 'quiz', label: t.randomQuiz, icon: '❓' },
    { value: 'matching', label: t.randomMatching, icon: '🔗' },
    { value: 'fill-blank', label: t.randomFillBlank, icon: '✏️' },
    { value: 'scramble', label: t.randomScramble, icon: '🔄' }
  ]

  const loadRandomContent = async () => {
    setIsLoading(true)
    try {
      let endpoint = ''
      let params = new URLSearchParams()
      
      if (selectedTopic) {
        params.append('topic_id', selectedTopic.toString())
      }

      switch (gameMode) {
        case 'vocabulary':
          endpoint = '/random/vocabularies'
          params.append('limit', '1')
          break
        case 'quiz':
          endpoint = '/random/quiz'
          break
        case 'matching':
          endpoint = '/random/matching'
          params.append('pairs', '6')
          break
        case 'fill-blank':
          endpoint = '/random/fill-blank'
          params.append('questions', '1')
          break
        case 'scramble':
          endpoint = '/random/scramble'
          params.append('words', '1')
          break
      }

      const response = await fetch(`${backendUrl}${endpoint}?${params}`)
      const data = await response.json()
      
      setCurrentContent({
        type: gameMode,
        content: Array.isArray(data) ? data[0] : data,
        topic_id: selectedTopic
      })
    } catch (error) {
      console.error('Failed to load random content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartGame = () => {
    setIsPlaying(true)
    loadRandomContent()
  }

  const handleNextContent = () => {
    loadRandomContent()
  }

  const handleBackToSetup = () => {
    setIsPlaying(false)
    setCurrentContent(null)
  }

  if (isPlaying && currentContent) {
    const renderGame = () => {
      switch (currentContent.type) {
        case 'vocabulary':
          return (
            <RandomVocabViewer
              vocabulary={currentContent.content}
              onNext={handleNextContent}
              isLoading={isLoading}
            />
          )
        case 'quiz':
          return (
            <RandomQuizPlayer
              quiz={currentContent.content}
              onNext={handleNextContent}
              isLoading={isLoading}
            />
          )
        case 'matching':
          return (
            <RandomMatchingGame
              game={currentContent.content}
              onNext={handleNextContent}
              isLoading={isLoading}
            />
          )
        case 'fill-blank':
          return (
            <RandomFillBlank
              question={currentContent.content}
              onNext={handleNextContent}
              isLoading={isLoading}
            />
          )
        case 'scramble':
          return (
            <RandomScramble
              word={currentContent.content}
              onNext={handleNextContent}
              isLoading={isLoading}
            />
          )
        default:
          return null
      }
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBackToSetup}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>{t.changeMode}</span>
          </button>
          <button
            onClick={handleNextContent}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t.nextRandom}</span>
          </button>
        </div>
        {renderGame()}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>{t.backToTopics}</span>
        </button>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">{t.randomPractice}</h2>
        
        <div className="space-y-6">
          {/* Game Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.selectGameMode}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setGameMode(mode.value as GameMode)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameMode === mode.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mode.icon}</div>
                  <div className="text-sm font-medium">{mode.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.chooseTopic}
            </label>
            <select
              value={selectedTopic || ''}
              onChange={(e) => setSelectedTopic(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t.noTopic}</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>{t.startRandom}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
</create_file>
