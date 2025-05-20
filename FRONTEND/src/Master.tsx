import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Master = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative bg-teal-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black z-30 lg:hidden opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 ml-0 lg:ml-64 p-6 w-full transition-all duration-300">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-teal-600 text-2xl"
          >
            ☰
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Master;
