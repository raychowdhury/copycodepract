const MovieCard = ({ movie : { title, poster_path, vote_average, release_date, original_language} }) => {
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/no-image-available.png"
  const rating =
    typeof vote_average === "number"
      ? `${vote_average.toFixed(1)}/10`
      : "N/A"

  return (
    <li className="movie-card">
      <img src={posterUrl} alt={title || "Movie poster"} />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="rating" />
            <p>{vote_average ? `${vote_average.toFixed(1)}/10` : "N/A"}</p>

          </div>
          <span>.</span>
          <p className="lang">{original_language?.toUpperCase() || "N/A"}</p>
          <span>.</span>
          <p className="year">{release_date ? release_date.split("-")[0] : "N/A"}</p>
        </div>
      </div>
    </li>
  )
}

export default MovieCard
