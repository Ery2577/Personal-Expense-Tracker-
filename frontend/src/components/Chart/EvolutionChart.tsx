interface EvolutionChartProps {
  data: { month: string; expense: number; income: number }[];
}

export default function EvolutionChart({ data }: EvolutionChartProps) {
  // Déterminer le max pour l'échelle avec une marge
  const max = Math.max(...data.map(d => Math.max(d.expense, d.income)), 1) * 1.1;
  const chartHeight = 350;
  const chartWidth = 750;
  const padding = { top: 40, right: 50, bottom: 70, left: 90 };
  
  // Calculer les positions
  const xStep = (chartWidth - padding.left - padding.right) / (data.length - 1);
  
  // Créer les points pour les lignes
  const expensePoints = data.map((d, i) => ({
    x: padding.left + (i * xStep),
    y: padding.top + (chartHeight - padding.top - padding.bottom) * (1 - d.expense / max)
  }));
  
  const incomePoints = data.map((d, i) => ({
    x: padding.left + (i * xStep),
    y: padding.top + (chartHeight - padding.top - padding.bottom) * (1 - d.income / max)
  }));

  // Créer les chemins pour les lignes
  const expensePath = `M ${expensePoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const incomePath = `M ${incomePoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  // Grille horizontale (5 lignes)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = padding.top + ((chartHeight - padding.top - padding.bottom) / 4) * i;
    const value = max * (1 - i / 4);
    return { y, value };
  });

  return (
    <div className="w-full">
      <svg width={chartWidth} height={chartHeight + 10} className="overflow-visible">
        {/* Grille de fond */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect x={padding.left} y={padding.top} 
              width={chartWidth - padding.left - padding.right} 
              height={chartHeight - padding.top - padding.bottom} 
              fill="url(#grid)" />
        
        {/* Lignes de grille horizontales */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line 
              x1={padding.left} 
              y1={line.y} 
              x2={chartWidth - padding.right} 
              y2={line.y} 
              stroke="#e2e8f0" 
              strokeWidth="1"
              strokeDasharray={i === gridLines.length - 1 ? "none" : "2,2"}
            />
            <text 
              x={padding.left - 15} 
              y={line.y + 4} 
              textAnchor="end" 
              fontSize="12" 
              fill="#64748b"
              fontWeight="500"
            >
              {line.value >= 1000 ? `${(line.value / 1000).toFixed(0)}K` : line.value.toFixed(0)}
            </text>
          </g>
        ))}
        
        {/* Axe X */}
        <line 
          x1={padding.left} 
          y1={chartHeight - padding.bottom} 
          x2={chartWidth - padding.right} 
          y2={chartHeight - padding.bottom} 
          stroke="#64748b" 
          strokeWidth="2"
        />
        
        {/* Axe Y */}
        <line 
          x1={padding.left} 
          y1={padding.top} 
          x2={padding.left} 
          y2={chartHeight - padding.bottom} 
          stroke="#64748b" 
          strokeWidth="2"
        />
        
        {/* Aires sous les courbes */}
        <path 
          d={`${expensePath} L ${expensePoints[expensePoints.length - 1].x},${chartHeight - padding.bottom} L ${padding.left},${chartHeight - padding.bottom} Z`}
          fill="rgba(239, 68, 68, 0.1)"
        />
        <path 
          d={`${incomePath} L ${incomePoints[incomePoints.length - 1].x},${chartHeight - padding.bottom} L ${padding.left},${chartHeight - padding.bottom} Z`}
          fill="rgba(34, 197, 94, 0.1)"
        />
        
        {/* Lignes avec animations */}
        <path 
          d={expensePath} 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: 'drawLine 2s ease-in-out forwards'
          }}
        />
        <path 
          d={incomePath} 
          fill="none" 
          stroke="#22c55e" 
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: 'drawLine 2s ease-in-out 0.5s forwards'
          }}
        />
        
        {/* Points avec tooltips */}
        {expensePoints.map((point, i) => (
          <g key={`expense-${i}`}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="7" 
              fill="#ef4444" 
              stroke="white" 
              strokeWidth="3"
              className="drop-shadow-lg hover:r-9 transition-all cursor-pointer hover:fill-red-600"
            />
            <title>Expenses: MGA {data[i].expense.toLocaleString()} ({data[i].month})</title>
          </g>
        ))}
        {incomePoints.map((point, i) => (
          <g key={`income-${i}`}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="7" 
              fill="#22c55e" 
              stroke="white" 
              strokeWidth="3"
              className="drop-shadow-lg hover:r-9 transition-all cursor-pointer hover:fill-green-600"
            />
            <title>Income: MGA {data[i].income.toLocaleString()} ({data[i].month})</title>
          </g>
        ))}
        
        {/* Labels des mois */}
        {data.map((d, i) => (
          <text 
            key={i}
            x={padding.left + (i * xStep)} 
            y={chartHeight - padding.bottom + 25} 
            textAnchor="middle" 
            fontSize="13" 
            fill="#64748b"
            fontWeight="600"
          >
            {d.month}
          </text>
        ))}
      </svg>
      
      {/* Statistiques en bas */}
      <div className="mt-6 grid grid-cols-2 gap-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></span>
            <span className="text-sm font-semibold text-gray-700">Total Expenses</span>
          </div>
          <div className="text-xl font-bold text-red-600">
            MGA {data.reduce((sum, d) => sum + d.expense, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: MGA {Math.round(data.reduce((sum, d) => sum + d.expense, 0) / data.length).toLocaleString()}/month
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></span>
            <span className="text-sm font-semibold text-gray-700">Total Income</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            MGA {data.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: MGA {Math.round(data.reduce((sum, d) => sum + d.income, 0) / data.length).toLocaleString()}/month
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
