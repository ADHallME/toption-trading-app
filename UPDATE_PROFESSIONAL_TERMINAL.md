# Professional Terminal Update Instructions

Add these imports to your ProfessionalTerminal.tsx:

```typescript
import { ChartPopout } from './ChartPopout';
import { OpportunitiesService } from '@/lib/opportunitiesService';
```

Add these state variables:
```typescript
const [showChartPopout, setShowChartPopout] = useState(false);
const [selectedSymbol, setSelectedSymbol] = useState('');
const [opportunities, setOpportunities] = useState<any[]>([]);
```

Add this useEffect to fetch opportunities:
```typescript
useEffect(() => {
  const loadOpportunities = async () => {
    const service = OpportunitiesService.getInstance();
    const opps = await service.getOpportunities(undefined, 50);
    setOpportunities(opps);
  };
  
  loadOpportunities();
  const interval = setInterval(loadOpportunities, 30000);
  return () => clearInterval(interval);
}, []);
```

Replace your opportunities display with sorted data:
```typescript
{opportunities.map((opp, index) => (
  <div 
    key={opp.id}
    onClick={() => {
      setSelectedSymbol(opp.symbol);
      setShowChartPopout(true);
    }}
    className="cursor-pointer hover:bg-slate-800/50"
  >
    {/* Your opportunity card content */}
    <div className="text-yellow-400 font-bold">
      {(opp.roiPerDay * 100).toFixed(2)}%/day
    </div>
  </div>
))}
```

Add the ChartPopout modal:
```typescript
{showChartPopout && (
  <ChartPopout 
    symbol={selectedSymbol} 
    onClose={() => setShowChartPopout(false)} 
  />
)}
```
