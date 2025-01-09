import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../ApiService';
import Pagination from 'react-js-pagination';
import ArtistBio from '../ArtistBio';

import axios from 'axios';
import { Tag, Spin } from 'antd';
import styled from 'styled-components';

import 'bootstrap/dist/css/bootstrap.min.css';


const TagsContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  margin: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ArtistDetailPage = () => {
    const { artistId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const year = searchParams.get('year');
    const [data, setData] = useState([]);
    const [artistName, setArtistName] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const [relatedArtists, setRelatedArtists] = useState([]);
    const [loadingArtists, setLoadingArtists] = useState(false);

    useEffect(() => {
        const loadArtistData = async () => {
            try {
                const result = await fetchData('/artist', { artistName: artistId });
                setData(result);
                if (result.length > 0) {
                    // setArtistName(result[0].ARTIST_NAME);
                    setArtistName(artistId);
                    // Fetch related artists when we get the artist name
                    // fetchRelatedArtists(result[0].ARTIST_NAME);
                    fetchRelatedArtists(artistId);
                }
            } catch (error) {
                console.error('Error fetching artist data:', error);
            }
        };

        if (artistId) {
            loadArtistData();
        }
    }, [artistId]);

    const sortData = (items, sortConfig) => {
        if (!sortConfig.key) return items;

        return [...items].sort((a, b) => {
            if (sortConfig.key === 'CHART_DATE') {
                return sortConfig.direction === 'asc'
                    ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
                    : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
            }

            if (sortConfig.key === 'SCORE') {
                const aValue = Number(a[sortConfig.key]) || 0;
                const bValue = Number(b[sortConfig.key]) || 0;
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            if (typeof a[sortConfig.key] === 'number') {
                return sortConfig.direction === 'asc'
                    ? a[sortConfig.key] - b[sortConfig.key]
                    : b[sortConfig.key] - a[sortConfig.key];
            }

            return sortConfig.direction === 'asc'
                ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
                : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
        });
    };

    const fetchRelatedArtists = async (name) => {
        setLoadingArtists(true);
        try {
            //   const response = await axios.get(`/api/featuring`, {
            //     params: { artistName: name }
            //   });
            const result = await fetchData('/featuring', { artistName: name });

            //   const validArtists = result?.filter(artist => 
            //     artist && typeof artist === 'object' && artist.ARTIST_NAME
            //   ) || [];
            const validArtists = Array.isArray(result) ? result : [];
            setRelatedArtists(validArtists);

            setRelatedArtists(validArtists);
        } catch (error) {
            console.error('Error fetching related artists:', error);
            setRelatedArtists([]); // Set empty array on error
        } finally {
            setLoadingArtists(false);
        }
    };

    const getRandomColor = () => {
        const colors = [
            'magenta', 'red', 'volcano', 'orange', 'gold',
            'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleArtistTagClick = (artistName) => {
        // You might want to implement navigation to that artist's page
        // This depends on how your routing is set up
        console.log('Clicked artist:', artistName);
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setActivePage(1);
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return <i className="bi bi-arrow-down-up text-muted"></i>;
        }
        return sortConfig.direction === 'asc'
            ? <i className="bi bi-arrow-down"></i>
            : <i className="bi bi-arrow-up"></i>;
    };

    const sortedData = sortData(data, sortConfig);
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleBack = () => {
        navigate('/billboard');
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Artist: {artistName}</h2>
                <button
                    onClick={handleBack}
                    className="btn btn-outline-secondary"
                >
                    Back to Chart
                </button>
            </div>

            {artistName && <ArtistBio artistName={artistName} />}



            <div className="card mt-4">
                <div className="card-header">
                    <h3 className="h5 mb-0">Related Artists & Collaborations</h3>
                </div>
                <div className="card-body">
                    {loadingArtists ? (
                        <div className="text-center p-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : relatedArtists?.length > 0 ? (
                        <>
                            <p className="text-muted">
                                {relatedArtists.length} artist{relatedArtists.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                {relatedArtists.map((artist, index) => {
                                    if (!artist?.ARTIST_NAME) return null;
                                    return (
                                        <span
                                            key={`${artist.ARTIST_NAME}-${index}`}
                                            className="badge bg-primary text-white p-2 cursor-pointer"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleArtistTagClick(artist.ARTIST_NAME)}
                                        >
                                            {artist.ARTIST_NAME}
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p className="text-muted">No related artists found</p>
                    )}
                </div>
            </div>



            {currentItems.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => requestSort('CHART_DATE')} style={{ cursor: 'pointer' }}>
                                    Chart Date {getSortIcon('CHART_DATE')}
                                </th>
                                <th onClick={() => requestSort('SONG_NAME')} style={{ cursor: 'pointer' }}>
                                    Song Name {getSortIcon('SONG_NAME')}
                                </th>
                                <th onClick={() => requestSort('SCORE')} style={{ cursor: 'pointer' }}>
                                    Score {getSortIcon('SCORE')}
                                </th>
                                <th onClick={() => requestSort('AVERAGE_RANK')} style={{ cursor: 'pointer' }}>
                                    Average Rank {getSortIcon('AVERAGE_RANK')}
                                </th>
                                <th onClick={() => requestSort('COUNT')} style={{ cursor: 'pointer' }}>
                                    Count {getSortIcon('COUNT')}
                                </th>
                                <th style={{ width: '200px' }}>Links</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={`${item.SONG_ID}-${item.CHART_DATE}`}>
                                    <td>{new Date(item.CHART_DATE).toLocaleDateString()}</td>
                                    <td>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/song/${item.SONG_ID}`);
                                            }}
                                            className="text-decoration-none"
                                        >
                                            {item.SONG_NAME}
                                        </a>
                                    </td>
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

export default ArtistDetailPage; 