import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const API_BASE_URL =
  import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchMovies = async (query ='') => {
    setIsLoading(true);
    setErrorMessage("");
    setIsEmpty(false);

    if (!API_KEY) {
      setIsLoading(false);
      setErrorMessage("Missing TMDB API key. Check your .env.local file.");
      return;
    }

    try {
      const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, "");
      const endpoint = query
        ? `${normalizedBaseUrl}/search/movie?query=${encodeURIComponent(query)}`
        : `${normalizedBaseUrl}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(data.error || "No movies found.");
        setMovieList([]);
        return;
      }

      const results = Array.isArray(data.results) ? data.results : [];
      setMovieList(results);
      setIsEmpty(results.length === 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }; 

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!selectedMovie) {
      setSelectedMovieDetails(null);
      setDetailsError("");
      setIsDetailsLoading(false);
      return;
    }

    if (!API_KEY) {
      setDetailsError("Missing TMDB API key. Check your .env.local file.");
      setIsDetailsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchMovieDetails = async () => {
      setIsDetailsLoading(true);
      setDetailsError("");
      setSelectedMovieDetails(null);

      try {
        const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, "");
        const endpoint = `${normalizedBaseUrl}/movie/${selectedMovie.id}`;
        const response = await fetch(endpoint, {
          ...API_OPTIONS,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        setSelectedMovieDetails(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching movie details:", error);
          setDetailsError("Failed to load movie details.");
        }
      } finally {
        setIsDetailsLoading(false);
      }
    };

    fetchMovieDetails();

    return () => controller.abort();
  }, [selectedMovie]);

  const combinedSelectedMovie = selectedMovieDetails
    ? { ...selectedMovie, ...selectedMovieDetails }
    : selectedMovie;

  return (
    <main
      style={{
        backgroundImage: "url('/BG.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : isEmpty ? (
              <p className="text-light-200">No movies found.</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      <MovieModal
        movie={combinedSelectedMovie}
        isLoading={isDetailsLoading}
        errorMessage={detailsError}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
};

export default App;
