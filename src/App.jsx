import { Route, Routes, useLocation } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Example from "@/pages/Example.jsx";
import Login from "@/components/Login.jsx";
import NotFound from "@/pages/NotFound.jsx";
import HeaderBar from "@/components/HeaderBar.jsx";
import UserList from "@/pages/UserList.jsx";
import TestPaymentPage from "@/pages/TestPaymentPage.jsx";

export default function App() {
    const location = useLocation();
    const hideHeaderRoutes = ["/login"];

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
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
