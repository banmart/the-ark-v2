import React from 'react';
import { MetricCard as MetricCardType } from '../../hooks/useChartData';
interface MetricCardsProps {
  metrics: MetricCardType[];
  loading: boolean;
}
const MetricCards = ({
  metrics,
  loading
}: MetricCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="glass-card rounded-xl p-4 border border-gray-400/20 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="w-20 h-4 bg-gray-600 rounded"></div>
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
            <div className="w-24 h-6 bg-gray-600 rounded mb-1"></div>
            <div className="w-16 h-3 bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'text-cyan-400 border-cyan-400/20';
      case 'blue':
        return 'text-blue-400 border-blue-400/20';
      case 'orange':
        return 'text-orange-400 border-orange-400/20';
      case 'purple':
        return 'text-purple-400 border-purple-400/20';
      default:
        return 'text-cyan-400 border-cyan-400/20';
    }
  };
  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-gray-400';
  };
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => <div key={index} className={`glass-card rounded-xl p-4 border ${getColorClasses(metric.color)} hover:scale-105 transition-transform duration-200`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">
              {metric.title}
            </span>
            <span className="text-lg">{metric.icon}</span>
          </div>
          <div className={`text-xl font-bold ${getColorClasses(metric.color).split(' ')[0]} mb-1`}>
            {metric.value}
          </div>
          <div className={`text-xs font-medium ${getChangeColor(metric.change)}`}>
            {metric.change} 24h
          </div>
        </div>)}
    </div>;
};
export default MetricCards;
