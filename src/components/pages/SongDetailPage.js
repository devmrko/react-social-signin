import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../ApiService';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

const SongDetailPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songMetadata, setSongMetadata] = useState(null);
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    const loadSongData = async () => {
      try {
        setLoading(true);
        const result = await fetchData('/song', { songId });
        if (!result || result.length === 0) {
          setError('No data found for this song');
          return;
        }
        const sortedData = result.sort((a, b) => 
          new Date(b.CHART_DATE) - new Date(a.CHART_DATE)
        );
        setSongData(sortedData);
      } catch (error) {
        console.error('Error fetching song data:', error);
        setError('Failed to load song data');
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      loadSongData();
    }
  }, [songId]);

  useEffect(() => {
    const fetchSongMetadata = async () => {
      if (!songData[0]) return;
      
      try {
        const searchQuery = `${songData[0].SONG_NAME} ${songData[0].ARTIST_NAME}`;
        const response = await fetch(
          `https://api.musixmatch.com/ws/1.1/track.search?` +
          `q=${encodeURIComponent(searchQuery)}` +
          `&apikey=${process.env.REACT_APP_MUSIXMATCH_API_KEY}` +
          `&page_size=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.message.body.track_list.length > 0) {
            setSongMetadata(data.message.body.track_list[0].track);
          }
        }
      } catch (error) {
        console.error('Error fetching song metadata:', error);
      }
    };

    fetchSongMetadata();
  }, [songData]);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!songData[0]) return;
      
      try {
        const response = await fetch(
          `https://api.happi.dev/v1/music/artists/${encodeURIComponent(songData[0].ARTIST_NAME)}/songs/${encodeURIComponent(songData[0].SONG_NAME)}/lyrics`,
          {
            headers: {
              'x-happi-key': process.env.REACT_APP_HAPPI_API_KEY,
              'Accept': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result.lyrics) {
            setLyrics(data.result.lyrics);
          }
        }
      } catch (error) {
        console.error('Error fetching lyrics:', error);
      }
    };

    fetchLyrics();
  }, [songData]);

  if (loading) return <div className="alert alert-info">Loading song data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!songData.length) return <div className="alert alert-warning">No data found</div>;

  const songInfo = songData[0];

  // Sample data for the chart (every 5th point)
  const sampleSize = 5;
  const chartData = songData
    .filter((_, index) => index % sampleSize === 0)
    .map(item => ({
      x: new Date(item.CHART_DATE).toLocaleDateString(),
      y: item.RANK
    }))
    .reverse();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{songInfo.SONG_NAME}</h2>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline-secondary"
        >
          Back
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Chart Performance</h5>
          <div style={{ height: '400px' }}>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
            >
              <VictoryAxis
                tickFormat={(x) => x}
                style={{
                  tickLabels: { angle: -45, textAnchor: 'end' }
                }}
              />
              <VictoryAxis
                dependentAxis
                invertAxis
                tickFormat={(y) => Math.round(y)}
                label="Chart Position"
                style={{
                  axisLabel: { padding: 40 }
                }}
              />
              <VictoryBar
                data={chartData}
                style={{
                  data: { fill: "#6c757d" }
                }}
              />
            </VictoryChart>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Song Information & Lyrics</h5>
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.musixmatch.com/lyrics/${encodeURIComponent(songInfo.ARTIST_NAME.replace(/\s+/g, '-'))}/${encodeURIComponent(songInfo.SONG_NAME.replace(/\s+/g, '-'))}/embed`}
              frameBorder="0"
              style={{ 
                minHeight: "500px",
                background: "white"
              }}
              title="song lyrics"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Song Lyrics</h5>
          {lyrics ? (
            <pre className="lyrics-content" style={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '1rem'
            }}>
              {lyrics}
            </pre>
          ) : (
            <div className="alert alert-info">
              Lyrics not available
              <div className="mt-2">
                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(songInfo.SONG_NAME + ' ' + songInfo.ARTIST_NAME + ' lyrics')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  Search Lyrics on Google
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Chart History</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Song Name</th>
                  <th>Artist</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {songData.map((entry) => (
                  <tr key={entry.CHART_DATE}>
                    <td>{new Date(entry.CHART_DATE).toLocaleDateString()}</td>
                    <td>{entry.SONG_NAME}</td>
                    <td>{entry.ARTIST_NAME}</td>
                    <td>{entry.RANK}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailPage; 