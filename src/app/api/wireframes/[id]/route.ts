import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/wireframes/:id — 単体取得
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const wireframe = await prisma.wireframe.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!wireframe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(wireframe)
}

// PATCH /api/wireframes/:id — 更新（上書き保存）
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const wireframe = await prisma.wireframe.updateMany({
    where: { id, userId: session.user.id },
    data: {
      title: body.title,
      canvas: body.canvas,
      markdown: body.markdown,
      thumbnail: body.thumbnail,
    },
  })

  if (wireframe.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

// DELETE /api/wireframes/:id — 削除
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.wireframe.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
