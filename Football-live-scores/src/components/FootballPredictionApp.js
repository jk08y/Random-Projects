import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';

const FootballAnalysisApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [predictions, setPredictions] = useState([
    {
      match: "Manchester United vs Liverpool",
      prediction: "Liverpool Win",
      confidence: "75%",
      date: "Dec 10, 2024",
      league: "Premier League",
      impact: "High"
    },
    {
      match: "Real Madrid vs Barcelona",
      prediction: "Draw",
      confidence: "60%", 
      date: "Dec 15, 2024",
      league: "La Liga",
      impact: "Medium"
    },
    {
      match: "Bayern Munich vs Borussia Dortmund",
      prediction: "Bayern Win",
      confidence: "70%",
      date: "Dec 20, 2024",
      league: "Bundesliga",
      impact: "High"
    }
  ]);

  // Responsive design handling
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          {/* Sidebar for Desktop */}
          <div className="col-span-1 space-y-6">
            <div className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold mb-4 ${colorScheme.text.primary}`}>
                <Shield className="inline mr-2 text-emerald-500" />
                Quick Filters
              </h3>
              <div className="space-y-3">
                {['Premier League', 'La Liga', 'Bundesliga'].map(league => (
                  <button 
                    key={league} 
                    className={`w-full py-2 rounded-md ${colorScheme.text.secondary} hover:bg-opacity-20`}
                  >
                    <Filter className="inline mr-2 w-5 h-5" /> {league}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content for Desktop */}
          <div className="col-span-2 space-y-6">
            {/* Predictions Section */}
            <section>
              <h2 className={`text-2xl font-bold mb-6 ${colorScheme.text.primary} flex justify-between items-center`}>
                <span>
                  <Star className="inline mr-3 text-yellow-500" />
                  Upcoming Predictions
                </span>
                <button className={`text-sm ${colorScheme.text.secondary} flex items-center`}>
                  <RefreshCw className="mr-2 w-4 h-4" /> Refresh
                </button>
              </h2>
              <div className="space-y-4">
                {predictions.map((pred, index) => (
                  <div 
                    key={index} 
                    className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-5 border`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`font-bold text-lg ${colorScheme.text.accent}`}>
                          {pred.match}
                        </h3>
                        <p className={`text-sm ${colorScheme.text.secondary} mt-1`}>
                          {pred.league} • {pred.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          pred.impact === 'High' 
                            ? (isDarkMode ? 'text-red-500' : 'text-red-700')
                            : (isDarkMode ? 'text-green-500' : 'text-green-700')
                        }`}>
                          {pred.prediction}
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                        } mt-1`}>
                          Confidence: {pred.confidence}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Metrics */}
            <section>
              <h2 className={`text-2xl font-bold mb-6 ${colorScheme.text.primary}`}>
                <Award className="inline mr-3 text-purple-500" />
                Performance Metrics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: TrendingUp, 
                    label: 'Win Rate', 
                    value: '68%',
                    color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  },
                  { 
                    icon: BarChart2, 
                    label: 'Total Predictions', 
                    value: '245',
                    color: isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                  }
                ].map(({ icon: Icon, label, value, color }, index) => (
                  <div 
                    key={index}
                    className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-5 border text-center`}
                  >
                    <Icon className={`mx-auto mb-3 w-10 h-10 ${color}`} />
                    <p className={`font-semibold ${colorScheme.text.secondary} mb-2`}>
                      {label}
                    </p>
                    <p className={`text-3xl font-bold ${color}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      );
    }

    // Mobile View
    return (
      <div className="px-4 pt-20 pb-24 space-y-6">
        {/* Predictions Section */}
        <section>
          <h2 className={`text-xl font-bold mb-4 ${colorScheme.text.primary} flex justify-between items-center`}>
            <span>
              <Star className="inline mr-2 text-yellow-500" />
              Predictions
            </span>
            <button className={`text-sm ${colorScheme.text.secondary} flex items-center`}>
              <RefreshCw className="mr-1 w-4 h-4" /> Refresh
            </button>
          </h2>
          <div className="space-y-4">
            {predictions.map((pred, index) => (
              <div 
                key={index} 
                className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-4 border`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between mb-2">
                    <h3 className={`font-bold ${colorScheme.text.accent}`}>
                      {pred.match}
                    </h3>
                    <p className={`font-semibold ${
                      pred.impact === 'High' 
                        ? (isDarkMode ? 'text-red-500' : 'text-red-700')
                        : (isDarkMode ? 'text-green-500' : 'text-green-700')
                    }`}>
                      {pred.prediction}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm ${colorScheme.text.secondary}`}>
                      {pred.league} • {pred.date}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>
                      Confidence: {pred.confidence}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section>
          <h2 className={`text-xl font-bold mb-4 ${colorScheme.text.primary}`}>
            <Award className="inline mr-2 text-purple-500" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                icon: TrendingUp, 
                label: 'Win Rate', 
                value: '68%',
                color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              },
              { 
                icon: BarChart2, 
                label: 'Predictions', 
                value: '245',
                color: isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
              }
            ].map(({ icon: Icon, label, value, color }, index) => (
              <div 
                key={index}
                className={`${colorScheme.card.base} ${colorScheme.card.hover} rounded-xl p-4 border text-center`}
              >
                <Icon className={`mx-auto mb-2 w-8 h-8 ${color}`} />
                <p className={`font-semibold ${colorScheme.text.secondary} mb-1`}>
                  {label}
                </p>
                <p className={`text-2xl font-bold ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
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
          <span className="text-2xl font-bold text-emerald-500">FootballPro</span>
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
              { icon: TrendingUp, label: 'Predictions', tab: 'predictions' },
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

export default FootballAnalysisApp;