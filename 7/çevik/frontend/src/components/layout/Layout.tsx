import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";


export default function Layout() {
    const { pathname } = useLocation();
    const transparent = pathname === "/";

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />

        </div>
    );
}