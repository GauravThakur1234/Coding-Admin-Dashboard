"use client"

import { useState } from "react";
import { 
  Moon, 
  Sun, 
  FolderGit2, 
  Bell,
  Settings,
  Palette,
  LogOut
} from "lucide-react";

// Component for the Header section
const Header = ({ theme, toggleTheme, notifications, showNotifications, setShowNotifications }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="flex items-center justify-between p-4 border-b backdrop-blur-md bg-background/80 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <FolderGit2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold ml-2">CodeBase</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-secondary relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border overflow-hidden z-20">
              <div className="p-3 border-b font-medium flex justify-between items-center">
                <span>Notifications</span>
                <button className="text-xs text-primary hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b hover:bg-secondary/50 ${notification.read ? '' : 'bg-primary/5'}`}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center text-sm text-primary hover:underline cursor-pointer">
                View all notifications
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="p-2 rounded-full hover:bg-secondary"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 hover:bg-secondary rounded-full pr-3"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-medium">
              JS
            </div>
            <span className="font-medium hidden md:block">John Smith</span>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border overflow-hidden z-20">
              <div className="p-3 border-b">
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-muted-foreground">john.smith@example.com</p>
              </div>
              <div>
                <button className="w-full text-left p-3 hover:bg-secondary flex items-center space-x-3">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-secondary flex items-center space-x-3">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-secondary flex items-center space-x-3">
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;