import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    )
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object" },
      { status: 400 },
    )
  }

  const payload = body as Record<string, unknown>
  const data: Prisma.WireframeUpdateInput = {}

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string") {
      return NextResponse.json(
        { error: "Field 'title' must be a string" },
        { status: 400 },
      )
    }
    data.title = payload.title
  }

  if (payload.canvas !== undefined) {
    if (payload.canvas === null) {
      return NextResponse.json(
        { error: "Field 'canvas' must not be null" },
        { status: 400 },
      )
    }
    data.canvas = payload.canvas as Prisma.InputJsonValue
  }

  if (payload.markdown !== undefined) {
    if (payload.markdown !== null && typeof payload.markdown !== "string") {
      return NextResponse.json(
        { error: "Field 'markdown' must be a string or null" },
        { status: 400 },
      )
    }
    data.markdown = payload.markdown as string | null
  }

  if (payload.thumbnail !== undefined) {
    if (payload.thumbnail !== null && typeof payload.thumbnail !== "string") {
      return NextResponse.json(
        { error: "Field 'thumbnail' must be a string or null" },
        { status: 400 },
      )
    }
    data.thumbnail = payload.thumbnail as string | null
  }

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
