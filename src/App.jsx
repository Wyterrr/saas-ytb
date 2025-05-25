import YouTubeSearch from './components/youtubeVideos.jsx';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f1f1f1' }}>
        <h1>Application de recherche de mail Youtube</h1>
        <p>By Wyterrr</p>
      </header>
      <div style={{ flex: '1' }}>
        <YouTubeSearch />
      </div>
      <footer style={{ textAlign: 'center', backgroundColor: '#f1f1f1' }}>
        <p>By Wyterrr / Ywen Piret - 2025 - Version 1.0</p>
        <p>Github: <a href="https://github.com/Wyterrr" target="_blank" rel="noopener noreferrer">Wyterrr</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/ywenpiret" target="_blank" rel="noopener noreferrer">Ywen Piret</a></p>
      </footer>
    </div>
  );
}

export default App  
