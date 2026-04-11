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
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const config: RenderConfig = { cellWidth, cellHeight, showGridLines: false };
  drawGrid(ctx, grid, config, null, null, false, null, null, null, null, colors);

  return canvas.toDataURL('image/jpeg', 0.6);
}
