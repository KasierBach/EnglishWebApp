"use client"

import { useState, useEffect } from "react"
import { RefreshCw, CheckCircle } from "lucide-react"
import type { MatchingGame as MatchingGameType, MatchingPair } from "../types"
import { useTranslation } from "../utils/translations"

interface RandomMatchingGameProps {
  game: MatchingGameType
  onNext: () => void
  isLoading: boolean
}

interface Card {
  id: string
  text: string
  type: "word" | "meaning"
  vocabId: number
  matched: boolean
}

export default function RandomMatchingGame({ game, onNext, isLoading }: RandomMatchingGameProps) {
  const t = useTranslation()
  const [gameCards, setGameCards] = useState<Card[]>([])
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [matches, setMatches] = useState<number>(0)
  const [attempts, setAttempts] = useState<number>(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackCorrect, setFeedbackCorrect] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [game]) // Re-initialize when a new 'game' prop is received

  const initializeGame = () => {
    const cards: Card[] = []
    game.correct_pairs.forEach((pair: MatchingPair, index: number) => {
      cards.push({
        id: `word-${pair.id}`, // Use vocabId for unique identification
        text: pair.word,
        type: "word",
        vocabId: pair.id,
        matched: false,
      })
      cards.push({
        id: `meaning-${pair.id}`,
        text: pair.meaning,
        type: "meaning",
        vocabId: pair.id,
        matched: false,
      })
    })

    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5)
    setGameCards(shuffled)
    setSelectedCardIds([])
    setMatches(0)
    setAttempts(0)
    setShowFeedback(false)
    setFeedbackCorrect(false)
  }

  const handleCardClick = (cardId: string) => {
    const clickedCard = gameCards.find((card) => card.id === cardId)
    if (!clickedCard || clickedCard.matched || selectedCardIds.includes(cardId) || showFeedback) {
      return // Ignore if already matched, already selected, or feedback is showing
    }

    const newSelected = [...selectedCardIds, cardId]
    setSelectedCardIds(newSelected)

    if (newSelected.length === 2) {
      setAttempts((prev) => prev + 1)
      const [firstId, secondId] = newSelected
      const firstCard = gameCards.find((card) => card.id === firstId)
      const secondCard = gameCards.find((card) => card.id === secondId)

      if (firstCard && secondCard && firstCard.vocabId === secondCard.vocabId && firstCard.type !== secondCard.type) {
        // Match found!
        setFeedbackCorrect(true)
        setShowFeedback(true)
        setTimeout(() => {
          setGameCards((prev) =>
            prev.map((card) => (card.id === firstId || card.id === secondId ? { ...card, matched: true } : card)),
          )
          setMatches((prev) => prev + 1)
          setSelectedCardIds([])
          setShowFeedback(false)
        }, 800) // Short delay for feedback
      } else {
        // No match
        setFeedbackCorrect(false)
        setShowFeedback(true)
        setTimeout(() => {
          setSelectedCardIds([])
          setShowFeedback(false)
        }, 800) // Short delay for feedback
      }
    }
  }

  const allMatched = matches === game.correct_pairs.length

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">{t.randomMatching}</h3>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span>
            {t.matching}: {matches}/{game.correct_pairs.length}
          </span>
          <span>
            {t.attempts}: {attempts}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {gameCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || isLoading || showFeedback}
            className={`p-4 rounded-lg border-2 min-h-[100px] flex items-center justify-center text-center transition-all duration-200
              ${
                card.matched
                  ? "bg-green-100 border-green-500 text-green-700"
                  : selectedCardIds.includes(card.id)
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : showFeedback &&
                        (gameCards.find((c) => c.id === selectedCardIds[0])?.vocabId === card.vocabId ||
                          gameCards.find((c) => c.id === selectedCardIds[1])?.vocabId === card.vocabId) &&
                        !feedbackCorrect
                      ? "bg-red-100 border-red-500 text-red-700" // Highlight incorrect pair
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
              ${isLoading || showFeedback ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div>
              {card.matched && <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-500" />}
              <div className={`font-medium ${card.type === "word" ? "text-lg" : "text-base"}`}>{card.text}</div>
            </div>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div
          className={`mt-4 p-3 rounded-lg text-center ${feedbackCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {feedbackCorrect ? t.correct : t.incorrect}
        </div>
      )}

      {allMatched && (
        <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-semibold mb-2">🎉 {t.gameComplete}!</h3>
          <p>
            {t.youMatched} {matches} {t.pairsIn} {attempts} {t.attempts}!
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {t.nextRandom}
        </button>
      </div>
    </div>
  )
}
