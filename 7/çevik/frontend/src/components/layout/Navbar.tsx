// src/components/layout/Navbar.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthUser, useSignOut } from "../../features/auth/hooks/useAuth";
import { isAdmin } from "../../features/auth/utils/isAdmin";
import { useManagedClubs } from "../../features/club/hooks/useClub";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: me, isLoading } = useAuthUser();
  const { data: managedClubs, isLoading: loadingManaged } = useManagedClubs(!!me);
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);

  const hasClubAccess = managedClubs && managedClubs.length > 0;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut.mutate(undefined, { onSuccess: () => navigate("/", { replace: true }) });
  };

  return (
    <header className="border-b">
      <nav className="w-full flex items-center min-h-[72px] px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="cursor-pointer font-bold text-2xl md:text-3xl" onClick={() => navigate("/")}>
            Cengavers
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          {/* Public navigation - always visible */}
          <button
            onClick={() => navigate("/events")}
            className={`px-4 py-2 rounded-lg transition ${
              isActive("/events")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Etkinlikler
          </button>

          <button
            onClick={() => navigate("/clubs")}
            className={`px-4 py-2 rounded-lg transition ${
              isActive("/clubs")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Kulüpler
          </button>

          {isLoading ? (
            <div className="w-24 h-6 bg-gray-300 animate-pulse rounded" />
          ) : me ? (
            <>
              {hasClubAccess && (
                <button
                  onClick={() => navigate("/club-management")}
                  className={`px-4 py-2 rounded-lg transition ${
                    isActive("/club-management") 
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Kulüp Yönetimi
                </button>
              )}
              <button
                onClick={() => navigate("/announcements")}
                className={`px-4 py-2 rounded-lg transition ${
                  isActive("/announcements")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Duyurular
              </button>

              {isAdmin(me) && (
                <button
                  onClick={() => navigate("/admin")}
                  className={`px-4 py-2 rounded-lg transition ${
                    isActive("/admin")
                      ? "bg-gray-900 text-white ring-2 ring-blue-500"
                      : "bg-gray-900 text-white hover:bg-black"
                  }`}
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => navigate(`/users/${me.id}`)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{me.username}</span>
              </button>

              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="hover:underline">
                Giriş Yap
              </button>
              <button onClick={() => navigate("/register")} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } border-t`}
      >
        <div className="px-4 sm:px-6 py-3 flex flex-col gap-3">
          {/* Public mobile navigation */}
          <button
            onClick={() => {
              setOpen(false);
              navigate("/events");
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              isActive("/events")
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Etkinlikler
          </button>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/clubs");
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              isActive("/clubs")
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Kulüpler
          </button>

          {isLoading ? (
            <div className="w-24 h-6 bg-gray-300 animate-pulse rounded" />
          ) : me ? (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate(`/users/${me.id}`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 mb-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{me.username}</span>
              </button>

              {hasClubAccess && (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/club-management");
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    isActive("/club-management")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Kulüp Yönetimi
                </button>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/announcements");
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  isActive("/announcements")
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Duyurular
              </button>

              {isAdmin(me) && (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/admin");
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    isActive("/admin")
                      ? "bg-gray-900 text-white ring-2 ring-blue-500"
                      : "bg-gray-900 text-white hover:bg-black"
                  }`}
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/register");
                }}
                className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
