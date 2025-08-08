'use client'

import { useState } from 'react'
import { Volume2, RefreshCw } from 'lucide-react'
import { Vocabulary } from '../types'
import { useTranslation } from '../utils/translations'

interface RandomVocabViewerProps {
  vocabulary: Vocabulary
  onNext: () => void
  isLoading: boolean
}

export default function RandomVocabViewer({ vocabulary, onNext, isLoading }: RandomVocabViewerProps) {
  const t = useTranslation()
  const [showMeaning, setShowMeaning] = useState(false)

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  if (!vocabulary) return null

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">{t.randomVocabulary}</h3>
        
        <div className="mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-4">
            {vocabulary.word}
          </div>
          
          <button
            onClick={() => speakWord(vocabulary.word)}
            className="mb-4 p-2 text-blue-600 hover:text-blue-800"
          >
            <Volume2 className="h-6 w-6" />
          </button>

          <div className="text-lg text-gray-600 mb-2">
            {vocabulary.pronunciation}
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowMeaning(!showMeaning)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showMeaning ? t.hideMeaning : t.showMeaning}
          </button>
          
          {showMeaning && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-semibold text-gray-800 mb-2">
                {vocabulary.meaning}
              </div>
              <div className="text-gray-600 italic">
                "{vocabulary.example}"
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center mx-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t.nextRandom}
        </button>
      </div>
    </div>
  )
}
