
import { RefreshCw } from "lucide-react";

export default function Header({ title, username, onRefresh, loading }) {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">LABORATORY OPERATIONS</div>
        <h2>{title}</h2>
      </div>

      <div className="top-actions">
        <span className="live">
          <i />
          {loading ? "Refreshing..." : "System connected"}
        </span>

        <button
          className="icon-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data"
        >
          <RefreshCw size={17} />
        </button>

        <div className="avatar">
          {username?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
