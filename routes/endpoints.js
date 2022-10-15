// Не уверен, что это хорошая практика, но мне глаза мозолило
const endpoints = {
  /**
   * Фэйковая авторизация
   */
  fakeAuth: '/api/user/login',
  /**
   * все книги
   */
  library: '/api/books',
  /**
   * одна книга
   */
  book: '/api/books/:id',
}

module.exports = { endpoints }