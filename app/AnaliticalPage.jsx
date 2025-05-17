"use client"
import { useState, useEffect } from 'react';
import { 
  LineChart, BarChart, PieChart, ArrowUpRight, Code, Server, 
  AreaChart, Radar, HexagonIcon, GitCommit, GitMerge, GitCompare, 
  Calendar, Users, Star, Clock, Github, Filter, Download, Code2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart as RechartsAreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ComposedChart,
  Scatter
} from 'recharts';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#7e57c2', '#26A69A', '#EC407A'];

// Language colors for visualization
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
  Shell: '#89e051'
};

const AnalyticsPage = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    totalIssues: 0,
    totalPRs: 0,
    totalCommits: 0
  });
  const [commitActivity, setCommitActivity] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [codeFrequency, setCodeFrequency] = useState([]);
  const [contributorStats, setContributorStats] = useState([]);
  const [commitsPerDay, setCommitsPerDay] = useState([]);
  const [issuesData, setIssuesData] = useState([]);
  const [pullRequestData, setPullRequestData] = useState([]);
  const [comparisonRepo, setComparisonRepo] = useState("");
  const [timeRange, setTimeRange] = useState("year");

  // This token should be stored securely in env variables
  // NOTE: This is just for demonstration - in a real app, NEVER expose tokens in client-side code
  const token = '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';

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      return null;
    }
  };

  // Function to fetch repositories
  const fetchRepositories = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch repositories');
      
      const data = await response.json();
      setRepositories(data);
      
      // Calculate stats
      const totalStars = data.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = data.reduce((sum, repo) => sum + repo.forks_count, 0);
      const totalWatchers = data.reduce((sum, repo) => sum + repo.watchers_count, 0);
      
      setStats(prev => ({
        ...prev,
        totalRepos: data.length,
        totalStars,
        totalForks,
        totalWatchers
      }));
      
      // Process language data
      const languages = {};
      data.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      
      const languageData = Object.entries(languages).map(([name, value]) => ({
        name,
        value,
        color: LANGUAGE_COLORS[name] || '#ccc'
      }));
      
      setLanguageStats(languageData);
      
      return data;
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to load repository data');
      return [];
    }
  };

  // Function to fetch user activities
  const fetchUserActivities = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      
      // Transform the data
      const processedActivities = data.map(event => {
        let type = 'activity';
        let details = '';
        
        switch (event.type) {
          case 'PushEvent':
            type = 'commit';
            details = `Pushed ${event.payload.commits?.length || 0} commits to ${event.repo.name}`;
            break;
          case 'CreateEvent':
            type = 'code';
            details = `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
            break;
          case 'PullRequestEvent':
            type = 'pull-request';
            details = `${event.payload.action} pull request in ${event.repo.name}`;
            break;
          case 'IssuesEvent':
            type = 'issue';
            details = `${event.payload.action} issue in ${event.repo.name}`;
            break;
          case 'WatchEvent':
            type = 'star';
            details = `Starred ${event.repo.name}`;
            break;
          case 'ForkEvent':
            type = 'fork';
            details = `Forked ${event.repo.name}`;
            break;
          default:
            details = `Activity in ${event.repo.name}`;
        }
        
        return {
          id: event.id,
          type,
          user: event.actor.login,
          avatar: event.actor.avatar_url,
          project: event.repo.name.split('/')[1],
          repository: event.repo.name,
          details,
          createdAt: event.created_at,
          time: new Date(event.created_at).toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      });
      
      setActivities(processedActivities);

      // Generate day of week data from activity
      processCommitsByDay(processedActivities);
      
      return processedActivities;
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity data');
      return [];
    }
  };

  // Function to generate commit data by day of week
  const processCommitsByDay = (activities) => {
    const commitsByDay = Array(7).fill(0);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    activities.forEach(activity => {
      if (activity.type === 'commit') {
        const dayIndex = new Date(activity.createdAt).getDay();
        commitsByDay[dayIndex]++;
      }
    });
    
    const formattedData = daysOfWeek.map((day, index) => ({
      name: day,
      commits: commitsByDay[index]
    }));
    
    setCommitsPerDay(formattedData);
  };

  // Function to fetch commit activity for a repository
  const fetchCommitActivity = async (repo) => {
    if (!repo) return;
    
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
    
      const data = await response.json();
      
      // Transform weekly commit data into a format for charts
      const chartData = data.map((week, index) => {
        const date = new Date(week.week * 1000);
        return {
          name: `Week ${index + 1}`,
          date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          commits: week.total,
          sunday: week.days[0],
          monday: week.days[1],
          tuesday: week.days[2],
          wednesday: week.days[3],
          thursday: week.days[4],
          friday: week.days[5],
          saturday: week.days[6]
        };
      });
      
      // Get last 12 weeks for display
      setCommitActivity(chartData.slice(-12));
      
      // Calculate total commits for stats
      const totalCommits = chartData.reduce((sum, week) => sum + week.commits, 0);
      setStats(prev => ({
        ...prev,
        totalCommits
      }));
      
      return chartData;
    } catch (err) {
      console.error('Error fetching commit activity:', err);
      setError('Failed to load commit activity data');
      return [];
    }
  };

  // Function to fetch code frequency
  const fetchCodeFrequency = async (repo) => {
    if (!repo) return;
    
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/stats/code_frequency`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch code frequency');
      
      const data = await response.json();
      
      // Transform into format for charts
      const chartData = data.map(week => {
        const date = new Date(week[0] * 1000);
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          additions: week[1],
          deletions: Math.abs(week[2]) * -1, // Make negative for visualization
          net: week[1] + week[2]
        };
      });
      
      setCodeFrequency(chartData);
      return chartData;
    } catch (err) {
      console.error('Error fetching code frequency:', err);
      setError('Failed to load code frequency data');
      return [];
    }
  };

  // Function to fetch contributor stats
 // Function to fetch contributor stats
