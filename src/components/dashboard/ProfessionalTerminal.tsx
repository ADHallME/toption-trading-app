message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time?.toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Connected</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Data: Polygon.io</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}