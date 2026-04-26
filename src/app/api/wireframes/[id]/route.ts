import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { parseJsonBody } from "@/lib/api/parse-body"
import { wireframePatchSchema } from "@/lib/validators/wireframe"

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

  const parsed = await parseJsonBody(req, wireframePatchSchema)
  if (!parsed.ok) return parsed.response

  const { title, canvas, markdown, thumbnail } = parsed.data
  const data: Prisma.WireframeUpdateInput = {}
  if (title !== undefined) data.title = title
  if (canvas !== undefined) data.canvas = canvas as Prisma.InputJsonValue
  if (markdown !== undefined) data.markdown = markdown
  if (thumbnail !== undefined) data.thumbnail = thumbnail

  const wireframe = await prisma.wireframe.updateMany({
    where: { id, userId: session.user.id },
    data,
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

  const deleted = await prisma.wireframe.deleteMany({
    where: { id, userId: session.user.id },
  })

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
