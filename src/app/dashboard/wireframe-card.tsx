'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import useSWRMutation from 'swr/mutation';
import { jsonMutator } from '@/lib/swr/fetcher';

type Props = {
  id: string;
  title: string;
  thumbnail: string | null;
  updatedAt: Date | string;
};

export function WireframeCard({ id, title, thumbnail, updatedAt }: Props) {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    `/api/wireframes/${id}`,
    jsonMutator<unknown>,
  );

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!window.confirm(`「${title}」を削除しますか?`)) return;

    try {
      await trigger({ method: 'DELETE' });
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert('削除に失敗しました');
    }
  };

  return (
    <div className="relative group">
      <Link
        href={`/?id=${id}`}
        className="block border border-border/60 rounded-lg p-4 hover:border-foreground/30 transition-colors"
      >
        {thumbnail ? (
          // data URL のため next/image の最適化対象外。lint 抑止
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-40 object-contain bg-neutral-900 rounded mb-3"
          />
        ) : (
          <div className="w-full h-40 bg-foreground/5 rounded mb-3 flex items-center justify-center text-foreground/20 text-sm">
            No preview
          </div>
        )}
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-foreground/50">
          {new Date(updatedAt).toLocaleDateString('ja-JP')}
        </p>
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isMutating}
        className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/60 text-foreground/60 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`${title} を削除`}
        title="削除"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
