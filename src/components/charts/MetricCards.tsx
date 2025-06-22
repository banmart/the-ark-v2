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
    return;
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