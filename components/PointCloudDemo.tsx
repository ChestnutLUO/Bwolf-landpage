import React, { useState } from 'react';
import PointCloud from './PointCloud';

const PointCloudDemo: React.FC = () => {
  const [density, setDensity] = useState(50);
  const [pointSize, setPointSize] = useState(2);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          SVG 点云效果演示
        </h1>
        <p className="text-gray-400">
          将 lxm.svg 矢量图转换为动态点云
        </p>
      </div>

      {/* Point Cloud Canvas */}
      <div className="mb-8 border border-white/20 rounded-lg overflow-hidden">
        <PointCloud
          svgPath="/lxm.svg"
          width={800}
          height={625}
          pointSize={pointSize}
          pointColor="#faecde"
          density={density}
          animationDuration={2.5}
          className="bg-black"
        />
      </div>

      {/* Controls */}
      <div className="bg-white/5 p-6 rounded-lg border border-white/10 max-w-md w-full">
        <div className="mb-6">
          <label className="block text-white text-sm font-mono mb-2">
            点密度: {density}
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-mono mb-2">
            点大小: {pointSize}px
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={pointSize}
            onChange={(e) => setPointSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="text-xs text-gray-400 font-mono">
          <p>• 点密度控制每条路径上采样的点数</p>
          <p>• 点大小控制每个粒子的渲染大小</p>
          <p>• 修改参数后刷新页面查看效果</p>
        </div>
      </div>
    </div>
  );
};

export default PointCloudDemo;
