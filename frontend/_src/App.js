import {BrowserRouter, Routes, Route } from 'react-router-dom'

//pages and components
import itemsMain from './pages/itemsMain';
import Navbar from'./components/Navbar';

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
          <Navbar />
          <div className="leftSidebar">
            <p>Utility Box Content. This is a afsjkkjhfsjklsdaklfhfhfhdfskjfd  hasdjl f afhjlf jhjl sdlkj fdhj  fajh aflkjf fds sdf jk fdsj fdhfjaf la fdj hfshjf dslks djfsda fsdhjla kjlhafhfsa fhjsasldkjhnbfd a hfdjhklasfdkjlnbhsdafdkjfswdkjf dhlkaf dskljab  f sdhjklafdskjbnf </p>
            </div>
          <Routes>
            <Route path="/" element={<itemsMain />} />
            {/*<Route path="item-details/:sku" element = {<ItemDetails />} />*/}
          </Routes>
          
      </BrowserRouter>
    </div>
  );
}

export default App;
