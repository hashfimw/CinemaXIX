import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MoviesProvider } from "./context/MoviesContext";
import Header from "./components/common/Header";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <Router>
          <div className="min-h-screen bg-dark-bg text-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
            <footer className="bg-card-bg py-6 mt-12">
              <div className="container mx-auto px-4 text-center text-white/50">
                <p>
                  &copy; {new Date().getFullYear()} Cinema XIX. Dibuat dengan
                  TMDB API.
                </p>
                <p className="mt-2 text-sm">
                  Web ini menggunakan The Movie Database API V4 dan Untuk
                  Authentication menggunakan V3.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </MoviesProvider>
    </AuthProvider>
  );
}

export default App;
