import React, { useEffect, useState } from 'react';

const ArtistBio = ({ artistName }) => {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBio = async () => {
      if (!artistName) return;
      
      try {
        setLoading(true);
        // First, search for the artist page
        const searchResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?` +
          `action=query&list=search&srsearch=${encodeURIComponent(artistName + " musician")}&format=json&origin=*`
        );
        
        if (!searchResponse.ok) throw new Error('Failed to search Wikipedia');
        
        const searchData = await searchResponse.json();
        if (!searchData.query.search.length) {
          throw new Error('No Wikipedia entry found');
        }

        // Get the full page content for the first result
        const pageId = searchData.query.search[0].pageid;
        const contentResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?` +
          `action=query&prop=extracts&exintro=1&explaintext=1&pageids=${pageId}&format=json&origin=*`
        );

        if (!contentResponse.ok) throw new Error('Failed to fetch Wikipedia content');

        const contentData = await contentResponse.json();
        const extract = contentData.query.pages[pageId].extract;
        setBio(extract || 'No biography available');

      } catch (err) {
        setError('Failed to load artist biography');
        console.error('Error fetching bio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [artistName]);

  if (loading) return <div className="alert alert-info">Loading biography...</div>;
  if (error) return <div className="alert alert-warning">{error}</div>;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">About {artistName}</h5>
        <p className="card-text">{bio}</p>
        <small className="text-muted">Source: Wikipedia</small>
      </div>
    </div>
  );
};

export default ArtistBio; 