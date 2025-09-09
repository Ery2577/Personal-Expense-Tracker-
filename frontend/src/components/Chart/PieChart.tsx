import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
}

export default function PieChart({ data }: PieChartProps) {
  // Calculer le total
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;

  // Générer les arcs du pie chart avec hover effect
  const arcs = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // Points pour l'arc normal et hover
    const radius = 45;
    const hoverRadius = 48;
    const x1 = 50 + radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = 50 + radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = 50 + radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = 50 + radius * Math.sin(endAngle - Math.PI / 2);
    
    // Chemin pour l'arc
    const dPath = `M50,50 L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
    
    // Position pour le pourcentage
    const midAngle = (startAngle + endAngle) / 2 - Math.PI / 2;
    const textX = 50 + 28 * Math.cos(midAngle);
    const textY = 50 + 28 * Math.sin(midAngle);
    const percentage = Math.round((d.value / total) * 100);
    
    return (
      <g key={i} className="transition-all duration-300 hover:drop-shadow-lg cursor-pointer group">
        <path 
          d={dPath} 
          fill={d.color}
          stroke="#fff"
          strokeWidth="3"
          className="transition-all duration-300 group-hover:brightness-110"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
        {percentage >= 5 && (
          <text 
            x={textX} 
            y={textY} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontSize="10" 
            fill="white" 
            fontWeight="bold"
            className="pointer-events-none drop-shadow-sm"
          >
            {percentage}%
          </text>
        )}
      </g>
    );
  });

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="relative">
        <svg width={240} height={240} viewBox="0 0 100 100" className="drop-shadow-xl">
          {/* Cercle de fond avec gradient */}
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="url(#bgGradient)" stroke="#cbd5e1" strokeWidth="0.5"/>
          
          {arcs}
          
          {/* Cercle central pour créer un donut avec gradient */}
          <defs>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="18" fill="url(#centerGradient)" stroke="#e2e8f0" strokeWidth="1" className="drop-shadow-sm"/>
          
          {/* Texte central */}
          <text x="50" y="45" textAnchor="middle" fontSize="5" fill="#64748b" fontWeight="600">TOTAL SPENT</text>
          <text x="50" y="52" textAnchor="middle" fontSize="6" fill="#1e293b" fontWeight="bold">
            MGA {total >= 1000000 ? `${(total / 1000000).toFixed(1)}M` : total >= 1000 ? `${(total / 1000).toFixed(0)}K` : total.toFixed(0)}
          </text>
          <text x="50" y="58" textAnchor="middle" fontSize="4" fill="#64748b">
            {data.length} categories
          </text>
        </svg>
      </div>
      
      <div className="w-full max-w-md">
        <div className="space-y-3">
          {data.slice(0, 8).map((d, i) => {
            const percentage = Math.round((d.value / total) * 100);
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" 
                    style={{ background: d.color }}
                  ></div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{d.label}</div>
                    <div className="text-xs text-gray-500">MGA {d.value.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-700">{percentage}%</div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        background: d.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
          {data.length > 8 && (
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <span className="text-sm text-gray-500 font-medium">
                +{data.length - 8} more categories
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
