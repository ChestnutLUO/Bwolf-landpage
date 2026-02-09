/**
 * SVG to Point Cloud Converter
 * Converts SVG paths into an array of point coordinates
 */

interface Point {
  x: number;
  y: number;
}

/**
 * Parse SVG path data and sample points along the path
 * @param pathData - SVG path d attribute string
 * @param density - Number of points to sample (higher = more detailed)
 * @returns Array of {x, y} points
 */
export function pathToPoints(pathData: string, density: number = 100): Point[] {
  const points: Point[] = [];

  // Create a temporary SVG element to use browser's path parsing
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  svg.appendChild(path);

  const pathLength = path.getTotalLength();
  const step = pathLength / density;

  for (let i = 0; i <= density; i++) {
    const point = path.getPointAtLength(i * step);
    points.push({ x: point.x, y: point.y });
  }

  return points;
}

/**
 * Extract all paths from an SVG string and convert to points
 * @param svgString - Complete SVG markup as string
 * @param density - Points per path
 * @returns Array of point arrays (one per path)
 */
export function svgToPoints(svgString: string, density: number = 100): Point[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const paths = doc.querySelectorAll('path');

  const allPoints: Point[][] = [];

  paths.forEach((path) => {
    // Skip paths inside clipPath, defs, or mask elements
    if (path.closest('clipPath') || path.closest('defs') || path.closest('mask')) {
      return;
    }

    // Skip paths with fill:none (invisible paths)
    const style = path.getAttribute('style') || '';
    if (style.includes('fill:none')) {
      return;
    }

    const pathData = path.getAttribute('d');
    if (pathData) {
      const points = pathToPoints(pathData, density);
      allPoints.push(points);
    }
  });

  return allPoints;
}

/**
 * Normalize points to fit within a bounding box
 * @param points - Array of points
 * @param width - Target width
 * @param height - Target height
 * @returns Normalized points
 */
export function normalizePoints(
  points: Point[],
  width: number,
  height: number
): Point[] {
  if (points.length === 0) return [];

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  const scaleX = width / (maxX - minX);
  const scaleY = height / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  return points.map((p) => ({
    x: (p.x - minX) * scale,
    y: (p.y - minY) * scale,
  }));
}
