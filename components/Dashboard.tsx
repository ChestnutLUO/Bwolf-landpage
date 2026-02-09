import React, { useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Wifi, Users, Server, ExternalLink } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";

gsap.registerPlugin(ScrollTrigger);

const Dashboard: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { metrics, viewerChart, danmakuChart, isLive } = useDashboardData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax for cards (staggered slightly)
      gsap.utils.toArray(".data-card").forEach((card: any, i) => {
        gsap.to(card, {
          y: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + i * 0.1, // varied scrub speeds for depth
          },
        });
      });

      // Animate Cards entering
      gsap.from(".data-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 100, // Increased distance for entry
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Animate Chart drawing
      gsap.from(".chart-container", {
        scrollTrigger: {
          trigger: ".chart-section",
          start: "top 75%",
        },
        scaleY: 0,
        transformOrigin: "bottom",
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      boxShadow: "0 10px 30px -10px rgba(234, 179, 8, 0.2)",
      borderColor: "rgba(234, 179, 8, 0.6)",
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(e.currentTarget.querySelector(".card-icon"), {
      rotate: 15,
      scale: 1.2,
      color: "#EAB308",
      duration: 0.4,
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      boxShadow: "none",
      borderColor: "#1f2937",
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(e.currentTarget.querySelector(".card-icon"), {
      rotate: 0,
      scale: 1,
      color: "currentColor",
      duration: 0.4,
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur border border-yellow-500/30 p-3 font-mono text-xs shadow-xl">
          <p className="text-gray-400 mb-2 border-b border-gray-800 pb-1">
            {label}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-yellow-500"></div>
            <p className="text-white">在线: {payload[0].value}</p>
          </div>
          {payload[1] && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white"></div>
              <p className="text-white">峰值: {payload[1].value}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-[#080808] text-white py-24 px-4 md:px-12 relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-800 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2">
              实时数据
            </h2>
            <p className="font-mono text-gray-500">狼小妹 // 直播数据分析</p>
          </div>
          <div className="font-mono text-right mt-4 md:mt-0">
            <div
              className={`${isLive ? "text-green-500" : "text-gray-500"} flex items-center justify-end gap-2`}
            >
              <div
                className={`w-2 h-2 ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"} rounded-full`}
              ></div>
              {isLive ? "直播中" : "未开播"}
            </div>
            <div className="text-xs text-gray-600">数据源: BILIBILI</div>
          </div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, idx) => (
            <div
              key={metric.id}
              className="data-card bg-[#0F0F0F] border border-gray-800 p-6 relative group overflow-hidden cursor-pointer"
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute top-0 right-0 p-4 opacity-30 card-icon transition-all">
                {idx === 0 && <Activity size={24} />}
                {idx === 1 && <Wifi size={24} />}
                {idx === 2 && <Users size={24} />}
                {idx === 3 && <Server size={24} />}
              </div>

              <div className="font-mono text-xs text-gray-500 mb-4 flex justify-between items-center">
                <span>ID: {metric.id}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] ${metric.status === "LIVE" ? "bg-green-900/30 text-green-400 border border-green-900" : "bg-red-900/30 text-red-400 border border-red-900"}`}
                >
                  {metric.status}
                </span>
              </div>

              <div className="text-xl font-bold mb-1 group-hover:text-yellow-500 transition-colors duration-300">
                {metric.streamer}
              </div>

              <div className="font-mono text-sm text-gray-400 mb-4">
                {metric.viewers.toLocaleString()}{" "}
                <span className="text-[10px]">{metric.id === 'FAN-01' ? '粉丝' : '观众'}</span>
              </div>

              {/* Mini visual bar */}
              <div className="w-full h-1 bg-gray-800 mt-auto relative">
                <div
                  className="h-full bg-white group-hover:bg-yellow-500 transition-colors duration-300"
                  style={{ width: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[8px] border-r-[8px] border-b-transparent border-r-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 chart-section">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#0F0F0F] border border-gray-800 p-6 chart-container relative group hover:border-gray-700 transition-colors">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 group-hover:border-yellow-500/50 transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 group-hover:border-yellow-500/50 transition-colors"></div>

            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <span className="w-2 h-4 bg-yellow-500 block"></span>
                在线人数
              </h3>
              <div className="flex gap-2 font-mono text-xs">
                <span className="px-2 py-1 bg-yellow-500 text-black font-bold cursor-pointer">
                  实时
                </span>
                <span className="px-2 py-1 bg-gray-800 text-gray-400 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors">
                  历史
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewerChart}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#222"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#444"
                    tick={{ fontSize: 12, fontFamily: "monospace" }}
                  />
                  <YAxis
                    stroke="#444"
                    tick={{ fontSize: 12, fontFamily: "monospace" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#EAB308"
                    fillOpacity={1}
                    fill="url(#colorVal)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="value2"
                    stroke="#666"
                    fillOpacity={1}
                    fill="url(#colorVal2)"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Chart */}
          <div className="bg-[#0F0F0F] border border-gray-800 p-6 chart-container flex flex-col relative group hover:border-gray-700 transition-colors">
            <h3 className="font-bold text-xl mb-6">弹幕活跃度</h3>
            <div className="h-[200px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={danmakuChart.slice(0, 8)}>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#222" }}
                  />
                  <Bar dataKey="value" fill="#333" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="value2" fill="#EAB308" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-auto space-y-4">
              <div className="border-t border-gray-800 pt-4">
                <div className="flex justify-between font-mono text-sm mb-1">
                  <span className="text-gray-400">弹幕总数</span>
                  <span className="text-yellow-500">
                    {danmakuChart
                      .reduce((s, d) => s + d.value, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-800 overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[75%] shadow-[0_0_10px_#EAB308]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-sm mb-1">
                  <span className="text-gray-400">独立用户</span>
                  <span>
                    {danmakuChart
                      .reduce((s, d) => s + (d.value2 ?? 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-800">
                  <div className="h-full bg-white w-[45%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <a
                href="https://grafana.bwolf.work"
                className="flex items-center justify-between text-xs font-mono text-gray-500 hover:text-white transition-colors group/link"
              >
                <span>查看完整报告</span>
                <ExternalLink
                  size={12}
                  className="group-hover/link:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-20 border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-gray-500 font-mono text-xs">
          <div>
            BWOLF.WORK 数据分析 © 2026
            <br />
            监控目标: 狼小妹直播间
          </div>
          <div className="mt-4 md:mt-0 text-right">
            安全连接
            <br />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
