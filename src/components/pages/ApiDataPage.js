import React, { useEffect, useState } from 'react';
import { fetchData } from '../ApiService';
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ApiDataPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const loadYears = async () => {
      try {
        const yearList = await fetchData('/year');
        setYears(yearList);
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };
    loadYears();
  }, []);

  useEffect(() => {
    const loadMonths = async () => {
      try {
        const monthList = await fetchData('/month', { year: selectedYear });
        const formattedMonths = monthList.map(item => item.MONTH);
        setMonths(formattedMonths);
        setSelectedMonth(formattedMonths[0]);
        setSelectedDay('');
      } catch (error) {
        console.error('Error fetching months:', error);
      }
    };
    loadMonths();
  }, [selectedYear]);

  useEffect(() => {
    const loadDays = async () => {
      if (selectedMonth) {
        try {
          const dayList = await fetchData('/day', { 
            year: selectedYear,
            month: selectedMonth 
          });
          const formattedDays = dayList.map(item => item.DAY);
          setDays(formattedDays);
          setSelectedDay(formattedDays[0]);
        } catch (error) {
          console.error('Error fetching days:', error);
        }
      }
    };
    loadDays();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('/list', { 
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay 
        });
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (selectedMonth && selectedDay) {
      loadData();
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
    setActivePage(1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setActivePage(1);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setActivePage(1);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const getYoutubeSearchUrl = (songName, artistName) => {
    const searchQuery = encodeURIComponent(`${songName} ${artistName} official video`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  const getGeniusSearchUrl = (songName, artistName) => {
    const searchQuery = encodeURIComponent(`${songName} ${artistName}`);
    return `https://genius.com/search?q=${searchQuery}`;
  };

  const getKoreanLyricsUrl = (songName, artistName) => {
    const searchQuery = encodeURIComponent(`${songName} ${artistName} lyrics`);
    return `https://translate.google.com/?sl=en&tl=ko&text=${searchQuery}`;
  };

  const renderArtistButtons = (artistName, artistId) => {
    const artists = artistName.split(/(?:Featuring|Feat\.|\s+&\s+|,\s+)/i)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    return (
      <div className="d-flex flex-wrap gap-1">
        {artists.map((artist, index) => (
          <button
            key={index}
            onClick={() => navigate(`/artist/${artistId}`)}
            className="btn btn-sm btn-outline-secondary"
            style={{ fontSize: '0.9rem' }}
          >
            {artist}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Billboard Chart Data</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select" 
            value={selectedYear} 
            onChange={handleYearChange}
            style={{ width: '150px' }}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select 
            className="form-select" 
            value={selectedMonth} 
            onChange={handleMonthChange}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select 
            className="form-select" 
            value={selectedDay} 
            onChange={handleDayChange}
          >
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {currentItems.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Song Name</th>
                <th>Artist Name</th>
                <th>Score</th>
                <th>Average Rank</th>
                <th>Weeks on Chart</th>
                <th style={{ width: '300px' }}>Links</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={`${item.SONG_ID}-${item.ARTIST_ID}`}>
                  <td>{item.ARTIST_NAME}</td>
                  <td>{renderArtistButtons(item.SONG_NAME, item.SONG_ID)}</td>
                  {/* <td>{item.SONG_NAME}</td> */}
                  <td>{item.SCORE}</td>
                  <td>{item.AVERAGE_RANK}</td>
                  <td>{item.COUNT}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <a 
                        href={getYoutubeSearchUrl(item.SONG_NAME, item.ARTIST_NAME)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger"
                        style={{ fontSize: '0.9rem' }}
                      >
                        <i className="bi bi-youtube"></i> Video
                      </a>
                      <a 
                        href={getGeniusSearchUrl(item.SONG_NAME, item.ARTIST_NAME)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-dark"
                        style={{ fontSize: '0.9rem' }}
                      >
                        <i className="bi bi-file-text"></i> Lyrics
                      </a>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">Loading data...</div>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={data.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  );
};

export default ApiDataPage;