// Генераторы SVG-заглушек: постеры и аватары работают без интернета
// и не требуют хранения картинок в репозитории.

const toDataUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

/**
 * Абстрактный постер фильма: градиент, блик и крупная буква названия.
 * @param {string} letter — символ, который будет на постере
 * @param {[string, string]} colors — цвета градиента [начало, конец]
 * @returns {string} data URI для атрибута src
 */
export function createPoster(letter, [from, to]) {
  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/>
          <stop offset="1" stop-color="${to}"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.78" cy="0.18" r="0.65">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#bg)"/>
      <rect width="400" height="600" fill="url(#glow)"/>
      <circle cx="330" cy="470" r="170" fill="none" stroke="#fff" stroke-opacity="0.14" stroke-width="2"/>
      <circle cx="330" cy="470" r="115" fill="none" stroke="#fff" stroke-opacity="0.1" stroke-width="2"/>
      <text x="28" y="440" font-family="Georgia, 'Times New Roman', serif" font-size="320"
        font-weight="700" fill="#ffffff" fill-opacity="0.2">${letter}</text>
      <rect width="400" height="600" fill="url(#fade)"/>
    </svg>`)
}

/**
 * Круглый аватар с инициалами.
 * @param {string} initials — 1–2 буквы
 * @param {string} color — цвет фона
 * @returns {string} data URI для атрибута src
 */
export function createAvatar(initials, color) {
  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="48" fill="${color}"/>
      <text x="48" y="50" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>`)
}
