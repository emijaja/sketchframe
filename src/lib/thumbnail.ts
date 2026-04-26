import { CharGrid } from './grid-model';
import { LIGHT_COLORS, ThemeColors } from './constants';
import { drawGrid, RenderConfig } from './grid-renderer';

export function generateThumbnail(
  grid: CharGrid,
  cellWidth: number,
  cellHeight: number,
  colors: ThemeColors = LIGHT_COLORS,
): string {
  const canvas = document.createElement('canvas');
  const w = grid.cols * cellWidth;
  const h = grid.rows * cellHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  const config: RenderConfig = { cellWidth, cellHeight, showGridLines: false };
  drawGrid(ctx, grid, config, null, null, false, null, null, null, null, colors);

  return canvas.toDataURL('image/jpeg', 0.6);
}
