import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import LoginRedirectPage from './components/LoginRedirectPage';
import LogoutRedirectPage from './components/LogoutRedirectPage';
import TsCapLoginPage from './components/TsCapLoginPage';
import TsIronLoginpage from './components/TsIronLoginpage';
import MainPage from '../../z3nterenceseah-fe/src/components/MainPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/logoutpage" element={<LogoutPage />} />
        <Route path="/loginredirectpage" element={<LoginRedirectPage />} />
        <Route path="/logoutredirectpage" element={<LogoutRedirectPage />} />
        <Route path="/tscaploginpage" element={<TsCapLoginPage />} />
        <Route path="/tsironloginpage" element={<TsIronLoginpage />} />
      </Routes>
    </Router>
  );
};

export default App;
