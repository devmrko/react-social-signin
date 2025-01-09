import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../ApiService';

const ArtistSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await fetchData('/artistByName', { artistName: searchTerm });
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching artists:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <div className="list-group">
          {searchResults.map((artist, index) => (
            <button
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => navigate(`/artist/${artist.ARTIST_NAME}`)}
            >
              {artist.ARTIST_NAME}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistSearchPage; 