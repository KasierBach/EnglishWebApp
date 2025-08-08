'use client'

import { Trophy, Star, Target, Zap, Award, Medal } from 'lucide-react'
import { useTranslation } from '../utils/translations'

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  unlocked: boolean
  progress?: number
  maxProgress?: number
  color: string
}

export default function AchievementBadges() {
  const t = useTranslation()
  
  const achievements: Achievement[] = [
    {
      id: 'first-quiz',
      name: t.firstQuiz,
      description: 'Hoàn thành bài kiểm tra đầu tiên',
      icon: Trophy,
      unlocked: true,
      color: 'text-yellow-500'
    },
    {
      id: 'perfect-score',
      name: t.perfectScore,
      description: 'Đạt 100% trong một bài kiểm tra',
      icon: Star,
      unlocked: true,
      color: 'text-blue-500'
    },
    {
      id: 'week-streak',
      name: t.weekStreak,
      description: 'Học liên tiếp 7 ngày',
      icon: Target,
      unlocked: true,
      color: 'text-green-500'
    },
    {
      id: 'vocabulary-master',
      name: t.vocabularyMaster,
      description: 'Học 500 từ vựng',
      icon: Award,
      unlocked: false,
      progress: 340,
      maxProgress: 500,
      color: 'text-purple-500'
    },
    {
      id: 'speed-learner',
      name: 'Học nhanh',
      description: 'Học 50 từ trong một ngày',
      icon: Zap,
      unlocked: false,
      progress: 12,
      maxProgress: 50,
      color: 'text-orange-500'
    },
    {
      id: 'quiz-master',
      name: 'Bậc thầy quiz',
      description: 'Hoàn thành 100 bài kiểm tra',
      icon: Medal,
      unlocked: false,
      progress: 23,
      maxProgress: 100,
      color: 'text-red-500'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
        {t.achievements}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Icon className={`h-8 w-8 mx-auto mb-2 ${
                achievement.unlocked ? achievement.color : 'text-gray-400'
              }`} />
              
              <h4 className={`font-semibold text-sm mb-1 ${
                achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {achievement.name}
              </h4>
              
              <p className="text-xs text-gray-600 mb-2">
                {achievement.description}
              </p>
              
              {!achievement.unlocked && achievement.progress && achievement.maxProgress && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-1">
                    {achievement.progress}/{achievement.maxProgress}
                  </p>
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="text-xs text-yellow-600 font-medium">
                  ✓ Đã mở khóa
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}