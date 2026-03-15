import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Videos", path: "/videos" },
  { name: "Analytics", path: "/analytics" },
  { name: "Settings", path: "/settings" },
  { name: "More Tools", path: "/tools" }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="flex flex-col bg-slate-950 border-r border-slate-800 w-60 md:w-64 shrink-0 h-full">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
            AI
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-50">
              AI Studio
            </div>
            <div className="text-xs text-slate-400">Video Assistant</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50"
              }`}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80 text-[11px] text-slate-300">
                {item.name[0]}
              </span>

              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
        Powered by AI Video Assistant
      </div>
    </aside>
  );
};

export default Sidebar;