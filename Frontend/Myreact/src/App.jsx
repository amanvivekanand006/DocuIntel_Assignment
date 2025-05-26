// 

// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './Components/Login';
import Footer from './Components/Footer';
import UploadImage from './Components/Upload';
import LandingPage from './Components/Landing';
import Navbar from './Components/Navbar';
import RegisterComponent from './Components/Register';
import FileChat from './Components/Filechat';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <UploadImage />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/filechat" element={<FileChat />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
