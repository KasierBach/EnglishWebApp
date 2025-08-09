'use client'

import { useState, useEffect } from 'react'
import { Vocabulary } from '../types'
import { useTranslation } from '../utils/translations'
import { CheckCircle, XCircle } from 'lucide-react'

interface MatchingGameProps {
  vocabularies: Vocabulary[]
  onComplete: () => void
}

export default function MatchingGame({ vocabularies, onComplete }: MatchingGameProps) {
  const t = useTranslation()
  const [gameWords, setGameWords] = useState<Array<{id: string, text: string, type: 'word' | 'meaning', vocabId: number, matched: boolean}>>([])
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [matches, setMatches] = useState<number>(0)
  const [attempts, setAttempts] = useState<number>(0)

  useEffect(() => {
    // Tạo game với 6 từ đầu tiên
    const gameVocabs = vocabularies.slice(0, 6)
    const cards = []
    
    gameVocabs.forEach((vocab, index) => {
      cards.push({
        id: `word-${index}`,
        text: vocab.word,
        type: 'word' as const,
        vocabId: vocab.id,
        matched: false
      })
      cards.push({
        id: `meaning-${index}`,
        text: vocab.meaning,
        type: 'meaning' as const,
        vocabId: vocab.id,
        matched: false
      })
    })
    
    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5)
    setGameWords(shuffled)
  }, [vocabularies])

  const handleCardClick = (cardId: string) => {
    if (selectedCards.includes(cardId) || gameWords.find(w => w.id === cardId)?.matched) {
      return
    }

    const newSelected = [...selectedCards, cardId]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setAttempts(attempts + 1)
      const [first, second] = newSelected
      const firstCard = gameWords.find(w => w.id === first)
      const secondCard = gameWords.find(w => w.id === second)

      if (firstCard && secondCard && firstCard.vocabId === secondCard.vocabId && firstCard.type !== secondCard.type) {
        // Match found!
        setTimeout(() => {
          setGameWords(prev => prev.map(w => 
            w.id === first || w.id === second ? { ...w, matched: true } : w
          ))
          setMatches(matches + 1)
          setSelectedCards([])
          
          if (matches + 1 === 6) {
            setTimeout(onComplete, 1000)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setSelectedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">{t.matching}</h3>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span>Ghép đôi: {matches}/6</span>
          <span>Lần thử: {attempts}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {gameWords.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched}
            className={`p-4 rounded-lg border-2 min-h-[100px] flex items-center justify-center text-center transition-all duration-200 ${
              card.matched
                ? 'bg-green-100 border-green-500 text-green-700'
                : selectedCards.includes(card.id)
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div>
              {card.matched && <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-500" />}
              <div className={`font-medium ${card.type === 'word' ? 'text-lg' : 'text-base'}`}>
                {card.text}
              </div>
            </div>
          </button>
        ))}
      </div>

      {matches === 6 && (
        <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-semibold mb-2">🎉 Hoàn thành!</h3>
          <p>Bạn đã ghép đúng tất cả {matches} cặp từ trong {attempts} lần thử!</p>
        </div>
      )}
    </div>
  )
}
