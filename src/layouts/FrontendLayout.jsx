// src/layouts/FrontendLayout.jsx
import HeaderBar from "@/components/HeaderBar.jsx";
import Footer from "@/components/Footer.jsx";
import ChatWidget from "@/components/AiChatLauncher.jsx";
import { Outlet, useLocation } from "react-router-dom";

export default function FrontendLayout() {
    const location = useLocation();
    const hideHeaderRoutes = ["/login", "/vnpay-return"];

    const hideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {!hideHeader && <HeaderBar />}
            <Outlet />
            <ChatWidget />
            {!hideHeader && <Footer />}
        </>
    );
}
