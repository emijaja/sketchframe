import { useCallback, useState } from 'react';
import { useSceneStore } from './use-scene-store';
import { generateThumbnail } from '@/lib/thumbnail';
import { LIGHT_COLORS, DARK_COLORS } from '@/lib/constants';

export function useSaveWireframe() {
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('Untitled');

  const save = useCallback(async () => {
    const state = useSceneStore.getState();
    const canvas = state.exportCanvas();
    const markdown = state.renderedGrid.toMarkdown();
    const colors = state.theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

    // Measure cell size from existing canvas element
    const canvasEl = document.querySelector('canvas');
    const cellWidth = canvasEl ? canvasEl.width / (window.devicePixelRatio || 1) / state.document.gridCols : 8.4;
    const cellHeight = canvasEl ? canvasEl.height / (window.devicePixelRatio || 1) / state.document.gridRows : 18.2;

    const thumbnail = generateThumbnail(state.renderedGrid, cellWidth, cellHeight, colors);

    setSaving(true);
    try {
      if (currentId) {
        const res = await fetch(`/api/wireframes/${currentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, canvas, markdown, thumbnail }),
        });
        if (!res.ok) {
          throw new Error(
            `Failed to update wireframe: ${res.status} ${res.statusText}`,
          );
        }
        return currentId;
      } else {
        const res = await fetch('/api/wireframes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            canvas,
            markdown,
            thumbnail,
            width: state.document.gridCols,
            height: state.document.gridRows,
          }),
        });
        if (!res.ok) {
          throw new Error(
            `Failed to create wireframe: ${res.status} ${res.statusText}`,
          );
        }
        const data = await res.json();
        setCurrentId(data.id);
        return data.id as string;
      }
    } finally {
      setSaving(false);
    }
  }, [currentId, title]);

  return { save, saving, currentId, setCurrentId, title, setTitle };
}
