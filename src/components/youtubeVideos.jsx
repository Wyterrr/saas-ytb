import React, { useState, useEffect } from "react"
import '../style/main.css'
import axios from "axios";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [channelDescriptions, setChannelDescriptions] = useState({});
  const [showOnlyWithEmail, setShowOnlyWithEmail] = useState(false);

  const searchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&relevanceLanguage=fr&key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }`
      );
      setVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching videos: ", error);
      setError(error.message);
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

  return (
    <div className="youtube-search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des vidéos"
        />
        <button type="submit">Rechercher</button>
      </form>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showOnlyWithEmail}
            onChange={handleCheckboxChange}
          />
          Afficher uniquement les vidéos avec une adresse e-mail
        </label>
      </div>
      {error && <div>Error: {error}</div>}
      <div>
        {videos.map((video) => {
          const emails = channelDescriptions[video.snippet.channelId]
            ? extractEmails(channelDescriptions[video.snippet.channelId])
            : [];

          if (!showOnlyWithEmail || emails.length > 0) {
            return (
              <div
                key={video.id.videoId}
                className="video-card"
              >
                <h2>{video.snippet.channelTitle}</h2>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt="miniature"
                  />
                </a>
                <div>
                  <h3>Description de la Chaîne</h3>
                  <p>
                    {channelDescriptions[video.snippet.channelId] ||
                      "Email non disponible"}
                  </p>
                  {emails.length > 0 && (
                    <>
                      <h3>Adresses E-mail</h3>
                      <ul>
                        {emails.map((email, index) => (
                          <li key={index}>
                            <a
                              href={`mailto:${email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {email}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default YouTubeSearch;
