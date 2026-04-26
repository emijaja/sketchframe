import { useCallback, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { useSceneStore } from './use-scene-store';
import { generateThumbnail } from '@/lib/thumbnail';
import { LIGHT_COLORS, DARK_COLORS } from '@/lib/constants';
import { jsonMutator } from '@/lib/swr/fetcher';

export function useSaveWireframe() {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('Untitled');

  const createMutation = useSWRMutation(
    '/api/wireframes',
    jsonMutator<{ id: string }>,
  );
  const patchMutation = useSWRMutation(
    currentId ? `/api/wireframes/${currentId}` : null,
    jsonMutator<{ success: true }>,
  );

  const save = useCallback(async () => {
    const state = useSceneStore.getState();
    const canvas = state.exportCanvas();
    const markdown = state.renderedGrid.toMarkdown();
    const colors = state.theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

    const canvasEl = document.querySelector('canvas');
    const cellWidth = canvasEl ? canvasEl.width / (window.devicePixelRatio || 1) / state.document.gridCols : 8.4;
    const cellHeight = canvasEl ? canvasEl.height / (window.devicePixelRatio || 1) / state.document.gridRows : 18.2;

    const thumbnail = generateThumbnail(state.renderedGrid, cellWidth, cellHeight, colors);

    if (currentId) {
      await patchMutation.trigger({
        method: 'PATCH',
        body: { title, canvas, markdown, thumbnail },
      });
      return currentId;
    }

    const created = await createMutation.trigger({
      method: 'POST',
      body: {
        title,
        canvas,
        markdown,
        thumbnail,
        width: state.document.gridCols,
        height: state.document.gridRows,
      },
    });
    setCurrentId(created.id);
    return created.id;
  }, [currentId, title, createMutation, patchMutation]);

  const saving = createMutation.isMutating || patchMutation.isMutating;

  return { save, saving, currentId, setCurrentId, title, setTitle };
}
