"use client"

import { useState, useEffect } from "react"
import type { User, Topic, Progress } from "../types"
import TopicCard from "./TopicCard"
import VocabularySection from "./VocabularySection"
import QuizSection from "./QuizSection"
import StatisticsPanel from "./StatisticsPanel"
import AchievementBadges from "./AchievementBadges"
import { BarChart3, BookOpen, Trophy } from "lucide-react"
import { useTranslation } from "../utils/translations"
import RandomViewing from "./RandomViewing"

interface DashboardProps {
  user: User
}

// Type View đã bao gồm 'statistics' và 'random'
export type DashboardView = "dashboard" | "vocabulary" | "quiz" | "results" | "statistics" | "achievements" | "random"

export default function Dashboard({ user }: DashboardProps) {
  const t = useTranslation()
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard")
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [progress, setProgress] = useState<Progress>({
    learned_words: 0,
    average_score: 0,
    quizzes_taken: 0,
  })
  const [quizScore, setQuizScore] = useState<any>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    loadTopics()
    loadProgress()
  }, [])

  const loadTopics = async () => {
    try {
      const response = await fetch(`${backendUrl}/topics`)
      const data = await response.json()
      setTopics(data)
    } catch (error) {
      console.error("Failed to load topics:", error)
    }
  }

  const loadProgress = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setProgress(data)
    } catch (error) {
      console.error("Failed to load progress:", error)
    }
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setCurrentView("vocabulary")
  }

  const handleStartQuiz = () => {
    setCurrentView("quiz")
  }

  const handleQuizComplete = (score: any) => {
    setQuizScore(score)
    setCurrentView("results")
    loadProgress()
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedTopic(null)
    setQuizScore(null)
  }

  if (currentView === "vocabulary" && selectedTopic) {
    return <VocabularySection topic={selectedTopic} onBack={handleBackToDashboard} onStartQuiz={handleStartQuiz} />
  }

  if (currentView === "quiz" && selectedTopic) {
    return (
      <QuizSection topic={selectedTopic} onBack={() => setCurrentView("vocabulary")} onComplete={handleQuizComplete} />
    )
  }

  if (currentView === "statistics") {
    return (
      <div>
        <div className="mb-6">
          <button onClick={handleBackToDashboard} className="btn-secondary">
            ← {t.backToTopics}
          </button>
        </div>
        <StatisticsPanel user={user} />
        <AchievementBadges />
      </div>
    )
  }

  if (currentView === "results" && quizScore) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">{t.quizResults}</h2>

          <div className="text-6xl font-bold mb-4">
            <span
              className={`${
                quizScore.score >= 90
                  ? "text-green-500"
                  : quizScore.score >= 70
                    ? "text-blue-500"
                    : quizScore.score >= 50
                      ? "text-yellow-500"
                      : "text-red-500"
              }`}
            >
              {quizScore.score.toFixed(1)}%
            </span>
          </div>

          <p className="text-xl text-gray-600 mb-6">
            {t.youGot} <strong>{quizScore.correct}</strong> {t.outOf} <strong>{quizScore.total}</strong>{" "}
            {t.questionsCorrect}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full ${
                quizScore.score >= 90
                  ? "bg-green-500"
                  : quizScore.score >= 70
                    ? "bg-blue-500"
                    : quizScore.score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${quizScore.score}%` }}
            ></div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={handleBackToDashboard} className="btn-primary">
              {t.backToTopicsBtn}
            </button>
            <button onClick={handleStartQuiz} className="btn-outline">
              {t.retakeQuiz}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "random") {
    return <RandomViewing topics={topics} onBack={handleBackToDashboard} />
  }

  return (
    <div>
      {/* Statistics Panel */}
      <StatisticsPanel user={user} />

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📚 Chủ đề học tập
        </button>
        <button
          onClick={() => setCurrentView("random")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === "random" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🎲 {t.randomPractice}
        </button>
        <button
          onClick={() => setCurrentView("statistics")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === "statistics" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📊 {t.statistics}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{t.chooseTopicTitle}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} onClick={() => handleTopicSelect(topic)} />
            ))}
          </div>
        </div>

        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold">{t.yourProgress}</h3>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{progress.learned_words}</div>
                <div className="text-sm text-gray-600">{t.wordsLearned}</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{progress.average_score.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">{t.averageScore}</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{progress.quizzes_taken}</div>
                <div className="text-sm text-gray-600">{t.quizzesTaken}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