const fetchContributorStats = async (repo) => {
  if (!repo) return;
  
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/stats/contributors`, {
      headers: {
        'Authorization': `token ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch contributor stats');
    
    const data = await response.json();
    
    // Check if data is an array before mapping
    if (!Array.isArray(data)) {
      console.warn('Contributor stats data is not an array:', data);
      setContributorStats([]);
      return [];
    }
    
    // Process data for visualization
    const contributors = data.map(contributor => {
      const totalCommits = contributor.weeks.reduce((sum, week) => sum + week.c, 0);
      const totalAdditions = contributor.weeks.reduce((sum, week) => sum + week.a, 0);
      const totalDeletions = contributor.weeks.reduce((sum, week) => sum + week.d, 0);
      
      // Get weekly commit data for recent commits
      const recentWeeks = contributor.weeks.slice(-12);
      const weeklyCommits = recentWeeks.map((week, index) => {
        const date = new Date(week.w * 1000);
        return {
          week: `Week ${index + 1}`,
          date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          commits: week.c,
          additions: week.a,
          deletions: week.d
        };
      });
      
      return {
        author: contributor.author,
        totalCommits,
        totalAdditions,
        totalDeletions,
        weeklyCommits
      };
    });
    
    // Sort by total commits
    contributors.sort((a, b) => b.totalCommits - a.totalCommits);
    
    setContributorStats(contributors);
    return contributors;
  } catch (err) {
    console.error('Error fetching contributor stats:', err);
    setError('Failed to load contributor statistics data');
    return [];
  }
};

  // Function to fetch issues data
  const fetchIssuesData = async (username) => {
    try {
      // Fetch issues created by user
      const createdResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+is:issue&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!createdResponse.ok) throw new Error('Failed to fetch created issues');
      const createdData = await createdResponse.json();
      
      // Fetch issues assigned to user
      const assignedResponse = await fetch(`https://api.github.com/search/issues?q=assignee:${username}+is:issue&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!assignedResponse.ok) throw new Error('Failed to fetch assigned issues');
      const assignedData = await assignedResponse.json();
      
      // Determine issue states
      const openIssues = createdData.items.filter(issue => issue.state === 'open').length;
      const closedIssues = createdData.items.filter(issue => issue.state === 'closed').length;
      
      // Determine issue ages for open issues
      const issueAges = createdData.items
        .filter(issue => issue.state === 'open')
        .map(issue => {
          const createdDate = new Date(issue.created_at);
          const now = new Date();
          const daysOpen = Math.round((now - createdDate) / (1000 * 60 * 60 * 24));
          return { name: issue.title.substring(0, 20) + '...', days: daysOpen };
        })
        .sort((a, b) => b.days - a.days)
        .slice(0, 10);
      
      // Chart data for issues over time
      const timeData = [
        { name: 'Open', value: openIssues },
        { name: 'Closed', value: closedIssues }
      ];
      
      setIssuesData({
        created: createdData.total_count,
        assigned: assignedData.total_count,
        open: openIssues,
        closed: closedIssues,
        issueAges,
        timeData
      });
      
      return {
        created: createdData.total_count,
        assigned: assignedData.total_count,
        open: openIssues,
        closed: closedIssues
      };
    } catch (err) {
      console.error('Error fetching issues data:', err);
      setError('Failed to load issues data');
      return { created: 0, assigned: 0, open: 0, closed: 0 };
    }
  };

  // Function to fetch pull request data
  const fetchPullRequestData = async (username) => {
    try {
      // Fetch PRs created by user
      const createdResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+is:pr&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!createdResponse.ok) throw new Error('Failed to fetch created PRs');
      const createdData = await createdResponse.json();
      
      // Fetch PRs reviewed by user
      const reviewedResponse = await fetch(`https://api.github.com/search/issues?q=reviewed-by:${username}+is:pr&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!reviewedResponse.ok) throw new Error('Failed to fetch reviewed PRs');
      const reviewedData = await reviewedResponse.json();
      
      // Determine PR states
      const openPRs = createdData.items.filter(pr => pr.state === 'open').length;
      const closedPRs = createdData.items.filter(pr => pr.state === 'closed').length;
      const mergedPRs = closedPRs; // Approximation, GitHub API doesn't directly show merged status in search
      
      // PR age data for open PRs
      const prAges = createdData.items
        .filter(pr => pr.state === 'open')
        .map(pr => {
          const createdDate = new Date(pr.created_at);
          const now = new Date();
          const daysOpen = Math.round((now - createdDate) / (1000 * 60 * 60 * 24));
          return { name: pr.title.substring(0, 20) + '...', days: daysOpen };
        })
        .sort((a, b) => b.days - a.days)
        .slice(0, 10);
      
      // Chart data for PRs
      const statusData = [
        { name: 'Open', value: openPRs },
        { name: 'Merged', value: mergedPRs },
        { name: 'Closed', value: closedPRs - mergedPRs }
      ];
      
      setPullRequestData({
        created: createdData.total_count,
        reviewed: reviewedData.total_count,
        open: openPRs,
        closed: closedPRs,
        merged: mergedPRs,
        prAges,
        statusData
      });
      
      return {
        created: createdData.total_count,
        reviewed: reviewedData.total_count,
        open: openPRs,
        closed: closedPRs
      };
    } catch (err) {
      console.error('Error fetching pull request data:', err);
      setError('Failed to load pull request data');
      return { created: 0, reviewed: 0, open: 0, closed: 0 };
    }
  };

  // Effect to load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const profileData = await fetchUserProfile();
        
        if (profileData) {
          const username = profileData.login;
          
          // Load repository data first
          const repoData = await fetchRepositories(username);
          
          // Load data in parallel
          await Promise.all([
            fetchUserActivities(username),
            fetchIssuesData(username),
            fetchPullRequestData(username)
          ]);
          
          // If there are repos, load commit and contributor stats for the first repo
          if (repoData && repoData.length > 0) {
            const mainRepo = `${username}/${repoData[0].name}`;
            setComparisonRepo(mainRepo);
            
            await Promise.all([
              fetchCommitActivity(mainRepo),
              fetchCodeFrequency(mainRepo),
              fetchContributorStats(mainRepo)
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Function to handle repository comparison change
  const handleRepoChange = async (repoFullName) => {
    setComparisonRepo(repoFullName);
    await Promise.all([
      fetchCommitActivity(repoFullName),
      fetchCodeFrequency(repoFullName),
      fetchContributorStats(repoFullName)
    ]);
  };

  // Stats card component
  const StatsCard = ({ title, value, icon, subValue, change, color }) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`rounded-full p-2 bg-${color}-100`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
          {change !== undefined && (
            <p className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              <span className="text-gray-500 ml-1">from last month</span>
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading GitHub analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Alert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header with user profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          {profile && (
            <>
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.login?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">GitHub Analytics</h1>
                <p className="text-gray-600">Advanced metrics for @{profile.login}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Clock className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" onClick={() => window.open(`https://github.com/${profile?.login}`, '_blank')}>
            <Github className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard 
          title="Total Repositories" 
          value={stats.totalRepos} 
          icon={<Code className="h-5 w-5 text-blue-600" />} 
          color="blue" 
        />
        <StatsCard 
          title="Total Stars" 
          value={stats.totalStars} 
          icon={<Star className="h-5 w-5 text-yellow-600" />} 
          color="yellow" 
          change={12} 
        />
        <StatsCard 
          title="Total Commits" 
          value={stats.totalCommits || 0} 
          icon={<GitCommit className="h-5 w-5 text-green-600" />} 
          color="green" 
          subValue="All repositories"
        />
        <StatsCard 
          title="Issues Created" 
          value={issuesData?.created || 0} 
          icon={<HexagonIcon className="h-5 w-5 text-purple-600" />} 
          color="purple" 
          subValue={`${issuesData?.open || 0} open`}
        />
        <StatsCard 
          title="Pull Requests" 
          value={pullRequestData?.created || 0} 
          icon={<GitMerge className="h-5 w-5 text-indigo-600" />} 
          color="indigo" 
          subValue={`${pullRequestData?.merged || 0} merged`}
        />
        <StatsCard 
          title="Contribution Score" 
          value={Math.floor(stats.totalCommits / 10) || 0} 
          icon={<Radar className="h-5 w-5 text-red-600" />} 
          color="red" 
          change={8}
        />
      </div>
      
      {/* Repository Selection */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Repository Analysis</h2>
        <div className="flex items-center">
          <p className="mr-2 text-sm text-gray-600">Select Repository:</p>
          <Select
            value={comparisonRepo}
            onValueChange={(value) => handleRepoChange(value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map(repo => (
                <SelectItem key={repo.id} value={`${profile.login}/${repo.name}`}>
                  {repo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Main content Tabs */}
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="code">Code Analysis</TabsTrigger>
          <TabsTrigger value="contribution">Contribution Patterns</TabsTrigger>
          <TabsTrigger value="issues">Issues & PRs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        {/* Code Analysis Tab */}
        <TabsContent value="code" className="space-y-6">
          {/* Code Frequency Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Code Frequency</CardTitle>
              <CardDescription>Additions and deletions over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {codeFrequency.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={codeFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="additions" fill="#82ca9d" name="Additions" />
                    <Bar dataKey="deletions" fill="#ff8042" name="Deletions" />
                    <Line type="monotone" dataKey="net" stroke="#8884d8" name="Net" activeDot={{ r: 8 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                 <p className="text-gray-500">No code frequency data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Distribution and Top Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Repository language breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {languageStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={languageStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {languageStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} repos`, 'Count']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No language data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Languages</CardTitle>
                <CardDescription>Most used programming languages</CardDescription>
              </CardHeader>
              <CardContent>
                {languageStats.length > 0 ? (
                  <div className="space-y-4">
                    {languageStats.slice(0, 5).map((lang, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-sm text-gray-500">{lang.value} repos</span>
                        </div>
                        <Progress value={(lang.value / languageStats[0].value) * 100} className="h-2" style={{ backgroundColor: '#f0f0f0' }}>
                          <div className="h-full" style={{ backgroundColor: lang.color || COLORS[index % COLORS.length] }}></div>
                        </Progress>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-gray-500">No language data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contribution Patterns Tab */}
        <TabsContent value="contribution" className="space-y-6">
          {/* Commit Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Commit Activity</CardTitle>
              <CardDescription>Weekly commit trends</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {commitActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={commitActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="commits" fill="#8884d8" name="Total Commits" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No commit activity data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commit Pattern by Day of Week and Contributor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commits by Day of Week</CardTitle>
                <CardDescription>When you're most active</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {commitsPerDay.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={commitsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="commits" fill="#82ca9d" name="Commits" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No commit pattern data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>For selected repository</CardDescription>
              </CardHeader>
              <CardContent>
                {contributorStats.length > 0 ? (
                  <div className="space-y-4">
                    {contributorStats.slice(0, 5).map((contributor, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contributor.author?.avatar_url} />
                          <AvatarFallback>{contributor.author?.login?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{contributor.author?.login}</span>
                            <span className="text-sm text-gray-500">{contributor.totalCommits} commits</span>
                          </div>
                          <Progress value={(contributor.totalCommits / contributorStats[0].totalCommits) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-gray-500">No contributor data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Issues & PRs Tab */}
        <TabsContent value="issues" className="space-y-6">
          {/* Issues and PRs Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issues Overview</CardTitle>
                <CardDescription>Summary of issues created and assigned</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {issuesData ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={issuesData.timeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#4CAF50" /> {/* Open */}
                            <Cell fill="#9E9E9E" /> {/* Closed */}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{issuesData.created}</div>
                        <div className="text-sm text-gray-600">Created</div>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{issuesData.assigned}</div>
                        <div className="text-sm text-gray-600">Assigned</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No issues data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pull Requests Overview</CardTitle>
                <CardDescription>Summary of PRs created and reviewed</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {pullRequestData ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pullRequestData.statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#2196F3" /> {/* Open */}
                            <Cell fill="#4CAF50" /> {/* Merged */}
                            <Cell fill="#F44336" /> {/* Closed */}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{pullRequestData.created}</div>
                        <div className="text-sm text-gray-600">Created</div>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{pullRequestData.reviewed}</div>
                        <div className="text-sm text-gray-600">Reviewed</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No pull request data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Issue Age and PR Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Oldest Open Issues</CardTitle>
                <CardDescription>Issues that have been open the longest</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {issuesData && issuesData.issueAges && issuesData.issueAges.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={issuesData.issueAges} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value} days`, 'Age']} />
                      <Bar dataKey="days" fill="#8884d8" name="Days Open" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No open issues data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oldest Open Pull Requests</CardTitle>
                <CardDescription>PRs that have been open the longest</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {pullRequestData && pullRequestData.prAges && pullRequestData.prAges.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={pullRequestData.prAges} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value} days`, 'Age']} />
                      <Bar dataKey="days" fill="#82ca9d" name="Days Open" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No open pull requests data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Daily Activity Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Contribution Performance</CardTitle>
              <CardDescription>Your performance metrics compared to top contributors</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {contributorStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={contributorStats.slice(0, 5).map(contributor => ({
                    contributor: contributor.author?.login || 'Unknown',
                    commits: contributor.totalCommits,
                    additions: Math.min(contributor.totalAdditions / 1000, 100), // Scale down for visualization
                    deletions: Math.min(contributor.totalDeletions / 1000, 100), // Scale down for visualization
                    repositories: Math.floor(Math.random() * 10) + 1 // Mock data since we don't have this metric
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="contributor" />
                    <PolarRadiusAxis />
                    <RechartsRadar name="Commits" dataKey="commits" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <RechartsRadar name="Additions (K)" dataKey="additions" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <RechartsRadar name="Deletions (K)" dataKey="deletions" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline and Code Contribution Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Timeline</CardTitle>
                <CardDescription>Your recent GitHub events</CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto p-0">
                <div className="space-y-0">
                  {activities.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                      <div className="mr-4 flex-shrink-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback>{activity.user?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{activity.details}</p>
                            <p className="text-xs text-gray-500">{activity.repository}</p>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Contribution Trends</CardTitle>
                <CardDescription>Weekly code additions and deletions</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {codeFrequency.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={codeFrequency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="additions" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="deletions" stackId="1" stroke="#ff8042" fill="#ff8042" />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No code contribution data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Repository highlights */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Repository Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repositories.slice(0, 3).map((repo) => (
            <Card key={repo.id}>
              <CardHeader>
                <CardTitle className="text-base">{repo.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {repo.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center">
                    <GitMerge className="h-4 w-4 mr-1 text-indigo-500" />
                    <span>{repo.forks_count}</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {repo.language || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                  <span>{repo.open_issues_count} issues</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => window.open(repo.html_url, '_blank')}>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Repository
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GitHub Analytics Dashboard. All data provided by GitHub API.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Code2 className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Team Access
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;