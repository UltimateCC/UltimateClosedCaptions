import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/';
import Dashboard from './pages/Dashboard/';
import Thanks from './pages/Thanks';
import Channels from './pages/Channels';
import Verify from './components/Verify';
import Error from './pages/Error';

import PageTitle from './components/PageTitle';
import Logout from './components/Logout';
import AppFooter from './components/AppFooter';
import Navigation from './components/Navigation';

import './webroot/style/colors.css';
import './webroot/style/main.css';
import './webroot/style/font.css';

import LogoImg from './assets/logo.png';
import { AuthProvider } from './context/AuthContext';
import Privacy from './pages/Privacy';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <PageTitle />
                <div className='mainContainer'>
                    <div className='contentContainer'>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/thanks" element={<Thanks />} />
                            <Route path="/channels" element={<Channels />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="*" element={<Error />} />
                        </Routes>
                        <AppFooter />
                    </div>
                    <Navigation logo={LogoImg}/>
                </div>
            </AuthProvider>
        </Router>
    </React.StrictMode>
);
