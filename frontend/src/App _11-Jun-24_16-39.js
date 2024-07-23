import {BrowserRouter, Routes, Route } from 'react-router-dom'

//pages and components
import Home from './pages/Home';
import Navbar from'./components/Navbar';
import ItemDetails from './pages/ItemDetails'; 

/*
import Orders from'./components/Orders'
import invoice from'./components/Orders'
import PO from'./components/PO'
import CostPrice from'./components/CostPrice'
import Utility from'./components/Utily'
import Orders from'./components/Orders'
*/

function App() {
  return (
    <div className="mainScreen">
      <BrowserRouter>
          <Navbar />  
          <div className="leftWindow">
            <p>Utility Box Content. This is a afsjkkjhfsjklsdaklfhfhfhdfskjfd  hasdjl f afhjlf jhjl sdlkj fdhj  fajh aflkjf fds sdf jk fdsj fdhfjaf la fdj hfshjf dslks djfsda fsdhjla kjlhafhfsa fhjsasldkjhnbfd a hfdjhklasfdkjlnbhsdafdkjfswdkjf dhlkaf dskljab  f sdhjklafdskjbnf </p>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="item-details/:sku" element = {<ItemDetails />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
