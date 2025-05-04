"use client"
import { useState } from "react";
import { Search, Plus, Filter, ArrowDownUp } from "lucide-react";
import ProjectCard from "././components/ProjectCard";
import { initialProjects } from "./data/index";

// Component for the Projects page
const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort projects based on selected sort type
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortType === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortType === "recent") {
      return b.lastUpdated.localeCompare(a.lastUpdated);
    } else if (sortType === "stars") {
      return b.stars - a.stars;
    }
    return 0;
  });

  const toggleSortMenu = () => {
    setSortMenuOpen(!sortMenuOpen);
  };

  const handleSortChange = (type) => {
    setSortType(type);
    setSortMenuOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="border rounded-lg px-4 py-2 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <div className="relative">
            <button 
              className="border rounded-lg px-4 py-2 flex items-center gap-2"
              onClick={toggleSortMenu}
            >
              <ArrowDownUp className="h-4 w-4" /> Sort
            </button>
            <div className={`absolute right-0 mt-1 bg-white border rounded-lg shadow-lg ${sortMenuOpen ? 'block' : 'hidden'}`}>
              <div className="py-1">
                <button 
                  className="px-4 py-2 text-left w-full hover:bg-gray-100" 
                  onClick={() => handleSortChange("name")}
                >
                  Name
                </button>
                <button 
                  className="px-4 py-2 text-left w-full hover:bg-gray-100" 
                  onClick={() => handleSortChange("recent")}
                >
                  Recently Updated
                </button>
                <button 
                  className="px-4 py-2 text-left w-full hover:bg-gray-100" 
                  onClick={() => handleSortChange("stars")}
                >
                  Most Stars
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Projects Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;