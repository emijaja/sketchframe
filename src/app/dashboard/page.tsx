import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/');

  const wireframes = await prisma.wireframe.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      thumbnail: true,
      updatedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Wireframes</h1>
          <a
            href="/"
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg font-medium text-sm hover:bg-[#2563eb]/90 transition-colors"
          >
            + New
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wireframes.map((wf) => (
            <a
              key={wf.id}
              href={`/?id=${wf.id}`}
              className="border border-border/60 rounded-lg p-4 hover:border-foreground/30 transition-colors group"
            >
              {wf.thumbnail && (
                <img
                  src={wf.thumbnail}
                  alt={wf.title}
                  className="w-full h-40 object-contain bg-neutral-900 rounded mb-3"
                />
              )}
              {!wf.thumbnail && (
                <div className="w-full h-40 bg-foreground/5 rounded mb-3 flex items-center justify-center text-foreground/20 text-sm">
                  No preview
                </div>
              )}
              <p className="font-medium truncate">{wf.title}</p>
              <p className="text-sm text-foreground/50">
                {new Date(wf.updatedAt).toLocaleDateString('ja-JP')}
              </p>
            </a>
          ))}

          {wireframes.length === 0 && (
            <p className="text-foreground/50 col-span-full text-center py-12">
              まだワイヤーフレームがありません。「+ New」から作成しましょう。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
