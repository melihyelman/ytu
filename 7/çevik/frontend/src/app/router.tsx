import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AdminRoute from "../features/auth/components/AdminRoute";
import AdminPanel from "./routes/AdminPanel";
import AdminUsersPage from "./routes/AdminUsersPage";
import Layout from "../components/layout/Layout";
import MessagePage from "./routes/MessagePage";
import AnnouncementsPage from "./routes/AnnouncementsPage";
import UserAnnouncementsPage from "./routes/UserAnnouncementsPage";
import ClubPage from "./routes/ClubPage";
import AdminClubsPage from "./routes/AdminClubsPage";
import ClubManagementPage from "./routes/ClubManagementPage";
import PublicEventsPage from "./routes/PublicEventsPage";
import AdminEventsPage from "./routes/AdminEventsPage";
import EventProfilePage from "./routes/EventProfilePage";
import ClubProfilePage from "./routes/ClubProfilePage";
import UserProfilePage from "./routes/UserProfilePage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {/* Home artık Layout içinde -> Navbar/Footer görünür */}
                    <Route index element={<HomePage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/announcements"
                        element={
                            <ProtectedRoute>
                                <UserAnnouncementsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clubs"
                        element={
                            <ClubPage />
                        }
                    />
                    <Route
                        path="/clubs/:id"
                        element={
                                <ClubProfilePage />
                        }
                    />
                    <Route
                        path="/club-management"
                        element={
                        <ProtectedRoute>
                            <ClubManagementPage />
                        </ProtectedRoute>
                        }
                    />
                    <Route path="/events" element={<PublicEventsPage />} />
                    <Route path="/events/:id" element={<EventProfilePage />} />
                    <Route
                        path="/users/:id"
                        element={
                            <ProtectedRoute>
                                <UserProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                        <Route path="/admin/clubs" element={<AdminClubsPage />} />
                        <Route path="/admin/events" element={<AdminEventsPage />} />
                        <Route path="/messages" element={<MessagePage />} />
                        <Route path="/admin/announcements" element={<AnnouncementsPage />} />
                    </Route>
                </Route>

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
