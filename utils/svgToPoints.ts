/**
 * SVG to Point Cloud Converter
 * Converts SVG paths into an array of point coordinates with color info
 */

export interface Point {
  x: number;
  y: number;
}

export interface ColoredPoint extends Point {
  color: string;
}

// density = points per 100px of path length
function pathToPoints(pathData: string, density: number): Point[] {
  const points: Point[] = [];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  svg.appendChild(path);

  const pathLength = path.getTotalLength();
  // Scale point count by path length so density is uniform
  const count = Math.max(2, Math.round((pathLength / 100) * density));
  const step = pathLength / count;

  for (let i = 0; i <= count; i++) {
    const point = path.getPointAtLength(i * step);
    points.push({ x: point.x, y: point.y });
  }

  return points;
}

function extractFillColor(el: Element): string {
  // Check inline style first
  const style = el.getAttribute('style') || '';
  const fillMatch = style.match(/fill:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (fillMatch) {
    return `rgb(${fillMatch[1]},${fillMatch[2]},${fillMatch[3]})`;
  }

  // Check fill attribute
  const fill = el.getAttribute('fill');
  if (fill && fill !== 'none') return fill;

  // Walk up to parent group for inherited fill
  const parent = el.parentElement;
  if (parent && parent.tagName !== 'svg') {
    return extractFillColor(parent);
  }

  return '#ffffff';
}

export function svgToColoredPoints(
  svgString: string,
  density: number = 100
): ColoredPoint[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const paths = doc.querySelectorAll('path');

  const result: { points: Point[]; color: string }[] = [];

  paths.forEach((path) => {
    if (path.closest('clipPath') || path.closest('defs') || path.closest('mask')) {
      return;
    }
    const style = path.getAttribute('style') || '';
    if (style.includes('fill:none')) return;

    const pathData = path.getAttribute('d');
    if (!pathData) return;

    const color = extractFillColor(path);
    const points = pathToPoints(pathData, density);
    result.push({ points, color });
  });

  // Flatten and compute global bounds for normalization
  const allRaw: ColoredPoint[] = [];
  result.forEach(({ points, color }) => {
    points.forEach((p) => allRaw.push({ ...p, color }));
  });

  return allRaw;
}

export function normalizeColoredPoints(
  points: ColoredPoint[],
  width: number,
  height: number
): ColoredPoint[] {
  if (points.length === 0) return [];

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const scale = Math.min(width / (maxX - minX), height / (maxY - minY));

  return points.map((p) => ({
    x: (p.x - minX) * scale,
    y: (p.y - minY) * scale,
    color: p.color,
  }));
}

// Keep old exports for backward compat
export function svgToPoints(svgString: string, density: number = 100): Point[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const paths = doc.querySelectorAll('path');
  const allPoints: Point[][] = [];

  paths.forEach((path) => {
    if (path.closest('clipPath') || path.closest('defs') || path.closest('mask')) return;
    const style = path.getAttribute('style') || '';
    if (style.includes('fill:none')) return;
    const pathData = path.getAttribute('d');
    if (pathData) allPoints.push(pathToPoints(pathData, density));
  });

  return allPoints;
}

export function normalizePoints(points: Point[], width: number, height: number): Point[] {
  if (points.length === 0) return [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const scale = Math.min(width / (maxX - minX), height / (maxY - minY));
  return points.map((p) => ({ x: (p.x - minX) * scale, y: (p.y - minY) * scale }));
}
