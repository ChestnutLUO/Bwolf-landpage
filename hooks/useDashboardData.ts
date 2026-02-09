import { useState, useEffect, useCallback } from "react";
import { DashboardData, StreamMetric, ChartDataPoint } from "../types";
import { MOCK_DASHBOARD_DATA, MOCK_METRICS, CHART_DATA } from "../constants";

const POLLING_INTERVAL = 60_000;

function formatUptime(startTime: string): string {
  const diff = Date.now() - new Date(startTime).getTime();
  if (diff < 0) return "00:00:00";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function toMetrics(data: DashboardData): StreamMetric[] {
  const uptime = data.session?.start_time
    ? formatUptime(data.session.start_time)
    : "00:00:00";

  const totalDanmaku = data.danmaku_chart.reduce(
    (s, d) => s + d.value,
    0,
  );

  return [
    {
      id: "LIVE-01",
      streamer: data.room.uname || "狼姐直播间",
      viewers: data.session?.peak_online ?? 0,
      status: data.is_live ? "LIVE" : "OFFLINE",
      category: data.session?.areas?.split(",")[0] || "未知",
      uptime,
      bitrate: 6000,
      fps: 60,
    },
    {
      id: "HIST-01",
      streamer: "历史场次",
      viewers: data.recent_sessions.length,
      status: "LIVE",
      category: "数据统计",
      uptime: `${data.recent_sessions.length} 场`,
      bitrate: 0,
      fps: 0,
    },
    {
      id: "DM-01",
      streamer: "弹幕互动",
      viewers: totalDanmaku,
      status: data.is_live ? "LIVE" : "OFFLINE",
      category: "弹幕分析",
      uptime: `${totalDanmaku} 条`,
      bitrate: 0,
      fps: 0,
    },
    {
      id: "FAN-01",
      streamer: "粉丝数据",
      viewers: data.followers,
      status: "LIVE",
      category: `粉丝团 ${data.medals}`,
      uptime: `${data.followers.toLocaleString()} 粉丝`,
      bitrate: 0,
      fps: 0,
    },
  ];
}

export interface UseDashboardResult {
  metrics: StreamMetric[];
  viewerChart: ChartDataPoint[];
  danmakuChart: ChartDataPoint[];
  isLive: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: DashboardData = await res.json();
      setData(json);
      setError(null);
    } catch (e: any) {
      console.error("Dashboard fetch failed, using mock data:", e);
      setError(e);
      setData(MOCK_DASHBOARD_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const poll = async () => {
      await fetchData();
      timeoutId = window.setTimeout(poll, POLLING_INTERVAL);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        window.clearTimeout(timeoutId);
        poll();
      } else {
        window.clearTimeout(timeoutId);
      }
    };

    poll();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchData]);

  if (!data) {
    return {
      metrics: MOCK_METRICS,
      viewerChart: CHART_DATA,
      danmakuChart: CHART_DATA,
      isLive: false,
      isLoading,
      error,
    };
  }

  return {
    metrics: toMetrics(data),
    viewerChart:
      data.viewer_chart.length > 0 ? data.viewer_chart : CHART_DATA,
    danmakuChart:
      data.danmaku_chart.length > 0 ? data.danmaku_chart : CHART_DATA,
    isLive: data.is_live,
    isLoading,
    error,
  };
}
