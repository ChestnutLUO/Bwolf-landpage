import { StreamMetric, ChartDataPoint, DashboardData } from './types';

export const HERO_TEXT = [
  "狼小妹",
  "直播数据",
  "监控"
];

export const MOCK_METRICS: StreamMetric[] = [
  { id: 'WS-01', streamer: '狼姐直播间', viewers: 28450, status: 'LIVE', category: '聊天互动', uptime: '02:14:30', bitrate: 6000, fps: 60 },
  { id: 'DB-01', streamer: 'Grafana监控', viewers: 120, status: 'LIVE', category: '数据监控', uptime: '24:00:00', bitrate: 1000, fps: 1 },
  { id: 'WC-01', streamer: '弹幕词云', viewers: 45, status: 'BUFFERING', category: '数据分析', uptime: '00:05:00', bitrate: 0, fps: 0 },
  { id: 'SYS-01', streamer: '系统核心', viewers: 9999, status: 'LIVE', category: '主机', uptime: '99:99:99', bitrate: 9000, fps: 120 },
];

export const CHART_DATA: ChartDataPoint[] = [
  { time: '18:00', value: 4000, value2: 2400 },
  { time: '18:05', value: 3000, value2: 1398 },
  { time: '18:10', value: 5000, value2: 9800 },
  { time: '18:15', value: 7780, value2: 3908 },
  { time: '18:20', value: 8890, value2: 4800 },
  { time: '18:25', value: 9390, value2: 3800 },
  { time: '18:30', value: 10490, value2: 4300 },
  { time: '18:35', value: 12490, value2: 5300 },
  { time: '18:40', value: 11490, value2: 6300 },
  { time: '18:45', value: 10590, value2: 7100 },
];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  room: { uname: '狼小妹', title: '直播中...', cover: '' },
  is_live: true,
  session: {
    id: 0,
    start_time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    end_time: null,
    peak_online: 28450,
    avg_online: 15200,
    titles: '聊天互动',
    areas: '娱乐',
  },
  recent_sessions: [],
  viewer_chart: CHART_DATA,
  danmaku_chart: CHART_DATA.map((d) => ({
    time: d.time,
    value: Math.round(d.value / 10),
    value2: Math.round((d.value2 ?? 0) / 20),
  })),
  followers: 88888,
  medals: 6666,
};