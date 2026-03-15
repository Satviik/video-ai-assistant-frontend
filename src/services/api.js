const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.detail) {
        message = Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg || d).join(", ")
          : data.detail;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append("file", file);

  // Backend route is mounted as APIRouter(prefix="/upload") with @router.post("/")
  // which resolves to "/upload/". Call that path directly to avoid 307 redirects.
  const response = await fetch(`${BASE_URL}/upload/`, {
    method: "POST",
    body: formData
  });

  return handleResponse(response);
}

export async function askQuestion(videoId, question) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      video_id: videoId,
      question
    })
  });

  return handleResponse(response);
}

export async function getTranscript(videoId) {
  const response = await fetch(`${BASE_URL}/transcript/${encodeURIComponent(
    videoId
  )}`);
  return handleResponse(response);
}

export async function getAnalytics(videoId) {
  const response = await fetch(`${BASE_URL}/analytics/${encodeURIComponent(
    videoId
  )}`);
  return handleResponse(response);
}
