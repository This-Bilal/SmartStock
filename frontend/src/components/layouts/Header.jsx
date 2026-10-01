import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  checkLoginStatus,
  logoutEmployee,
  logoutOwner,
} from "../../services/authService";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  // Check login status
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const status = await checkLoginStatus();
        setLoggedIn(status);

        if (status) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setUser(storedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        setLoggedIn(false);
        setUser(null);
      }
    };

    verifyLogin();
  }, [location.pathname]);

  // Logout
  const handleLogout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) return;

      if (storedUser.role === "owner") {
        await logoutOwner();
      } else if (["manager", "cashier"].includes(storedUser.role)) {
        await logoutEmployee();
      }

      localStorage.removeItem("user");
      setUser(null);
      setLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Determine homepage based on user role
  const getHomeRoute = () => {
    if (!user) return "/";
    if (user.role === "owner") return "/ownerhomepage";
    if (user.role === "manager") return "/managerhomepage";
    if (user.role === "cashier") return "/cashierhomepage";

    return "/";
  };

  return (
    <header className="w-full bg-red-100 shadow">
      <nav>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5">
          {/* LOGO */}
          <Link to={getHomeRoute()} className="shrink-0">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-red-700 sm:text-2xl">
                S
              </span>
              <img
                src="/UntitledDesign.png"
                alt="smart-stock logo"
                className="h-8 -ml-1 sm:h-9 md:h-10"
              />
              <span className="text-xl font-semibold text-red-700 sm:text-2xl">
                artStock
              </span>
              <span className="ml-1 mt-2 hidden whitespace-nowrap text-[10px] sm:block md:text-xs">
                making business easier...
              </span>
            </div>
          </Link>

          {/* RIGHT SIDE */}
          {!isAuthPage && (
            <div className="relative">
              {loggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-red-700 transition-all duration-300 hover:bg-red-200"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
                  <Link
                    to="/login"
                    className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs transition-all duration-300 hover:bg-red-200 sm:px-3 sm:py-2 sm:text-sm md:px-4"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs text-white transition-all duration-300 hover:bg-red-600 sm:px-3 sm:py-2 sm:text-sm md:px-4"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
