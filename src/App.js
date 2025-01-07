// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Navigation from './components/Navigation';
import RoutesComponent from './components/RoutesComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID); // Debug log

  return (
    <GoogleOAuthProvider 
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      onScriptLoadError={(error) => console.error('Google Script Load Error:', error)}
      onScriptLoadSuccess={() => console.log('Google Script Loaded Successfully')}
    >
      <Router>
        <div className="container mt-4">
          <Header />
          <Navigation />
          <main className="mt-4">
            <RoutesComponent />
          </main>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;