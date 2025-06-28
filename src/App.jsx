import { Route, Routes, useLocation } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Example from "@/pages/Example.jsx";
import Login from "@/components/Login.jsx";
import NotFound from "@/pages/NotFound.jsx";
import HeaderBar from "@/components/HeaderBar.jsx";
import UserList from "@/pages/UserList.jsx";
import TestPaymentPage from "@/pages/TestPaymentPage.jsx";
import VnpayReturn from "@/pages/VnpayReturn.jsx";
import Footer from "@/components/Footer.jsx";
import BookingPage from "@/pages/BookingPage.jsx";
import ChatWidget from "@/components/AiChatLauncher.jsx";

export default function App() {
    const location = useLocation();
    const hideHeaderRoutes = ["/login","/vnpay-return"];

    return (
        <>
            {/*<Example/>*/}
            {/*<TestPaymentPage />*/}
            {!hideHeaderRoutes.includes(location.pathname) && <HeaderBar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/exmaple" element={<Example />} />
                <Route path="/login" element={<Login />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/vnpay-return" element={<VnpayReturn />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/booking/:slug" element={<BookingPage />} />
            </Routes>
            <ChatWidget/>
            {!hideHeaderRoutes.includes(location.pathname) && <Footer />}
        </>
    );
}
