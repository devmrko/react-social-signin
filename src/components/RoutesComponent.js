import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BillboardChart from './pages/BillboardChart';
import ArtistList from './pages/ArtistList';
import ArtistDetailPage from './pages/ArtistDetailPage';
import SongDetailPage from './pages/SongDetailPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/billboard" element={<BillboardChart />} />
      <Route path="/artists" element={<ArtistList />} />
      <Route path="/artist/:artistId" element={<ArtistDetailPage />} />
      <Route path="/song/:songId" element={<SongDetailPage />} />
    </Routes>
  );
};

export default RoutesComponent;