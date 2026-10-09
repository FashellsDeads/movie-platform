import { createContext } from 'react'

/**
 * @typedef {'light' | 'dark'} Theme
 */

/**
 * @typedef {Object} ThemeContextValue
 * @property {Theme} theme — текущая тема
 * @property {boolean} isDarkMode — включена ли тёмная тема
 * @property {() => void} toggleTheme — переключить тему и запомнить выбор
 */

/** ДЗ №5 · ThemeContext — глобальная тема оформления. */
/** @type {import('react').Context<ThemeContextValue | null>} */
export const ThemeContext = createContext(null)
