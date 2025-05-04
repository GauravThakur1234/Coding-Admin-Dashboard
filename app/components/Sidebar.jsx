"use client"
import { useState } from "react";
import { LineChart, Code, Github, BarChart4, Share2, Palette, Settings } from "lucide-react";

// Component for the Sidebar
const Sidebar = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  // Navigation menu items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart4 className="h-5 w-5" /> },
    { id: "projects", label: "Projects", icon: <Code className="h-5 w-5" /> },
    { id: "repositories", label: "GitHub", icon: <Github className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <LineChart className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> }
  ];

  // Handle menu item click - directly update the activePage state
  const handleNavigation = (pageId) => {
    console.log("Navigation clicked:", pageId); // For debugging
    setActivePage(pageId);
  };

  return (
    <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
      collapsed ? "w-16" : "w-64"
    } transition-all duration-300 ease-in-out overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 h-6 w-6 rounded-md flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">DevDash</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </div>
      
      <nav className="mt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center w-full ${
                  collapsed ? "justify-center" : "justify-start"
                } px-4 py-3 ${
                  activePage === item.id
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="flex items-center">
                  {item.icon}
                </span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;