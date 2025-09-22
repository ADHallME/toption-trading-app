import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react'

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface OpportunityTableProps {
  data: any[]
  onSaveToWatchlist?: (item: any) => void
}

export default function SortableOpportunityTable({ data, onSaveToWatchlist }: OpportunityTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'roi', direction: 'desc' })
  const [sortedData, setSortedData] = useState(data)

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = parseFloat(a[sortConfig.key]) || 0
      const bVal = parseFloat(b[sortConfig.key]) || 0
      
      if (sortConfig.direction === 'asc') {
        return aVal - bVal
      }
      return bVal - aVal
    })
    setSortedData(sorted)
  }, [data, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const SortButton = ({ columnKey, label }: { columnKey: string; label: string }) => (
    <button
      onClick={() => handleSort(columnKey)}
      className="flex items-center gap-1 hover:text-white transition-colors"
    >
      {label}
      <div className="flex flex-col">
        <ChevronUp 
          className={`w-2 h-2 ${
            sortConfig.key === columnKey && sortConfig.direction === 'asc' 
              ? 'text-blue-400' 
              : 'text-gray-600'
          }`} 
        />
        <ChevronDown 
          className={`w-2 h-2 -mt-1 ${
            sortConfig.key === columnKey && sortConfig.direction === 'desc' 
              ? 'text-blue-400' 
              : 'text-gray-600'
          }`} 
        />
      </div>
    </button>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="text-left py-2 px-2">
              <SortButton columnKey="symbol" label="Symbol" />
            </th>
            <th className="text-left py-2 px-2">Type</th>
            <th className="text-right py-2 px-2">
              <SortButton columnKey="strike" label="Strike" />
            </th>
            <th className="text-right py-2 px-2">
              <SortButton columnKey="dte" label="DTE" />
            </th>
            <th className="text-right py-2 px-2">
              <SortButton columnKey="premium" label="Premium" />
            </th>
            <th className="text-right py-2 px-2">
              <SortButton columnKey="roi" label="ROI" />
            </th>
            <th className="text-right py-2 px-2">
              <SortButton columnKey="roiPerDay" label="ROI/Day" />
            </th>
            <th className="text-right py-2 px-2">
              <SortButton columnKey="pop" label="PoP" />
            </th>
            <th className="text-center py-2 px-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {sortedData.map((opp, idx) => (
            <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-2 px-2 font-mono font-semibold text-white">{opp.symbol}</td>
              <td className="py-2 px-2">
                <span className="px-1 py-0.5 rounded text-xs bg-emerald-900/30 text-emerald-400">
                  {opp.type || 'CSP'}
                </span>
              </td>
              <td className="text-right py-2 px-2">${opp.strike}</td>
              <td className="text-right py-2 px-2">{opp.dte}d</td>
              <td className="text-right py-2 px-2">${opp.premium}</td>
              <td className="text-right py-2 px-2 text-emerald-400 font-semibold">
                {opp.roi}%
              </td>
              <td className="text-right py-2 px-2">{opp.roiPerDay}%</td>
              <td className="text-right py-2 px-2">{opp.pop || 85}%</td>
              <td className="text-center py-2 px-2">
                {onSaveToWatchlist && (
                  <button
                    onClick={() => onSaveToWatchlist(opp)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                  >
                    + Watchlist
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}