import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../ApiService';
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const ArtistList = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        const result = await fetchData('/artists');
        setArtists(result);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setArtists([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadArtists();
  }, []);

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = artists.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div>
      <h2 className="mb-4">Billboard Artists</h2>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Artist Name</th>
              <th>Total Songs</th>
              <th>Total Weeks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <div className="alert alert-info m-0">Loading artists...</div>
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((artist) => (
                <tr key={artist.ARTIST_ID}>
                  <td>{artist.ARTIST_NAME}</td>
                  <td>{artist.TOTAL_SONGS}</td>
                  <td>{artist.TOTAL_WEEKS}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/artist/${artist.ARTIST_ID}`)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  <div className="alert alert-warning m-0">No artists found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {artists.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={artists.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </div>
  );
};

export default ArtistList; 