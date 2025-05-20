import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaDoorOpen,
  FaTimes,
  FaUserCircle,
  FaEnvelopeOpenText,
  FaDownload
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-100 transition-colors duration-200 text-gray-700";
  const activeLinkClass = "bg-teal-200 font-semibold text-teal-700";

  const navigate = useNavigate();
  const role = localStorage.getItem("esurat_login_role");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("esurat_login_name");
    setUsername(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("esurat_login_token");
    localStorage.removeItem("esurat_login_name");
    localStorage.removeItem("esurat_login_role");
    setUsername(null);
    toast.success("Logout successful!");
    navigate("/");
  };

  return (
        <aside
        className={`fixed top-0 left-0 z-40 bg-white h-full shadow-2xl rounded-r-2xl flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
        >
        <div>
            <div className="px-6 py-6 border-b border-teal-200 flex items-center justify-start gap-3 text-2xl font-extrabold text-teal-600">
            <FaEnvelopeOpenText/> eSurat
            <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-xl text-gray-500 hover:text-teal-600"
            >
                <FaTimes />
            </button>
            </div>

            <nav className="flex flex-col mt-6 px-2 space-y-2">
            {role === "admin" && (
                <>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaHome /> Dashboard
                    </NavLink>

                    <NavLink
                        to="/letters"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaFileAlt /> Letters
                    </NavLink>

                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaCog /> Categories
                    </NavLink>

                    <NavLink
                        to="/downloads"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaDownload /> Downloads
                    </NavLink>

                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaUsers /> Users
                    </NavLink>
                </>
            )}

            {role === "user" && (
                <>
                    <NavLink
                        to="/downloads"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaDownload /> Downloads
                    </NavLink>

                    <NavLink
                        to="/letters"
                        className={({ isActive }) =>
                        isActive ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FaFileAlt /> Letters
                    </NavLink>

                </>
            )}

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-500 hover:bg-red-100 cursor-pointer"
            >
                <FaDoorOpen /> Logout
            </button>
            </nav>
        </div>

        {username && (
            <div className="px-4 py-4 text-sm border-t border-teal-100 text-gray-600 flex items-center gap-2 bg-teal-50 rounded-br-2xl">
            <FaUserCircle className="text-teal-600 text-lg" />
            <span className="truncate">Logged in as: <strong>{username}</strong></span>
            </div>
        )}
        </aside>
    );
};

export default Sidebar;
