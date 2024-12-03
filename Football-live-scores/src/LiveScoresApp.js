import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, 
  TrendingUp, 
  User, 
  BarChart2, 
  Bell,
  Star,
  Shield,
  Award,
  Globe,
  Filter,
  RefreshCw,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';

const LiveScoresApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [liveScores, setLiveScores] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Configuration (Replace with your RapidAPI key)
  const API_KEY = 'YOUR_RAPIDAPI_KEY';
  const API_HOST = 'api-football-v1.p.rapidapi.com';

  // Fetch Live Scores
  const fetchLiveScores = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://${API_HOST}/v3/fixtures`, {
        params: { live: 'all' },
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      });

      const liveFixes = response.data.response.map(fixture => ({
        id: fixture.fixture.id,
        league: fixture.league.name,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeScore: fixture.goals.home || 0,
        awayScore: fixture.goals.away || 0,
        status: fixture.fixture.status.short,
        time: fixture.fixture.status.elapsed || 0,
        logo: {
          home: fixture.teams.home.logo,
          away: fixture.teams.away.logo
        }
      }));

      setLiveScores(liveFixes);
    } catch (err) {
      setError('Failed to fetch live scores');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Available Leagues
  const fetchLeagues = async () => {
    try {
      const response = await axios.get(`https://${API_HOST}/v3/leagues`, {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      });

      const uniqueLeagues = response.data.response
        .filter(league => league.league.type === 'League')
        .map(league => ({
          id: league.league.id,
          name: league.league.name,
          logo: league.league.logo,
          country: league.country.name
        }))
        .slice(0, 10);  // Limit to top 10 leagues

      setLeagues(uniqueLeagues);
    } catch (err) {
      console.error('Failed to fetch leagues', err);
    }
  };

  // Responsive and Mode Effects
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial data fetch
    fetchLiveScores();
    fetchLeagues();

    // Periodic refresh every 2 minutes
    const scoreInterval = setInterval(fetchLiveScores, 120000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(scoreInterval);
    };
  }, []);

  // Color and style management
  const colorScheme = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-zinc-900 to-gray-900' 
      : 'bg-gradient-to-br from-gray-100 to-gray-200',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      accent: isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
    },
    card: {
      base: isDarkMode 
        ? 'bg-white/10 border-gray-700/50' 
        : 'bg-white/70 border-gray-300/50',
      hover: 'hover:bg-opacity-20 transition-all'
    }
  };

  // Render different layouts for mobile and desktop
  const renderContent = () => {
    if (isDesktop) {
      return (
        <div className="container mx-auto grid grid-cols-3 gap-6 px-8 pt-24">
          {/* Leagues Sidebar */}
          <div className="col-span-1 space-y-6">
            <div className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold mb-4 ${colorScheme.text.primary}`}>
                <Globe className="inline mr-2 text-emerald-500" />
                Leagues
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {leagues.map(league => (
                  <button 
                    key={league.id} 
                    onClick={() => setSelectedLeague(league.name)}
                    className={`w-full py-2 rounded-md flex items-center ${
                      selectedLeague === league.name 
                        ? 'bg-emerald-500/20' 
                        : `${colorScheme.text.secondary} hover:bg-opacity-20`
                    }`}
                  >
                    <img 
                      src={league.logo} 
                      alt={league.name} 
                      className="w-8 h-8 mr-3 rounded-full"
                    />
                    {league.name} ({league.country})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <section>
              <h2 className={`text-2xl font-bold mb-6 ${colorScheme.text.primary} flex justify-between items-center`}>
                <span>
                  <Star className="inline mr-3 text-yellow-500" />
                  Live Matches
                </span>
                <button 
                  onClick={fetchLiveScores}
                  className={`text-sm ${colorScheme.text.secondary} flex items-center`}
                >
                  <RefreshCw className="mr-2 w-4 h-4" /> Refresh
                </button>
              </h2>
              {isLoading ? (
                <div className="text-center">Loading live scores...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div className="space-y-4">
                  {liveScores
                    .filter(match => !selectedLeague || match.league === selectedLeague)
                    .map((match) => (
                    <div 
                      key={match.id} 
                      className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-5 border`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center w-1/3">
                          <img 
                            src={match.logo.home} 
                            alt={match.homeTeam} 
                            className="w-10 h-10 mr-3"
                          />
                          <span className={`font-medium ${colorScheme.text.primary}`}>
                            {match.homeTeam}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-2xl font-bold mx-4 ${
                            match.status === 'FT' 
                              ? 'text-gray-500' 
                              : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                          }`}>
                            {match.homeScore} - {match.awayScore}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            match.status === 'FT' 
                              ? 'bg-gray-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}>
                            {match.status === 'FT' ? 'Full Time' : `${match.time}'`}
                          </span>
                        </div>
                        <div className="flex items-center w-1/3 justify-end">
                          <span className={`font-medium mr-3 ${colorScheme.text.primary}`}>
                            {match.awayTeam}
                          </span>
                          <img 
                            src={match.logo.away} 
                            alt={match.awayTeam} 
                            className="w-10 h-10"
                          />
                        </div>
                      </div>
                      <div className={`mt-2 text-center text-sm ${colorScheme.text.secondary}`}>
                        {match.league}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      );
    }

    // Mobile View
    return (
      <div className="px-4 pt-20 pb-24 space-y-6">
        {/* Live Matches Section */}
        <section>
          <h2 className={`text-xl font-bold mb-4 ${colorScheme.text.primary} flex justify-between items-center`}>
            <span>
              <Star className="inline mr-2 text-yellow-500" />
              Live Matches
            </span>
            <button 
              onClick={fetchLiveScores}
              className={`text-sm ${colorScheme.text.secondary} flex items-center`}
            >
              <RefreshCw className="mr-1 w-4 h-4" /> Refresh
            </button>
          </h2>
          {isLoading ? (
            <div className="text-center">Loading live scores...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {liveScores
                .filter(match => !selectedLeague || match.league === selectedLeague)
                .map((match) => (
                <div 
                  key={match.id} 
                  className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-4 border`}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-2 items-center">
                      <div className="flex items-center">
                        <img 
                          src={match.logo.home} 
                          alt={match.homeTeam} 
                          className="w-8 h-8 mr-2"
                        />
                        <span className={`font-medium ${colorScheme.text.primary}`}>
                          {match.homeTeam}
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${
                        match.status === 'FT' 
                          ? 'text-gray-500' 
                          : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                      }`}>
                        {match.homeScore}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <div className="flex items-center">
                        <img 
                          src={match.logo.away} 
                          alt={match.awayTeam} 
                          className="w-8 h-8 mr-2"
                        />
                        <span className={`font-medium ${colorScheme.text.primary}`}>
                          {match.awayTeam}
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${
                        match.status === 'FT' 
                          ? 'text-gray-500' 
                          : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                      }`}>
                        {match.awayScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-sm ${colorScheme.text.secondary}`}>
                        {match.league}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        match.status === 'FT' 
                          ? 'bg-gray-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}>
                        {match.status === 'FT' ? 'Full Time' : `${match.time}'`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${colorScheme.background} ${colorScheme.text.primary} font-sans transition-colors duration-300`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r 
        ${isDarkMode ? 'from-zinc-800 to-gray-900' : 'from-gray-200 to-gray-300'} 
        p-4 shadow-lg flex justify-between items-center`}
      >
        <div className="flex items-center">
          <Shield className="mr-2 text-emerald-500" />
          <span className="text-2xl font-bold text-emerald-500">LiveScores Pro</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <Bell className={`${colorScheme.text.secondary} hover:opacity-80`} />
        </div>
      </header>

      {/* Main Content */}
      {renderContent()}

      {/* Bottom Navigation (Mobile Only) */}
      {!isDesktop && (
        <nav className={`fixed bottom-0 left-0 right-0 
            ${isDarkMode ? 'bg-gradient-to-r from-zinc-800 to-gray-900' : 'bg-gradient-to-r from-gray-200 to-gray-300'} 
          p-4 shadow-2xl border-t border-gray-400/30`}
        >
          <div className="flex justify-around items-center">
            {[
              { icon: Home, label: 'Home', tab: 'home' },
              { icon: Star, label: 'Live', tab: 'live' },
              { icon: BarChart2, label: 'Stats', tab: 'stats' },
              { icon: User, label: 'Profile', tab: 'profile' }
            ].map(({ icon: Icon, label, tab }) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center transition-colors ${
                  activeTab === tab 
                    ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                    : (isDarkMode ? 'text-gray-500' : 'text-gray-600')
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default LiveScoresApp;