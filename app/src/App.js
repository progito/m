import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PhoneInput from './components/Login/PhoneInput';
import VerifyCode from './components/Login/VerifyCode';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<PhoneInput />} />
                    <Route path="/verify-code" element={<VerifyCode />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
