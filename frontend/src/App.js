import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import AvilaBeachPage from "main/pages/Towns/AvilaBeachPage";
import LosAlamosPage from "main/pages/Towns/LosAlamosPage";
import ArroyoGrandePage from "main/pages/Towns/ArroyoGrandePage";

import "bootstrap/dist/css/bootstrap.css";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
import HotelIndexPage from "main/pages/Hotels/HotelIndexPage";
import HotelDetailsPage from "main/pages/Hotels/HotelDetailsPage";
import HotelEditPage from "main/pages/Hotels/HotelEditPage";
import HotelCreatePage from "main/pages/Hotels/HotelCreatePage";
import BookCreatePage from "main/pages/Books/BookCreatePage";
//import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
//import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
//import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

function App() {

  const reload = () => window.location.reload();

  return (
    <BrowserRouter basename="/team01-s23-6pm-1">
      <Routes>
        <Route path="/storybook-static" onEnter={reload}/>
        <Route exact path="/" element={<HomePage />} />

        <Route exact path="/towns/AvilaBeach" element={<AvilaBeachPage />} />
        <Route exact path="/towns/LosAlamos" element={<LosAlamosPage />} />
        <Route exact path="/towns/ArroyoGrande" element={<ArroyoGrandePage />} />
        
        <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
        <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
        <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
        <Route exact path="/restaurants/" element={<RestaurantIndexPage />} />

        <Route exact path="/hotels/create" element={<HotelCreatePage />} />
        <Route exact path="/hotels/edit/:id" element={<HotelEditPage />} />
        <Route exact path="/hotels/details/:id" element={<HotelDetailsPage />} />
        <Route exact path="/hotels/" element={<HotelIndexPage />} />

        <Route exact path="/books/create" element={<BookCreatePage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
