import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8000'
// GNews API - Free tier: 100 requests/day
// API key: https://gnews.io/
const GNEWS_API_KEY = 'fab103d1dfa68c34365dddc1e04f0b1a'
const GNEWS_URL = 'https://gnews.io/api/v4'

const CATEGORIES = {
  1: { name: 'World'},
  2: { name: 'Sports'},
  3: { name: 'Business'},
  4: { name: 'Sci/Tech'}
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [news, setNews] = useState([])
  const [classifying, setClassifying] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async (query = '') => {
    setError(null)
    
    try {
      const endpoint = query 
        ? `${GNEWS_URL}/search?q=${encodeURIComponent(query)}&lang=en&max=5&apikey=${GNEWS_API_KEY}`
        : `${GNEWS_URL}/top-headlines?lang=en&max=5&apikey=${GNEWS_API_KEY}`
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      
      const data = await response.json()
      
      if (data.articles) {
        setNews(data.articles.map(article => ({
          ...article,
          classification: null
        })))
      }
    } catch (err) {
      setError('News could not be loaded. Check the API key.')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchNews(searchQuery)
  }

  const classifyArticle = async (index) => {
    const article = news[index]
    setClassifying(index)
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          description: article.description || ''
        })
      })
      
      if (!response.ok) throw new Error('Classification failed')
      
      const result = await response.json()
      
      setNews(prev => prev.map((item, i) => 
        i === index ? { ...item, classification: result } : item
      ))
    } catch (err) {
      setError('Classification failed. Is the backend running?')
    } finally {
      setClassifying(null)
    }
  }


  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>News Classifier</h1>
          <p>Machine learning based news classification</p>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="search-input"
          />
          <button type="submit" className="btn">
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => fetchNews()}>
            Latest News
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="news-list">
          {news.map((article, index) => (
            <div key={index} className="news-card">
              <div className="news-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </div>
              
              <div className="news-action">
                {article.classification ? (
                  <div className="classification">
                    <span className="category-name">
                      {article.classification.category}
                    </span>
                    {article.classification.confidence && (
                      <span className="confidence">
                        %{(article.classification.confidence * 100).toFixed(0)}
                      </span>
                    )}
                  </div>
                ) : (
                  <button 
                    className="btn btn-small"
                    onClick={() => classifyArticle(index)}
                    disabled={classifying === index}
                  >
                    {classifying === index ? '...' : 'Classify'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="legend">
          {Object.values(CATEGORIES).map(cat => (
            <span key={cat.name} className="legend-item">
              {cat.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
