import { useEffect, useRef, useState } from "react"

const ANIMATION_MS = 200

const MovieModal = ({ movie, onClose, isLoading, errorMessage }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [displayMovie, setDisplayMovie] = useState(null)
  const closeTimeoutRef = useRef(null)

  useEffect(() => {
    if (movie) {
      setDisplayMovie(movie)
      setIsOpen(true)
      return
    }

    if (!displayMovie) {
      setIsOpen(false)
      return
    }

    setIsOpen(false)
    closeTimeoutRef.current = setTimeout(() => {
      setDisplayMovie(null)
    }, ANIMATION_MS)

    return () => {
      clearTimeout(closeTimeoutRef.current)
    }
  }, [movie, displayMovie])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!displayMovie) {
    return null
  }

  const posterUrl = displayMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${displayMovie.poster_path}`
    : "/no-image-available.png"
  const backdropUrl = displayMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${displayMovie.backdrop_path}`
    : posterUrl
  const rating =
    typeof displayMovie.vote_average === "number"
      ? `${displayMovie.vote_average.toFixed(1)}/10`
      : "N/A"
  const year = displayMovie.release_date
    ? displayMovie.release_date.split("-")[0]
    : "N/A"
  const language = displayMovie.original_language?.toUpperCase() || "N/A"
  const overview =
    displayMovie.overview?.trim() || "No description available."
  const genres =
    Array.isArray(displayMovie.genres) && displayMovie.genres.length > 0
      ? displayMovie.genres.map((genre) => genre.name).join(", ")
      : "N/A"
  const runtimeMinutes =
    typeof displayMovie.runtime === "number" && displayMovie.runtime > 0
      ? displayMovie.runtime
      : null
  const runtime = runtimeMinutes
    ? runtimeMinutes >= 60
      ? `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`
      : `${runtimeMinutes}m`
    : "N/A"
  const status = displayMovie.status || "N/A"
  const budget =
    typeof displayMovie.budget === "number" && displayMovie.budget > 0
      ? `$${displayMovie.budget.toLocaleString()}`
      : "N/A"
  const revenue =
    typeof displayMovie.revenue === "number" && displayMovie.revenue > 0
      ? `$${displayMovie.revenue.toLocaleString()}`
      : "N/A"
  const homepage = displayMovie.homepage?.trim()

  return (
    <div
      className={`modal-overlay ${isOpen ? "is-open" : ""}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className={`modal-panel ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative">
          <img src={backdropUrl} alt="" className="h-48 w-full object-cover" />
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white hover:bg-black/90"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
          <img
            src={posterUrl}
            alt={displayMovie.title || "Movie poster"}
            className="w-full rounded-lg object-cover"
          />
          <div className="space-y-4">
            <div>
              <h3 id="movie-title" className="text-2xl font-bold">
                {displayMovie.title || "Untitled"}
              </h3>
              {displayMovie.tagline ? (
                <p className="text-light-200">{displayMovie.tagline}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-light-200">
              <span>
                Rating: <span className="text-white">{rating}</span>
              </span>
              <span>
                Year: <span className="text-white">{year}</span>
              </span>
              <span>
                Lang: <span className="text-white">{language}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-light-100">{overview}</p>
            {errorMessage ? (
              <p className="text-sm text-red-400">{errorMessage}</p>
            ) : null}
            {isLoading ? (
              <p className="text-sm text-light-200">Loading details...</p>
            ) : (
              <div className="grid gap-2 text-sm text-light-200">
                <span>
                  Runtime: <span className="text-white">{runtime}</span>
                </span>
                <span>
                  Genres: <span className="text-white">{genres}</span>
                </span>
                <span>
                  Status: <span className="text-white">{status}</span>
                </span>
                <span>
                  Budget: <span className="text-white">{budget}</span>
                </span>
                <span>
                  Revenue: <span className="text-white">{revenue}</span>
                </span>
                {homepage ? (
                  <a
                    href={homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline underline-offset-4"
                  >
                    Official site
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
