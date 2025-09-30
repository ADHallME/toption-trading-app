// Add this to ProfessionalTerminal.tsx in the settings dropdown section:

{showSettings && (
  <div className="absolute right-0 top-12 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
    <div className="p-2">
      <button 
        onClick={() => {
          // Navigate to AI calibration settings
          window.location.href = '/settings?tab=ai-calibration'
          setShowSettings(false)
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white flex items-center gap-2 transition-colors"
      >
        <Target className="w-4 h-4" />
        AI Calibration Settings
      </button>
      <button 
        onClick={() => {
          // Navigate to screener preferences
          window.location.href = '/settings?tab=screener'
          setShowSettings(false)
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white flex items-center gap-2 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Screener Preferences
      </button>
      <button 
        onClick={() => {
          // Navigate to alert thresholds
          window.location.href = '/settings?tab=alerts'
          setShowSettings(false)
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white flex items-center gap-2 transition-colors"
      >
        <Bell className="w-4 h-4" />
        Alert Thresholds
      </button>
      <button 
        onClick={() => {
          // Navigate to display options
          window.location.href = '/settings?tab=display'
          setShowSettings(false)
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white flex items-center gap-2 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Display Options
      </button>
    </div>
  </div>
)}

// Update profile dropdown to only show Account Settings:
{showProfile && (
  <div className="absolute right-0 top-12 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-medium">{user?.firstName} {user?.lastName}</div>
          <div className="text-gray-400 text-sm">{user?.emailAddresses[0]?.emailAddress}</div>
        </div>
      </div>
    </div>
    <div className="p-2">
      <Link 
        href="/settings" 
        className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white flex items-center gap-2 transition-colors"
        onClick={() => setShowProfile(false)}
      >
        <Settings className="w-4 h-4" />
        Account Settings
      </Link>
    </div>
  </div>
)}
