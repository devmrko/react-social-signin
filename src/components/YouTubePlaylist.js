import React, { useState, useEffect } from 'react';

const YouTubePlaylist = ({ user }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user || !user.access_token) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
          {
            headers: {
              'Authorization': `Bearer ${user.access_token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch playlists');
        }
        
        const data = await response.json();
        console.log('Playlists data:', data);
        setPlaylists(data.items || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching playlists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  if (!user) return null;
  if (loading) return <div>Loading playlists...</div>;
  if (error) return <div>Error loading playlists: {error}</div>;

  return (
    <div className="mt-3">
      <h5>Your YouTube Playlists</h5>
      <select className="form-select">
        <option value="">Select a playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.snippet.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YouTubePlaylist; 