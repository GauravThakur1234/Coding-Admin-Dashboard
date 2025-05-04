"use client"
import { useState } from "react";
import Dashboard from "./Dashboardpage";
import Projects from "./Projectspage";
import CommingSoonPage from "./CommingSoonPage";
import GitHub from "./GitHubPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useTheme } from "./hooks/useTheme";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New comment on your project", read: false },
    { id: 2, text: "Maria mentioned you in a comment", read: false },
    { id: 3, text: "Your project was featured", read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Toggle notification read status
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Helper function to determine which component to render based on currentPage
  const renderPage = () => {
    console.log("Current page:", currentPage); // For debugging
    
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "projects":
        return <Projects />;
      case "analytics":
        return <CommingSoonPage title="Analytics Dashboard" />;
      case "repositories":
        return <GitHub />;
      case "settings":
        return <CommingSoonPage title="Settings" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        markAsRead={markAsRead}
      />
      <div className="flex flex-1">
        <Sidebar activePage={currentPage} setActivePage={setCurrentPage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}