import { Route, Routes } from "react-router-dom";
import FrontendLayout from "@/layouts/FrontendLayout.jsx";

import Home from "@/pages/Home.jsx";
import Login from "@/components/Login.jsx";
import NotFound from "@/pages/NotFound.jsx";
import UserList from "@/pages/UserList.jsx";
import VnpayReturn from "@/pages/VnpayReturn.jsx";
import BookingPage from "@/pages/BookingPage.jsx";
import ShowTime from "@/pages/ShowTime.jsx";
import Movies from "@/pages/Movies.jsx";
import Theaters from "@/pages/Theaters.jsx";
import TicketPrice from "@/pages/TicketPrice.jsx";
import Coupons from "@/pages/Coupons.jsx";
import { MovieDetail } from "@/pages/MovieDetail.jsx";

// Admin
import AdminLayout from "@/layouts/AdminLayout.jsx";
import MovieCMS from "@/pages/admin/MovieCMS.jsx";
import TheaterCMS from "@/pages/admin/TheaterCMS.jsx";
import RequireAdmin from "@/components/admin/RequireAdmin.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AdminLogin from "@/components/admin/AdminLogin.jsx";

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
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/vnpay-return" element={<VnpayReturn />} />
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin (Protected) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="movies" element={<MovieCMS />} />
                    <Route path="theaters" element={<TheaterCMS />} />
                </Route>
            </Route>
        </Routes>
    );
}
