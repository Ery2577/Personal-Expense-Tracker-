import { useState, useEffect } from 'react';

interface SimpleBarChartProps {
  expenses: number;
  revenue: number;
  balance: number;
}

export default function SimpleBarChart({ expenses, revenue, balance }: SimpleBarChartProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimationComplete(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate max value for scaling
  const maxValue = Math.max(expenses, revenue, Math.abs(balance)) || 1;
  const chartHeight = 200;

  // Calculate heights for bars
  const expenseHeight = animationComplete ? (expenses / maxValue) * chartHeight : 0;
  const revenueHeight = animationComplete ? (revenue / maxValue) * chartHeight : 0;
  const balanceHeight = animationComplete ? (Math.abs(balance) / maxValue) * chartHeight : 0;

  return (
    <div className="relative w-full">
      {/* Simple Chart Container */}
      <div className="bg-gray-50 rounded-xl p-6 flex items-end justify-center space-x-8" style={{ height: `${chartHeight + 80}px` }}>
        {/* Expenses Bar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs font-semibold text-gray-600">
            MGA {expenses.toLocaleString()}
          </div>
          <div 
            className="bg-red-500 rounded-t-lg w-16 transition-all duration-1000 ease-out"
            style={{ height: `${expenseHeight}px` }}
          ></div>
          <div className="text-sm font-medium text-gray-700">Expenses</div>
        </div>

        {/* Revenue Bar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs font-semibold text-gray-600">
            MGA {revenue.toLocaleString()}
          </div>
          <div 
            className="bg-green-500 rounded-t-lg w-16 transition-all duration-1000 ease-out"
            style={{ height: `${revenueHeight}px` }}
          ></div>
          <div className="text-sm font-medium text-gray-700">Revenue</div>
        </div>

        {/* Balance Bar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs font-semibold text-gray-600">
            MGA {Math.abs(balance).toLocaleString()}
          </div>
          <div 
            className={`${balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-t-lg w-16 transition-all duration-1000 ease-out`}
            style={{ height: `${balanceHeight}px` }}
          ></div>
          <div className="text-sm font-medium text-gray-700">Balance</div>
        </div>
      </div>

      {/* Simple Legend */}
      <div className="flex space-x-6 mt-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Expenses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
          <span className="text-sm text-gray-700">Balance</span>
        </div>
      </div>
    </div>
  );
}
