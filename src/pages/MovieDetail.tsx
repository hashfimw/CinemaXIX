import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeartIcon, BookmarkIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { useMovies } from "../context/MoviesContext";
import { useAuth } from "../context/AuthContext";
import { getImageUrl, rateMovie } from "../api/tmdbApi";
import LoginPopup from "../components/common/LoginPopup";
import LoadingSpinner from "@/components/common/Loading";

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    state,
    fetchMovieDetails,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useMovies();
  const { authState, login } = useAuth();
  const { currentMovie, loading, error } = state;
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    type: "watchlist" | "favorite" | "rating";
    value?: number;
  } | null>(null);

  const [isLoadingFilm, setIsLoadingFilm] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoadingFilm(true);

    if (id) {
      fetchMovieDetails(id);
    }
  }, [id]);
  useEffect(() => {
    if (!loading && currentMovie) {
      setIsLoadingFilm(false);
    }
  }, [loading, currentMovie]);

  useEffect(() => {
    if (currentMovie && id && currentMovie.id.toString() !== id) {
      setIsLoadingFilm(true);
    }
  }, [currentMovie, id]);

  const movieInWatchlist = currentMovie
    ? isInWatchlist(currentMovie.id)
    : false;
  const movieInFavorites = currentMovie
    ? isInFavorites(currentMovie.id)
    : false;

  const handleLogin = () => {
    setShowLoginPopup(false);
    login();

    const checkAuthAndExecutePendingAction = setInterval(() => {
      if (authState.isAuthenticated && pendingAction) {
        if (pendingAction.type === "watchlist") {
          executeWatchlistAction();
        } else if (pendingAction.type === "favorite") {
          executeFavoriteAction();
        } else if (pendingAction.type === "rating" && pendingAction.value) {
          executeRatingAction(pendingAction.value);
        }
        setPendingAction(null);
        clearInterval(checkAuthAndExecutePendingAction);
      }
    }, 500);
    setTimeout(() => clearInterval(checkAuthAndExecutePendingAction), 10000);
  };

  const executeWatchlistAction = async () => {
    if (currentMovie) {
      try {
        if (movieInWatchlist) {
          await removeFromWatchlist(currentMovie.id);
        } else {
          await addToWatchlist(currentMovie);
        }
      } catch (error) {
        console.error("Error managing watchlist:", error);
        alert("Gagal mengubah watchlist. Silakan coba lagi.");
      }
    }
  };

  const executeFavoriteAction = async () => {
    if (currentMovie) {
      try {
        if (movieInFavorites) {
          await removeFromFavorites(currentMovie.id);
        } else {
          await addToFavorites(currentMovie);
        }
      } catch (error) {
        console.error("Error managing favorites:", error);
        alert("Gagal mengubah favorit. Silakan coba lagi.");
      }
    }
  };

  const executeRatingAction = async (rating: number) => {
    setUserRating(rating);
    if (currentMovie && authState.sessionId) {
      try {
        await rateMovie(authState.sessionId, currentMovie.id, rating);
        alert(`Anda memberi rating ${rating} bintang untuk film ini!`);
      } catch (error) {
        console.error("Error rating movie:", error);
        alert("Gagal memberikan rating. Silakan coba lagi.");
        setUserRating(null);
      }
    }
  };

  const handleWatchlistClick = async () => {
    if (!authState.isAuthenticated) {
      setLoginMessage(
        movieInWatchlist
          ? "Anda perlu login untuk menghapus film dari watchlist."
          : "Anda perlu login untuk menambahkan film ke watchlist."
      );
      setPendingAction({ type: "watchlist" });
      setShowLoginPopup(true);
      return;
    }

    executeWatchlistAction();
  };

  const handleFavoriteClick = async () => {
    if (!authState.isAuthenticated) {
      setLoginMessage(
        movieInFavorites
          ? "Anda perlu login untuk menghapus film dari favorit."
          : "Anda perlu login untuk menambahkan film ke favorit."
      );
      setPendingAction({ type: "favorite" });
      setShowLoginPopup(true);
      return;
    }

    executeFavoriteAction();
  };

  const handleRateMovie = async (rating: number) => {
    if (!authState.isAuthenticated) {
      setLoginMessage("Anda perlu login untuk memberikan rating.");
      setPendingAction({ type: "rating", value: rating });
      setShowLoginPopup(true);
      return;
    }

    executeRatingAction(rating);
  };

  if (isLoadingFilm) {
    return <LoadingSpinner fullHeight />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => id && fetchMovieDetails(id)}
          className="btn btn-primary"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="text-center py-10">
        <p>Film tidak ditemukan</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${getImageUrl(
              currentMovie.backdrop_path,
              "original"
            )})`,
            filter: "brightness(0.4)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-8 flex items-end w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <img
              src={getImageUrl(currentMovie.poster_path, "w342")}
              alt={currentMovie.title}
              className="w-32 md:w-48 rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder-poster.jpg";
              }}
            />

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {currentMovie.title}{" "}
                <span className="text-white/70">
                  ({currentMovie.release_date.substring(0, 4)})
                </span>
              </h1>
              {currentMovie.tagline && (
                <p className="text-white/80 italic mb-4">
                  {currentMovie.tagline}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentMovie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-tmdb-blue/20 rounded-full text-white text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center">
                  <StarIconSolid className="w-6 h-6 text-yellow-400 mr-1" />
                  <span className="text-white font-bold">
                    {currentMovie.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-white/60">|</span>
                <span className="text-white">
                  {formatRuntime(currentMovie.runtime)}
                </span>
                <span className="text-white/60">|</span>
                <span className="text-white">
                  {formatDate(currentMovie.release_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
            <p className="text-white/80 leading-relaxed">
              {currentMovie.overview}
            </p>
          </section>

          {currentMovie.credits &&
            currentMovie.credits.cast &&
            currentMovie.credits.cast.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Pemeran Utama</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentMovie.credits.cast.slice(0, 5).map((person) => (
                    <div
                      key={person.id}
                      className="bg-card-bg rounded-lg overflow-hidden"
                    >
                      <img
                        src={getImageUrl(person.profile_path, "w185")}
                        alt={person.name}
                        className="w-full aspect-[2/3] object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/placeholder-person.jpg";
                        }}
                      />
                      <div className="p-2">
                        <p className="font-semibold text-sm">{person.name}</p>
                        <p className="text-white/70 text-xs">
                          {person.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </div>

        <div>
          <div className="bg-card-bg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Aksi Pengguna</h3>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-white mb-2">Rating</p>
                <div
                  className="flex items-center gap-1"
                  onMouseLeave={() => setIsRatingHovered(false)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => {
                        setIsRatingHovered(true);
                        setHoveredRating(star);
                      }}
                      onClick={() => handleRateMovie(star)}
                      className="focus:outline-none"
                    >
                      {(
                        isRatingHovered
                          ? star <= hoveredRating
                          : star <= (userRating || 0)
                      ) ? (
                        <StarIconSolid className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-8 h-8 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleWatchlistClick}
                  className="btn btn-secondary flex items-center justify-center gap-2"
                >
                  {movieInWatchlist ? (
                    <>
                      <BookmarkIconSolid className="w-5 h-5 text-tmdb-blue" />
                      <span>Hapus dari Watchlist</span>
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="w-5 h-5" />
                      <span>Tambahkan ke Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleFavoriteClick}
                  className="btn btn-secondary flex items-center justify-center gap-2"
                >
                  {movieInFavorites ? (
                    <>
                      <HeartIconSolid className="w-5 h-5 text-red-500" />
                      <span>Hapus dari Favorit</span>
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      <span>Tambahkan ke Favorit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card-bg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Informasi</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white/70">Status</h4>
                <p>{currentMovie.status}</p>
              </div>

              <div>
                <h4 className="font-semibold text-white/70">Anggaran</h4>
                <p>
                  {currentMovie.budget
                    ? `${currentMovie.budget.toLocaleString()}`
                    : "Tidak tersedia"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white/70">Pendapatan</h4>
                <p>
                  {currentMovie.revenue
                    ? `${currentMovie.revenue.toLocaleString()}`
                    : "Tidak tersedia"}
                </p>
              </div>

              {currentMovie.production_companies &&
                currentMovie.production_companies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white/70">
                      Perusahaan Produksi
                    </h4>
                    <div className="mt-2 space-y-2">
                      {currentMovie.production_companies
                        .slice(0, 3)
                        .map((company) => (
                          <div
                            key={company.id}
                            className="flex items-center gap-2"
                          >
                            {company.logo_path ? (
                              <img
                                src={getImageUrl(company.logo_path, "w92")}
                                alt={company.name}
                                className="h-6 object-contain"
                              />
                            ) : null}
                            <span>{company.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLogin}
          message={loginMessage}
        />
      )}
    </div>
  );
};

export default MovieDetail;
