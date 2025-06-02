import YouTubeSearch from "./components/youtubeVideos.jsx";
import "./style/main.css";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Application de recherche de mail Youtube</h1>
        <p>Trouvez facilement les contacts des créateurs YouTube</p>
      </header>
      <main>
        <YouTubeSearch />
      </main>
      <footer>
        <p>By Wyterrr / Ywen Piret - 2025 - Version 1.0</p>
        <p>
          <a
            href="https://github.com/Wyterrr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>{" "}
          •
          <a
            href="https://www.linkedin.com/in/ywenpiret"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
