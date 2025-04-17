import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapSigns,
  faListAlt,
  faGavel,
  faSignOutAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ onMenuClick }) => {
  const [active, setActive] = useState("zoningSearch");

  const handleClick = (menu) => {
    setActive(menu);
    onMenuClick(menu);
  };

  return (
    <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 min-h-screen shadow-2xl rounded-r-3xl backdrop-blur-lg">
      <h3 className="text-2xl font-bold mb-8 text-gray-200 tracking-wide text-center">
        User Dashboard
      </h3>

      <ul className="space-y-3">
        <SidebarItem
          icon={faSearch}
          text="Property Details Search"
          active={active === "zoningSearch"}
          onClick={() => handleClick("zoningSearch")}
        />
        <SidebarItem
          icon={faMapSigns}
          text="Property Data Entry"
          active={active === "zoningData"}
          onClick={() => handleClick("zoningData")}
        />
        <SidebarItem
          icon={faListAlt}
          text="Zoning Codes"
          active={active === "viewRules"}
          onClick={() => handleClick("viewRules")}
        />
        <SidebarItem
          icon={faGavel}
          text="Zoning Rules"
          active={active === "zoningRules"}
          onClick={() => handleClick("zoningRules")}
        />

        <li
          onClick={() => handleClick("logout")}
          className="flex items-center p-3 cursor-pointer bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition transform hover:scale-105 duration-300 shadow-lg active:scale-95 focus:ring-2 focus:ring-red-400"
          role="button"
          tabIndex="0"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
          Logout
        </li>
      </ul>
    </div>
  );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ icon, text, active, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 cursor-pointer rounded-lg transition transform duration-300 
      ${
        active
          ? "bg-blue-500 text-white shadow-md scale-105 ring-2 ring-blue-400"
          : "text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105"
      } focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95`}
    role="button"
    tabIndex="0"
  >
    <FontAwesomeIcon icon={icon} className="mr-3 text-lg" />
    {text}
  </li>
);

export default Sidebar;
