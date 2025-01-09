import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import BillboardChart from './pages/BillboardChart';
import ArtistList from './pages/ArtistList';
import ArtistDetailPage from './pages/ArtistDetailPage';
import SongDetailPage from './pages/SongDetailPage';
import ArtistSearchPage from './pages/ArtistSearchPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/billboard" replace />} />
      <Route path="/billboard" element={<BillboardChart />} />
      <Route path="/artists" element={<ArtistList />} />
      <Route path="/artist/:artistId" element={<ArtistDetailPage />} />
      <Route path="/song/:songId" element={<SongDetailPage />} />
      <Route path="/search" element={<ArtistSearchPage />} />
    </Routes>
  );
};

export default RoutesComponent;