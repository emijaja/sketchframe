import { useEffect, useRef } from 'react';
import { useSceneStore } from './use-scene-store';
import type { SerializedDocument } from '@/lib/scene/serialization';

export function useLoadWireframe(
  wireframeId: string | null,
  onLoaded?: (data: { id: string; title: string }) => void,
) {
  const importCanvas = useSceneStore((s) => s.importCanvas);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    if (!wireframeId) return;

    fetch(`/api/wireframes/${wireframeId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        importCanvas(data.canvas as SerializedDocument);
        onLoadedRef.current?.({ id: data.id, title: data.title });
      })
      .catch(console.error);
  }, [wireframeId, importCanvas]);
}
