import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import ReactDOM from 'react-dom/client';

import LogonScr from './pages/logon/logonBlackPink'; // Import the logon screen

function Logon() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LogonScr />} />
            </Routes>
        </BrowserRouter>
    )
};

export default Logon;