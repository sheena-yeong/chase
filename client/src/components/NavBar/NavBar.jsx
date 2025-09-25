import { NavLink } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);
  const baseClass =
    "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors";
  const activeClass = "bg-white text-black";
  const inactiveClass = "text-black hover:bg-[#fff9d6]";

  return (
    <div className="flex gap-1 bg-[#e8f2ff] pt-3 pl-3 text-sm">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? activeClass : inactiveClass
          } flex items-center`
        }
      >
        Board
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive }) =>
          `${baseClass} ${
            isActive ? activeClass : inactiveClass
          } flex items-center`
        }
      >
        Slack Directory
      </NavLink>
      <Menu as="div" className="ml-auto relative pb-1 px-4">
        <MenuButton
          className=" mx-1 flex items-center bg-orange-300 text-black rounded-full hover:bg-orange-400 transition-colors"
          onClick={() => setOpen(!open)}
        >
          Actions
          {open ? (
            <FiChevronUp className="h-4 w-4" />
          ) : (
            <FiChevronDown className="h-4 w-4" />
          )}
        </MenuButton>
        <MenuItems className="absolute right-3 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-10">
          <MenuItem>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
              onClick={() => console.log("Send Summary")}
            >
              Send Summary
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
              onClick={() => console.log("Chase All")}
            >
              Chase All
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}

export default NavBar;
