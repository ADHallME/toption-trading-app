import dynamic from 'next/dynamic';
import React from 'react';

const Plot = dynamic(() => import('react-plotly.js').then(mod => mod.default) as any, { ssr: false });

interface PlotlyChartProps {
  data: any[];
  layout?: any;
  config?: any;
  style?: React.CSSProperties;
}

const PlotlyChart: React.FC<PlotlyChartProps> = ({ data, layout, config, style }) => {
  return (Plot as any)({
    data,
    layout: { autosize: true, margin: { t: 40, l: 40, r: 40, b: 40 }, ...layout },
    config,
    style,
    useResizeHandler: true,
  });
};

export default PlotlyChart; 