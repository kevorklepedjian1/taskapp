import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';


const isValidUrl = (url) => {
  try {
    new URL(url); 
    return true;
  } catch (e) {
    return false;
  }
};

const App = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [urlList, setUrlList] = useState(() => {
    const savedUrls = localStorage.getItem('urlList');
    return savedUrls ? JSON.parse(savedUrls) : [];
  });

  const generateShortSlug = () => {
    const randomChars = Math.random().toString(36).substr(2, 6);
    return randomChars;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    setError('');

    const slug = generateShortSlug();
    const shortLink = `https://short.ly/${slug}`;

    const newUrl = { longUrl, shortUrl: shortLink, slug };
    const updatedUrls = [...urlList, newUrl];
    setUrlList(updatedUrls);
    localStorage.setItem('urlList', JSON.stringify(updatedUrls));

    setShortUrl(shortLink);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      alert('Shortened URL copied to clipboard!');
    });
  };

  return (
    <Router>
      <div className="app">
        <h1>React URL Shortener</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="longUrl">Enter URL:</label>
          <input
            type="text"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter a long URL"
            required
          />
          <button type="submit">Shorten</button>
        </form>

        {error && <p className="error">{error}</p>}

        {shortUrl && (
          <div>
            <p>
              Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            </p>
            <button onClick={handleCopy}>Copy to Clipboard</button>
          </div>
        )}

        <div>
          <h2>Your Shortened URLs</h2>
          <ul>
            {urlList.map((url, index) => (
              <li key={index}>
                <Link to={`/short/${url.slug}`}>{url.shortUrl}</Link>
              </li>
            ))}
          </ul>
        </div>

        <Routes>
          <Route path="/short/:slug" element={<RedirectToOriginalUrl urlList={urlList} />} />
        </Routes>
      </div>
    </Router>
  );
};


const RedirectToOriginalUrl = ({ urlList }) => {
  const { slug } = useParams();
  const navigate = useNavigate(); 

  useEffect(() => {
    const url = urlList.find((url) => url.slug === slug);
    if (url) {
      
      window.location.href = url.longUrl; 
    } else {
    
      alert('404 - URL Not Found');
    }
  }, [slug, urlList, navigate]);

  return null;
};

export default App;
