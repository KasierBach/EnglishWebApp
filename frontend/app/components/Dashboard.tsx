'use client'

import { useState, useEffect } from 'react'
import { User, Topic, Progress } from '../types'
import TopicCard from './TopicCard'
import VocabularySection from './VocabularySection'
import QuizSection from './QuizSection'
import StatisticsPanel from './StatisticsPanel'
import AchievementBadges from './AchievementBadges'
import RandomViewing from './RandomViewing'
import { BarChart3, BookOpen, Trophy } from 'lucide-react'
import { useTranslation } from '../utils/translations'

interface DashboardProps {
  user: User
}

type DashboardView =
  | 'dashboard'
  | 'vocabulary'
  | 'quiz'
  | 'results'
  | 'statistics'
  | 'achievements'
  | 'random'

export default function Dashboard({ user }: DashboardProps) {
  const t = useTranslation()
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard')
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [progress, setProgress] = useState<Progress>({
    learned_words: 0,
    average_score: 0,
    quizzes_taken: 0
  })
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api'

  // Fetch topics and user progress on mount / when user changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetch(`${backendUrl}/topics`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch topics')
        return res.json()
      }),
      fetch(`${backendUrl}/progress/${user.id}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch progress')
        return res.json()
      })
    ])
      .then(([topicsData, progressData]) => {
        if (cancelled) return
        setTopics(Array.isArray(topicsData) ? topicsData : [])
        setProgress(
          progressData && typeof progressData === 'object'
            ? progressData
            : {
                learned_words: 0,
                average_score: 0,
                quizzes_taken: 0
              }
        )
      })
      .catch(err => {
        if (cancelled) return
        console.error(err)
        setError(String(err.message || err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user.id, backendUrl])

  const startVocabulary = (topic: Topic) => {
    setSelectedTopic(topic)
    setCurrentView('vocabulary')
  }

  const startQuiz = (topic: Topic) => {
    setSelectedTopic(topic)
    setCurrentView('quiz')
  }

  // Start a random practice: pick a random topic (if available)
  const startRandomPractice = () => {
    if (topics.length === 0) return
    const idx = Math.floor(Math.random() * topics.length)
    const topic = topics[idx]
    setSelectedTopic(topic)
    // Random practice uses the 'random' view (RandomViewing component)
    setCurrentView('random')
  }

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
    setCurrentView('results')
    // Optimistically update progress and post to backend
    const newProgress = {
      ...progress,
      quizzes_taken: (progress.quizzes_taken || 0) + 1,
      average_score:
        progress.average_score && progress.quizzes_taken
          ? (progress.average_score * progress.quizzes_taken + score) /
            (progress.quizzes_taken + 1)
          : score
    }
    setProgress(newProgress)
    fetch(`${backendUrl}/progress/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score })
    }).catch(err => console.error('Error updating progress:', err))
  }

  const handleBackToDashboard = () => {
    setSelectedTopic(null)
    setCurrentView('dashboard')
  }

  // Small helpers
  const numberOrZero = (v?: number) => (typeof v === 'number' ? v : 0)

  return (
    <div className="p-6">
      {loading && (
        <div className="mb-4 text-sm text-gray-600">
          {t.loading ?? 'Loading...'}
        </div>
      )}

      {error && (
        <div className="mb-4 text-sm text-red-600">
          {t.error ?? 'Có lỗi xảy ra'}: {error}
        </div>
      )}

      {/* DASHBOARD MAIN */}
      {currentView === 'dashboard' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{t.dashboard}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('statistics')}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white flex items-center gap-2"
              >
                <BarChart3 size={18} /> {t.statistics}
              </button>
              <button
                onClick={() => setCurrentView('achievements')}
                className="px-4 py-2 rounded-lg font-medium bg-yellow-500 text-white flex items-center gap-2"
              >
                <Trophy size={18} /> {t.achievements}
              </button>
              <button
                onClick={startRandomPractice}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'random'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🎲 {t.randomPractice}
              </button>
            </div>
          </div>

          <StatisticsPanel progress={progress} />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">{t.topics}</h2>
            {topics.length === 0 ? (
              <div className="text-sm text-gray-600">{t.noTopics}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(topic => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onVocabulary={() => startVocabulary(topic)}
                    onQuiz={() => startQuiz(topic)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">{t.quickStats}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-indigo-600">
                  {numberOrZero(progress.learned_words)}
                </div>
                <div className="text-sm text-gray-600">{t.learnedWords}</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(numberOrZero(progress.average_score))}
                </div>
                <div className="text-sm text-gray-600">{t.averageScore}</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {numberOrZero(progress.quizzes_taken)}
                </div>
                <div className="text-sm text-gray-600">{t.quizzesTaken}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VOCABULARY VIEW */}
      {currentView === 'vocabulary' && selectedTopic && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{selectedTopic.name}</h2>
            <div>
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                {t.backToDashboard}
              </button>
            </div>
          </div>

          <VocabularySection
            topic={selectedTopic}
            onBack={handleBackToDashboard}
          />
        </div>
      )}

      {/* QUIZ VIEW */}
      {currentView === 'quiz' && selectedTopic && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t.quizFor} {selectedTopic.name}</h2>
            <div>
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                {t.backToDashboard}
              </button>
            </div>
          </div>

          <QuizSection
            topic={selectedTopic}
            onComplete={handleQuizComplete}
            onBack={handleBackToDashboard}
          />
        </div>
      )}

      {/* RESULTS VIEW */}
      {currentView === 'results' && quizScore !== null && (
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold mb-2">{t.results}</h2>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="mb-4">
              {t.yourScore}: <strong>{quizScore}</strong>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white"
              >
                {t.backToDashboard}
              </button>

              <button
                onClick={() => {
                  // Allow user to retake similar quiz on same topic
                  if (selectedTopic) {
                    setCurrentView('quiz')
                  } else {
                    setCurrentView('dashboard')
                  }
                }}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                {t.retryQuiz}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATISTICS VIEW */}
      {currentView === 'statistics' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t.statistics}</h2>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              {t.backToDashboard}
            </button>
          </div>

          <StatisticsPanel progress={progress} />
        </div>
      )}

      {/* ACHIEVEMENTS VIEW */}
      {currentView === 'achievements' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t.achievements}</h2>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              {t.backToDashboard}
            </button>
          </div>

          <AchievementBadges user={user} />
        </div>
      )}

      {/* RANDOM VIEW */}
      {currentView === 'random' && selectedTopic && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t.randomPractice}</h2>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              {t.backToDashboard}
            </button>
          </div>

          <RandomViewing topic={selectedTopic} onBack={handleBackToDashboard} />
        </div>
      )}
    </div>
  )
}
