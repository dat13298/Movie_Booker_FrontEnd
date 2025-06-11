import { Route, Routes, useLocation } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import MovieList from "@/pages/MovieList.jsx"; // ✅ sửa đúng tên component
import Login from "@/pages/Login.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Header from "@/components/Header.jsx";
import UserList from "@/pages/UserList.jsx";

export default function App() {
    const location = useLocation();
    const hideHeaderRoutes = ["/login"];

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname) && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/users" element={<UserList />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
