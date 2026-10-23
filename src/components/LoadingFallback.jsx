import "./LoadingFallback.css";

export default function LoadingFallback({ message = "Loading page..." }) {
  return (
    <div className="loading-fallback" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="spinner-container">
          <div className="spinner-ring"></div>
          <div className="spinner-core"></div>
        </div>
        <h3 className="loading-title">{message}</h3>
        <p className="loading-subtitle">Optimizing bundle delivery • Fetching chunk...</p>
        <div className="loading-shimmer-bar">
          <div className="loading-shimmer-progress"></div>
        </div>
      </div>
    </div>
  );
}
