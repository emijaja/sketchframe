import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { WireframeCard } from './wireframe-card';

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
          <Link
            href="/"
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg font-medium text-sm hover:bg-[#2563eb]/90 transition-colors"
          >
            + New
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wireframes.map((wf) => (
            <WireframeCard
              key={wf.id}
              id={wf.id}
              title={wf.title}
              thumbnail={wf.thumbnail}
              updatedAt={wf.updatedAt}
            />
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
