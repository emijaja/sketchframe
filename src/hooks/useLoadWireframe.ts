import { useEffect } from 'react';
import { useSceneStore } from './use-scene-store';
import type { SerializedDocument } from '@/lib/scene/serialization';

export function useLoadWireframe(
  wireframeId: string | null,
  onLoaded?: (data: { id: string; title: string }) => void,
) {
  const importCanvas = useSceneStore((s) => s.importCanvas);

  useEffect(() => {
    if (!wireframeId) return;

    fetch(`/api/wireframes/${wireframeId}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const serverMessage =
            data && typeof data === 'object' && typeof data.error === 'string'
              ? data.error
              : null;
          const fallback =
            res.status === 401
              ? 'Unauthorized'
              : res.status === 404
                ? 'Not found'
                : `Request failed with status ${res.status}`;
          throw new Error(serverMessage ?? fallback);
        }

        return data;
      })
      .then((data) => {
        importCanvas(data.canvas as SerializedDocument);
        onLoaded?.({ id: data.id, title: data.title });
      })
      .catch(console.error);
  }, [wireframeId, importCanvas, onLoaded]);
}
