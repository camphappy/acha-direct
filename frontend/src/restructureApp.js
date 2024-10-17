import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/logon/logonBlackPink';
import Logobar from './components/Logobar';
import ItemMgmt from './pages/item/itemManagement';
//import CustomerOrders from './pages/customerOrders'; // Import the CustomerOrders component

import './styles/itemMgmt.css';           //Item Management screen
import './styles/logon.css';              //This screen

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to handle login
  const handleLogin = () => {
    // Simulate login logic here (e.g., API call, authentication)
    setIsLoggedIn(true); // Update state to logged in
  };

  return (
    <>
    {isLoggedIn ? (
        <BrowserRouter>
            <div className="mainScreen">
            <Logobar />
            <Routes>
                <Route path="/itemMgmt" element={<ItemMgmt />} /> {/* Item Management route */}
             {/*<Route path="/customer-orders" element={<CustomerOrders />} /> {/*Customer orders route */}
            </Routes>
            </div>
        </BrowserRouter>
    ) : (
    // Not logged in, show the Login page
        <Login onLogin={handleLogin} />
          )}
    </>
    );
}

export default App;
