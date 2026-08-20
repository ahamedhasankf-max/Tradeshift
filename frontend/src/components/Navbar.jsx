export default function Navbar({ isLoggedIn }) {  // ← ADD THIS PROP
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-4xl font-extrabold">TradeShift</Link>

        <div className="flex items-center space-x-10 text-lg font-semibold">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/buy" className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full font-bold text-xl shadow-xl">
                BUY STOCKS
              </Link>
              <Link to="/portfolio">Portfolio</Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-xl">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}