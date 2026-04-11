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
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        importCanvas(data.canvas as SerializedDocument);
        onLoaded?.({ id: data.id, title: data.title });
      })
      .catch(console.error);
  }, [wireframeId, importCanvas, onLoaded]);
}
