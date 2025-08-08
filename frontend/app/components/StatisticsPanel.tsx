'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Trophy, Target, TrendingUp } from 'lucide-react'
import { useTranslation } from '../utils/translations'

interface StatisticsPanelProps {
  user: any
}

export default function StatisticsPanel({ user }: StatisticsPanelProps) {
  const t = useTranslation()
  const [stats, setStats] = useState({
    todayWords: 12,
    weeklyWords: 85,
    monthlyWords: 340,
    streak: 7,
    totalWords: 1250,
    averageAccuracy: 87,
    studyTime: 45, // minutes today
    weeklyStudyTime: 320 // minutes this week
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Today's Progress */}
      <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">{t.todayProgress}</p>
            <p className="text-2xl font-bold">{stats.todayWords} từ</p>
            <p className="text-blue-100 text-xs">{stats.studyTime} phút học</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-200" />
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">{t.weeklyProgress}</p>
            <p className="text-2xl font-bold">{stats.weeklyWords} từ</p>
            <p className="text-green-100 text-xs">{Math.round(stats.weeklyStudyTime/60)}h {stats.weeklyStudyTime%60}m</p>
          </div>
          <BarChart3 className="h-8 w-8 text-green-200" />
        </div>
      </div>

      {/* Study Streak */}
      <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">{t.streak}</p>
            <p className="text-2xl font-bold">{stats.streak} {t.days}</p>
            <p className="text-orange-100 text-xs">Kỷ lục: 15 ngày</p>
          </div>
          <Target className="h-8 w-8 text-orange-200" />
        </div>
      </div>

      {/* Accuracy */}
      <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Độ chính xác</p>
            <p className="text-2xl font-bold">{stats.averageAccuracy}%</p>
            <p className="text-purple-100 text-xs">Tổng: {stats.totalWords} từ</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-200" />
        </div>
      </div>
    </div>
  )
}