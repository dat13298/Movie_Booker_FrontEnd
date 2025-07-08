import { Route, Routes, useLocation } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Example from "@/pages/Example.jsx";
import Login from "@/components/Login.jsx";
import NotFound from "@/pages/NotFound.jsx";
import HeaderBar from "@/components/HeaderBar.jsx";
import UserList from "@/pages/UserList.jsx";
import VnpayReturn from "@/pages/VnpayReturn.jsx";
import Footer from "@/components/Footer.jsx";
import BookingPage from "@/pages/BookingPage.jsx";
import ChatWidget from "@/components/AiChatLauncher.jsx";
import ShowTime from "@/pages/ShowTime.jsx";
import Movies from "@/pages/Movies.jsx";
import Theaters from "@/pages/Theaters.jsx";
import TicketPrice from "@/pages/TicketPrice.jsx";
import Coupons from "@/pages/Coupons.jsx";
import { MovieDetail } from "@/pages/MovieDetail.jsx";
import FrontendLayout from "@/layouts/FrontendLayout.jsx";
import MovieDetailMobile from "@/pages/MovieDetailMobile.jsx";



// Admin
import AdminLayout from "@/layouts/AdminLayout.jsx";
import MovieCMS from "@/pages/admin/MovieCMS.jsx";
import TheaterCMS from "@/pages/admin/TheaterCMS.jsx";
import RequireAdmin from "@/components/admin/RequireAdmin.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AdminLogin from "@/components/admin/AdminLogin.jsx";
import SeatMapPage from "@/pages/SeatMapPage.jsx";
import About from "@/pages/About.jsx";
import Contact from "@/pages/contacts.jsx";
import Faqs from "./pages/FAQs.jsx";
import {RegionsCMS} from "@/pages/admin/RegionsCMS.jsx";
import {ShowTimeCMS} from "@/pages/admin/ShowTimeCMS.jsx";
import {ScreenCMS} from "@/pages/admin/ScreenCMS.jsx";

export default function App() {
    return (
        <Routes>
            {/* Frontend layout */}
                <Route element={<FrontendLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/booking/:slug" element={<BookingPage />} />
                <Route path="/show-time" element={<ShowTime />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/theaters" element={<Theaters />} />
                <Route path="/ticket-price" element={<TicketPrice />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faqs />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/vnpay-return" element={<VnpayReturn />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/show-time/:id/booking" element={<SeatMapPage />} />
                <Route path="/movie/:id" element={<MovieDetailMobile />} />
                </Route>

            {/* Admin (Protected) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="movies" element={<MovieCMS />} />
                    <Route path="theaters" element={<TheaterCMS />} />
                    <Route path="screens" element={<ScreenCMS />} />
                    <Route path="show-times" element={<ShowTimeCMS />} />
                    <Route path="regions" element={<RegionsCMS />} />
                </Route>
            </Route>
        </Routes>
    );
}
