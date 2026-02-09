import { StreamMetric, ChartDataPoint } from './types';

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