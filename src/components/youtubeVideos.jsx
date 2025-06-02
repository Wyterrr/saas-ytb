import React, { useState, useEffect } from "react";
import axios from "axios";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [channelDescriptions, setChannelDescriptions] = useState({});
  const [showOnlyWithEmail, setShowOnlyWithEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchVideos = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setVideos([]);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&relevanceLanguage=fr&key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }`
      );
      setVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching videos: ", error);
      setError(error.response?.data?.error?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannelDescription = async (channelId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }`
      );
      const description = response.data.items[0].snippet.description;
      setChannelDescriptions((prev) => ({ ...prev, [channelId]: description }));
    } catch (error) {
      console.error("Error fetching channel description: ", error);
    }
  };

  useEffect(() => {
    videos.forEach((video) => {
      if (!channelDescriptions[video.snippet.channelId]) {
        fetchChannelDescription(video.snippet.channelId);
      }
    });
  }, [videos]);

  const extractEmails = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    return text.match(emailRegex) || [];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos();
  };

  const handleCheckboxChange = () => {
    setShowOnlyWithEmail(!showOnlyWithEmail);
  };

  // Filtrer les résultats pour ne garder que les vidéos avec email si requis
  const filteredVideos = videos.filter((video) => {
    const emails = channelDescriptions[video.snippet.channelId]
      ? extractEmails(channelDescriptions[video.snippet.channelId])
      : [];
    return !showOnlyWithEmail || emails.length > 0;
  });

  return (
    <div className="youtube-search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des chaînes YouTube"
          aria-label="Recherche"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      <label>
        <input
          type="checkbox"
          checked={showOnlyWithEmail}
          onChange={handleCheckboxChange}
        />
        Afficher uniquement les chaînes avec une adresse e-mail
      </label>

      {isLoading && (
        <div className="loading-state">
          <p>Recherche en cours...</p>
        </div>
      )}

      {error && <div className="error-message">Erreur: {error}</div>}

      {hasSearched && !isLoading && filteredVideos.length === 0 && !error && (
        <div className="no-results">
          <p>
            Aucun résultat trouvé pour "{query}"
            {showOnlyWithEmail ? " avec des adresses e-mail" : ""}.
          </p>
        </div>
      )}

      <div className="video-results">
        {filteredVideos.map((video) => {
          const emails = channelDescriptions[video.snippet.channelId]
            ? extractEmails(channelDescriptions[video.snippet.channelId])
            : [];

          return (
            <div key={video.id.videoId} className="video-card">
              <div className="video-card-header">
                <h2>{video.snippet.channelTitle}</h2>
                {emails.length > 0 && (
                  <span className="email-badge">
                    {emails.length} email{emails.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-thumbnail"
                aria-label={`Voir la vidéo de ${video.snippet.channelTitle}`}
              >
                {" "}
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={`Miniature de ${video.snippet.channelTitle}`}
                />
              </a>

              <div className="video-card-content">
                <div className="video-card-section">
                  <h3>Description de la Chaîne</h3>
                  <p className="channel-description">
                    {channelDescriptions[video.snippet.channelId]
                      ? channelDescriptions[video.snippet.channelId].length >
                        200
                        ? `${channelDescriptions[
                            video.snippet.channelId
                          ].substring(0, 200)}...`
                        : channelDescriptions[video.snippet.channelId]
                      : "Chargement de la description..."}
                  </p>
                </div>

                {emails.length > 0 && (
                  <div className="video-card-section">
                    <h3>Adresses E-mail</h3>
                    <ul className="email-list">
                      {emails.map((email, index) => (
                        <li key={index}>
                          <a
                            href={`mailto:${email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="email-link"
                          >
                            {email}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="video-card-footer">
                  <a
                    href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link"
                  >
                    Voir la chaîne
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YouTubeSearch;
