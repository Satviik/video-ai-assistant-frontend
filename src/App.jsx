import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";

function App() {
  const [videoId, setVideoId] = useState(null);
  const [videoSource, setVideoSource] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              videoId={videoId}
              setVideoId={setVideoId}
              videoSource={videoSource}
              setVideoSource={setVideoSource}
            />
          }
        />

        <Route
          path="/analytics"
          element={
            <Analytics
              videoId={videoId}
              videoSource={videoSource}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;