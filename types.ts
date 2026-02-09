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

export interface DashboardSession {
  id: number;
  start_time: string;
  end_time: string | null;
  peak_online: number;
  avg_online: number;
  titles: string;
  areas: string;
}

export interface DashboardData {
  room: {
    uname: string;
    title: string;
    cover: string;
  };
  is_live: boolean;
  session: DashboardSession | null;
  recent_sessions: DashboardSession[];
  viewer_chart: ChartDataPoint[];
  danmaku_chart: ChartDataPoint[];
  followers: number;
  medals: number;
}