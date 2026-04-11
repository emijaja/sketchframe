import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/wireframes — ユーザーの全ワイヤーフレーム取得
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const wireframes = await prisma.wireframe.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      thumbnail: true,
      updatedAt: true,
    },
  })

  return NextResponse.json(wireframes)
}

// POST /api/wireframes — 新規保存
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const wireframe = await prisma.wireframe.create({
    data: {
      title: body.title ?? "Untitled",
      canvas: body.canvas,
      markdown: body.markdown,
      thumbnail: body.thumbnail,
      width: body.width ?? 80,
      height: body.height ?? 40,
      userId: session.user.id,
    },
  })

  return NextResponse.json(wireframe, { status: 201 })
}
