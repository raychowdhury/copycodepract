import { useState } from "react"

const MovieCard = ({ movie, onSelect }) => {
  const { title, poster_path, vote_average, release_date, original_language } =
    movie || {}
  const [imgError, setImgError] = useState(false)
  const posterUrl =
    !imgError && poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : "/no-image-available.png"
  const rating =
    typeof vote_average === "number"
      ? `${vote_average.toFixed(1)}/10`
      : "N/A"
  const isClickable = typeof onSelect === "function"

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true)
    }
  }

  return (
    <li className="movie-card">
      <button
        type="button"
        className={`w-full text-left bg-transparent border-0 p-0 ${
          isClickable ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={isClickable ? () => onSelect(movie) : undefined}
        disabled={!isClickable}
        aria-label={title ? `Open details for ${title}` : "Open movie details"}
      >
        <img
          src={posterUrl}
          alt={title || "Movie poster"}
          onError={imgError ? undefined : handleImageError}
        />
        <div className="mt-4">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="/star.svg" alt="rating" />
              <p>{rating}</p>
            </div>
            <span>.</span>
            <p className="lang">{original_language?.toUpperCase() || "N/A"}</p>
            <span>.</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </button>
    </li>
  )
}

export default MovieCard
