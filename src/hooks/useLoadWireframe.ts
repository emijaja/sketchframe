import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSceneStore } from './use-scene-store';
import { fetcher } from '@/lib/swr/fetcher';
import type { SerializedDocument } from '@/lib/scene/serialization';

interface WireframeRecord {
  id: string;
  title: string;
  canvas: SerializedDocument;
}

export function useLoadWireframe(
  wireframeId: string | null,
  onLoaded?: (data: { id: string; title: string }) => void,
) {
  const importCanvas = useSceneStore((s) => s.importCanvas);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const { data, error, isLoading } = useSWR<WireframeRecord>(
    wireframeId ? `/api/wireframes/${wireframeId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateIfStale: false },
  );

  useEffect(() => {
    if (!data) return;
    importCanvas(data.canvas);
    onLoadedRef.current?.({ id: data.id, title: data.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  return { error, isLoading };
}
