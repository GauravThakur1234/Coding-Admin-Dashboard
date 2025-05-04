"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { useTheme } from "./hooks/useTheme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState("dashboard");
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

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
       
          <div className="flex flex-1">
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}