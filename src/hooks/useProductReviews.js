import { useCallback, useEffect, useState } from 'react'
import { todayIso } from '../utils/helpers.js'
import { STORAGE_KEYS, readFromStorage, writeToStorage } from '../utils/storage.js'

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} author
 * @property {string} text
 * @property {string} date — YYYY-MM-DD
 * @property {number} [rating]
 */

const readAllReviews = () => {
  const saved = readFromStorage(STORAGE_KEYS.reviews, {})
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}
}

/**
 * Отзывы зрителей о товаре, оставленные на этом устройстве (localStorage).
 * Отзывы «с сервера» приходят в JSON товара, эти — добавляются к ним.
 * @param {number} productId
 * @returns {[Review[], (review: { authorName: string, text: string }) => void]}
 */
export function useProductReviews(productId) {
  const [allReviews, setAllReviews] = useState(readAllReviews)
  const reviews = Array.isArray(allReviews[productId]) ? allReviews[productId] : []

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.reviews, allReviews)
  }, [allReviews])

  // стабильная функция: передаётся в форму отзыва вглубь страницы товара
  const addReview = useCallback(
    ({ authorName, text }) => {
      const review = { id: `user-${Date.now()}`, author: authorName, text, date: todayIso() }
      setAllReviews((prev) => {
        const current = Array.isArray(prev[productId]) ? prev[productId] : []
        return { ...prev, [productId]: [review, ...current] }
      })
    },
    [productId],
  )

  return [reviews, addReview]
}
