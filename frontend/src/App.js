
import {BrowserRouter, Routes, Route } from 'react-router-dom'

//pages and components
import Logobar from './components/Logobar';
import ItemMgmt from './pages/item/itemManagement';

/*
import Orders from'./components/Orders'
import invoice from'./components/Orders'
import PO from'./components/PO'
import CostPrice from'./components/CostPrice'
import Utility from'./components/Utily'
import Orders from'./components/Orders'
<< 1  2  3  ...>>  SKIP __ 

*/

function App() {
  return (
    <div className="mainScreen">
      <BrowserRouter>
          <Logobar />
          <Routes>
            <Route path="/" element={<ItemMgmt />} />
          </Routes>
          
      </BrowserRouter>
    </div>
  );
}
export default App;
