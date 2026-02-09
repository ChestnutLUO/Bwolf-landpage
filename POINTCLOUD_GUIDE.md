# SVG 点云效果实现指南

## 概述

这个实现将 SVG 矢量图转换为动态点云效果，使用 Canvas 渲染和 GSAP 动画。

## 文件结构

```
utils/
  └── svgToPoints.ts       # SVG 路径解析和点采样工具
components/
  ├── PointCloud.tsx       # 点云组件
  └── PointCloudDemo.tsx   # 演示页面
```

## 核心原理

### 1. SVG 路径解析
- 使用浏览器原生 `SVGPathElement.getTotalLength()` 和 `getPointAtLength()` API
- 沿着 SVG 路径均匀采样点
- 支持多路径 SVG

### 2. 点云渲染
- 使用 Canvas 2D 渲染，性能优秀
- 每个点作为一个粒子
- 支持自定义点大小、颜色、密度

### 3. 动画效果
- 使用 GSAP 实现平滑动画
- 粒子从随机位置聚合到目标位置
- 可自定义动画时长和缓动函数

## 使用方法

### 基础用法

```tsx
import PointCloud from './components/PointCloud';

function App() {
  return (
    <PointCloud
      svgPath="/lxm.svg"
      width={800}
      height={625}
      pointSize={2}
      pointColor="#faecde"
      density={50}
      animationDuration={2.5}
    />
  );
}
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `svgPath` | string | 必填 | SVG 文件路径或内联 SVG 字符串 |
| `width` | number | 800 | Canvas 宽度 |
| `height` | number | 600 | Canvas 高度 |
| `pointSize` | number | 2 | 点的大小（像素） |
| `pointColor` | string | '#ffffff' | 点的颜色 |
| `density` | number | 50 | 每条路径采样的点数 |
| `animationDuration` | number | 2 | 动画时长（秒） |
| `className` | string | '' | 额外的 CSS 类名 |

## 高级用法

### 1. 使用内联 SVG

```tsx
const svgString = `
  <svg viewBox="0 0 100 100">
    <path d="M10,10 L90,90" />
  </svg>
`;

<PointCloud svgPath={svgString} />
```

### 2. 动态调整参数

```tsx
const [density, setDensity] = useState(50);

<PointCloud
  svgPath="/lxm.svg"
  density={density}
  key={density} // 重新挂载组件以应用新参数
/>
```

### 3. 自定义动画

修改 `PointCloud.tsx` 中的 GSAP 动画配置：

```tsx
gsap.to(particlesRef.current, {
  x: (i) => particlesRef.current[i].targetX,
  y: (i) => particlesRef.current[i].targetY,
  duration: animationDuration,
  ease: 'elastic.out(1, 0.5)', // 弹性缓动
  stagger: {
    amount: 1,
    from: 'center', // 从中心开始
  },
});
```

## 性能优化建议

1. **控制点密度**：密度越高，点越多，性能消耗越大
   - 简单图形：20-30
   - 中等复杂：50-70
   - 复杂图形：80-100

2. **使用 requestAnimationFrame**：已在组件中实现

3. **Canvas 优化**：
   - 使用离屏 Canvas 预渲染
   - 减少 `clearRect` 调用
   - 使用 `willReadFrequently` 优化

## 扩展功能

### 1. 鼠标交互

```tsx
const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return;

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // 粒子躲避鼠标
  particlesRef.current.forEach((particle) => {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      particle.vx += dx / distance * 2;
      particle.vy += dy / distance * 2;
    }
  });
};
```

### 2. 颜色渐变

```tsx
// 根据位置设置颜色
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#ff0000');
gradient.addColorStop(1, '#0000ff');
ctx.fillStyle = gradient;
```

### 3. 粒子连线

```tsx
// 连接相近的粒子
particlesRef.current.forEach((p1, i) => {
  particlesRef.current.slice(i + 1).forEach((p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50) {
      ctx.strokeStyle = `rgba(255,255,255,${1 - distance / 50})`;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
});
```

## 故障排查

### 问题：点云不显示
- 检查 SVG 路径是否正确
- 确认 Canvas 尺寸设置
- 查看浏览器控制台错误

### 问题：性能卡顿
- 降低 `density` 参数
- 减小 Canvas 尺寸
- 检查是否有内存泄漏

### 问题：动画不流畅
- 确认 GSAP 已正确安装
- 检查 `animationDuration` 设置
- 使用性能分析工具检查

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- IE11: ❌ 不支持（需要 polyfill）

## 许可证

MIT
