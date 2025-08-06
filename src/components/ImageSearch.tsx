'use client';

import { useState } from 'react';

type ImageResult = {
  image: string;
  title: string;
  url: string;
};

export default function ImageSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/duckduckgo-images?q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Response is not JSON:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Błąd wyszukiwania obrazków:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj obrazków..."
        className="border p-2 w-full max-w-md"
      />
      <button onClick={searchImages} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
        Szukaj
      </button>

      {loading && <p>Ładowanie...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {results.map((img, idx) => (
          <img
            key={idx}
            src={img.image}
            alt={img.title}
            className="w-full h-auto rounded shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => console.log('Kliknięto link:', img.url)}
          />
        ))}
      </div>
    </div>
  );
}
