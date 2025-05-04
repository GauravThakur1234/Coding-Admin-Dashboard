"use client"

import { useState, useEffect } from "react";
import { Search, Github, Filter, ArrowDownUp, Star, GitFork, Clock, AlertCircle, Code, ExternalLink, BookOpen } from "lucide-react";

// Project Card Component with enhanced design
const ProjectCard = ({ project }) => {
  const languageColors = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-500",
    Python: "bg-green-500",
    Java: "bg-red-600",
    "C#": "bg-purple-600",
    PHP: "bg-indigo-500",
    Ruby: "bg-red-500",
    Go: "bg-blue-400",
    Swift: "bg-orange-500",
    Kotlin: "bg-orange-600",
    Rust: "bg-orange-700",
    Dart: "bg-blue-600",
    HTML: "bg-red-400",
    CSS: "bg-pink-500",
    default: "bg-gray-400"
  };

  const languageColor = project.language 
    ? languageColors[project.language] || languageColors.default
    : languageColors.default;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-indigo-700 truncate hover:text-indigo-900 transition-colors">{project.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-amber-500 stroke-amber-500" />
            <span className="text-sm font-medium">{project.stars}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mt-2 line-clamp-3 text-sm">{project.description || "No description available"}</p>
        
        <div className="flex items-center gap-4 mt-4 text-gray-500">
          {project.language && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${languageColor}`}></div>
              <span className="text-xs font-medium">{project.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            <span className="text-xs">{project.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center gap-2">
          <img 
            src={project.ownerAvatar} 
            alt={`${project.owner} avatar`}
            className="h-7 w-7 rounded-full ring-2 ring-white"
          />
          <span className="text-sm text-gray-700 font-medium">{project.owner}</span>
        </div>
        <div className="flex gap-2">
          <a 
            href={`${project.url}/blob/main/README.md`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 bg-white p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            title="View README"
          >
            <BookOpen className="h-4 w-4" />
          </a>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 bg-white p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            title="View on GitHub"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
};

// Main Projects Component
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("stars");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [personalInfo, setPersonalInfo] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Flag to prevent multiple fetches

  // Initial username setup from localStorage or prompt
  useEffect(() => {
    const storedUsername = localStorage.getItem('github_username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const newUsername = prompt("Please enter your GitHub username:", "");
      if (newUsername) {
        localStorage.setItem('github_username', newUsername);
        setUsername(newUsername);
      } else {
        setError("No GitHub username provided");
        setLoading(false);
      }
    }
  }, []); // Run only once on mount

  // Fetch user info when username changes
  useEffect(() => {
    if (!username || dataFetched) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user info
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information");
        }
        const userData = await userResponse.json();
        setPersonalInfo(userData);
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposResponse.ok) {
          throw new Error("Failed to fetch projects from GitHub");
        }
        const reposData = await reposResponse.json();
        
        const formattedProjects = reposData.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updatedAt: repo.updated_at,
          url: repo.html_url,
          owner: repo.owner.login,
          ownerAvatar: repo.owner.avatar_url,
          isForked: repo.fork
        }));
        
        // Filter out forked repositories
        const originalProjects = formattedProjects.filter(project => !project.isForked);
        setProjects(originalProjects);
        setDataFetched(true); // Mark data as fetched
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [username, dataFetched]); // Only run when username changes or when data hasn't been fetched yet

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort projects based on selected sort type
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortType === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortType === "recent") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortType === "stars") {
      return b.stars - a.stars;
    }
    return 0;
  });

  const changeUsername = () => {
    const newUsername = prompt("Enter GitHub username:", username);
    if (newUsername && newUsername !== username) {
      localStorage.setItem('github_username', newUsername);
      setUsername(newUsername);
      setDataFetched(false); // Reset the fetch flag to trigger a new data fetch
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header with profile info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            {personalInfo && (
              <img 
                src={personalInfo.avatar_url} 
                alt={`${username}'s avatar`}
                className="h-16 w-16 rounded-full shadow-md ring-4 ring-white"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                My GitHub Projects
              </h1>
              {personalInfo && (
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-gray-600 mt-1">
                  <p className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    <span className="font-medium">{personalInfo.login}</span>
                  </p>
                  {personalInfo.name && (
                    <p className="hidden md:block text-gray-400">•</p>
                  )}
                  {personalInfo.name && (
                    <p>{personalInfo.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={changeUsername}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md flex items-center gap-2 transition-all"
          >
            <Code className="h-4 w-4" /> Change Username
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your projects..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  className="border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSortMenu(!showSortMenu)}
                >
                  <ArrowDownUp className="h-4 w-4" /> 
                  <span>Sort by: </span>
                  <span className="font-medium text-indigo-700">
                    {sortType === "name" ? "Name" : 
                     sortType === "recent" ? "Recent" : "Stars"}
                  </span>
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-48">
                    <div className="py-1">
                      <button 
                        className={`px-4 py-2 text-left w-full hover:bg-indigo-50 flex items-center gap-2 ${sortType === "name" ? "text-indigo-700 font-medium bg-indigo-50" : ""}`} 
                        onClick={() => {
                          setSortType("name");
                          setShowSortMenu(false);
                        }}
                      >
                        <span className="w-4">{sortType === "name" && "✓"}</span>
                        Name
                      </button>
                      <button 
                        className={`px-4 py-2 text-left w-full hover:bg-indigo-50 flex items-center gap-2 ${sortType === "recent" ? "text-indigo-700 font-medium bg-indigo-50" : ""}`} 
                        onClick={() => {
                          setSortType("recent");
                          setShowSortMenu(false);
                        }}
                      >
                        <span className="w-4">{sortType === "recent" && "✓"}</span>
                        Recently Updated
                      </button>
                      <button 
                        className={`px-4 py-2 text-left w-full hover:bg-indigo-50 flex items-center gap-2 ${sortType === "stars" ? "text-indigo-700 font-medium bg-indigo-50" : ""}`} 
                        onClick={() => {
                          setSortType("stars");
                          setShowSortMenu(false);
                        }}
                      >
                        <span className="w-4">{sortType === "stars" && "✓"}</span>
                        Most Stars
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Code className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{projects.length}</h3>
                <p className="text-sm text-gray-500">Original Repositories</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {projects.reduce((sum, project) => sum + project.stars, 0)}
                </h3>
                <p className="text-sm text-gray-500">Total Stars</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GitFork className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {projects.reduce((sum, project) => sum + project.forks, 0)}
                </h3>
                <p className="text-sm text-gray-500">Total Forks</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-indigo-600 border-t-transparent"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-md">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold">Error loading projects</h3>
            <p className="text-gray-500 mt-2 max-w-md">{error}</p>
            {username && (
              <button 
                onClick={() => {
                  localStorage.removeItem('github_username');
                  window.location.reload();
                }}
                className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Reset Username
              </button>
            )}
          </div>
        ) : (
          <>
            {sortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center py-16 text-center">
                <img 
                  src="/api/placeholder/200/200" 
                  alt="No projects found" 
                  className="h-32 w-32 mb-6 opacity-50"
                />
                <h3 className="text-xl font-bold text-gray-800">No projects found</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  {searchTerm 
                    ? "No projects match your search criteria. Try a different search term." 
                    : "You don't have any original repositories yet."}
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Created with ❤️ using React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;