export interface StreamMetric {
  id: string;
  streamer: string;
  viewers: number;
  status: 'LIVE' | 'OFFLINE' | 'BUFFERING';
  category: string;
  uptime: string;
  bitrate: number; // kbps
  fps: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  value2?: number;
}