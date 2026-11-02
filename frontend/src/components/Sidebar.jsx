
import {
  FlaskConical,
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut
} from "lucide-react";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "orders", label: "Laboratory Tests", icon: ClipboardList }
];

export default function Sidebar({ page, setPage, username, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark small">
          <FlaskConical />
        </div>

        <div>
          <b>LabCare</b>
          <small>LAB MANAGEMENT</small>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      {navigation.map(item => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}

      <div className="sidebar-bottom">
        <div className="user-chip">
          <FlaskConical size={18} />
          <span>
            <b>{username}</b>
            <small>Signed in</small>
          </span>
        </div>

        <button className="nav-item" onClick={onLogout}>
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
