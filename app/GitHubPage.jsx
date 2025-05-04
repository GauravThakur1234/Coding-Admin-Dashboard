"use client"
import { useState, useEffect } from "react";
import { Github, Star, GitFork, Code, Eye, Calendar, ExternalLink, Loader, AlertCircle } from "lucide-react";

const GitHub = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [activities, setActivities] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle GitHub OAuth authentication
  const authenticateWithGitHub = () => {
    // In a real app, you would redirect to GitHub OAuth
    // For demo purposes, we'll just set the access token directly
    if (username) {
      setIsLoading(true);
      setIsAuthenticated(true);
      fetchGitHubData(username);
    } else {
      setError("Please enter a GitHub username");
    }
  };

  // Function to fetch GitHub data
  const fetchGitHubData = async (username) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) throw new Error("User not found");
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!reposResponse.ok) throw new Error("Failed to fetch repositories");
      const reposData = await reposResponse.json();
      setRepos(reposData);

      // Fetch events (activities)
      const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=10`);
      if (!eventsResponse.ok) throw new Error("Failed to fetch activities");
      const eventsData = await eventsResponse.json();
      setActivities(eventsData);

      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get event description based on type
  const getEventDescription = (event) => {
    switch (event.type) {
      case 'PushEvent':
        return `Pushed ${event.payload.commits?.length || 0} commits to ${event.repo.name}`;
      case 'PullRequestEvent':
        return `${event.payload.action} pull request in ${event.repo.name}`;
      case 'IssuesEvent':
        return `${event.payload.action} issue in ${event.repo.name}`;
      case 'CreateEvent':
        return `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
      case 'DeleteEvent':
        return `Deleted ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
      case 'WatchEvent':
        return `Starred ${event.repo.name}`;
      case 'ForkEvent':
        return `Forked ${event.repo.name}`;
      default:
        return `Activity in ${event.repo.name}`;
    }
  };

  // Get appropriate icon for event type
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'PushEvent':
        return <Code className="h-4 w-4 text-green-600" />;
      case 'PullRequestEvent':
        return <GitFork className="h-4 w-4 text-purple-600" />;
      case 'WatchEvent':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'ForkEvent':
        return <GitFork className="h-4 w-4 text-blue-600" />;
      default:
        return <Github className="h-4 w-4 text-gray-600" />;
    }
  };

  // Login form
  const renderLoginForm = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="bg-card rounded-xl shadow-md border p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Github className="h-12 w-12 text-gray-800 dark:text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Connect to GitHub</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              GitHub Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          
          <button
            onClick={authenticateWithGitHub}
            className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Github className="h-5 w-5" />
            Connect with GitHub
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Note: In a real application, this would use GitHub OAuth for secure authentication.
            This demo just fetches public data based on the username.
          </p>
        </div>
      </div>
    </div>
  );

  // Loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader className="h-12 w-12 text-blue-600 animate-spin" />
      <p className="mt-4 text-gray-600">Loading GitHub data...</p>
    </div>
  );

  // Error state
  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="bg-red-50 rounded-xl p-6 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Main content when data is loaded
  const renderGitHubDashboard = () => (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">GitHub Dashboard</h1>
      
      {/* User Profile */}
      {user && (
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={user.avatar_url} 
              alt={user.login} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h2 className="text-xl font-bold">{user.name || user.login}</h2>
                <a 
                  href={user.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 flex items-center gap-1 text-sm"
                >
                  @{user.login} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-gray-600 mt-2">{user.bio || "No bio available"}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold">{user.public_repos}</div>
                  <div className="text-sm text-gray-600">Repositories</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold">{user.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold">{user.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold">{formatDate(user.created_at)}</div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Repositories Grid */}
      <div>
        <h2 className="font-semibold text-xl mb-4">Recent Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map(repo => (
            <div key={repo.id} className="bg-card rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg truncate">{repo.name}</h3>
                  {repo.private ? (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Private</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Public</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                  {repo.description || "No description available"}
                </p>
                
                <div className="flex items-center gap-4 text-sm mb-4">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="font-semibold text-xl mb-4">Recent Activity</h2>
        <div className="bg-card rounded-xl shadow-sm border">
          <ul className="divide-y">
            {activities.length > 0 ? (
              activities.map(activity => (
                <li key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getEventIcon(activity.type)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm">{getEventDescription(activity)}</p>
                      <span className="text-xs text-gray-500">{formatDate(activity.created_at)}</span>
                    </div>
                    <a 
                      href={`https://github.com/${activity.repo.name}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                    </a>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">No recent activity found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  // Render based on the current state
  return (
    <div className="h-full">
      {!isAuthenticated ? (
        renderLoginForm()
      ) : isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        renderGitHubDashboard()
      )}
    </div>
  );
};

export default GitHub;