import { NavLink } from "react-router-dom";

function NavBar() {
  const baseClass =
    "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors";
  const activeClass = "bg-white text-black";
  const inactiveClass = "text-black hover:bg-[#fff9d6]";

  return (
    <div className="flex gap-1 bg-[#e8f2ff] pt-3 pl-3">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Board
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Slack Directory
      </NavLink>
    </div>
  );
}

export default NavBar;
