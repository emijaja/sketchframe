import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
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

  if (payload.canvas === undefined || payload.canvas === null) {
    return NextResponse.json(
      { error: "Missing required field: canvas" },
      { status: 400 },
    )
  }

  if (payload.title !== undefined && typeof payload.title !== "string") {
    return NextResponse.json(
      { error: "Field 'title' must be a string" },
      { status: 400 },
    )
  }

  if (payload.markdown !== undefined && payload.markdown !== null && typeof payload.markdown !== "string") {
    return NextResponse.json(
      { error: "Field 'markdown' must be a string" },
      { status: 400 },
    )
  }

  if (payload.thumbnail !== undefined && payload.thumbnail !== null && typeof payload.thumbnail !== "string") {
    return NextResponse.json(
      { error: "Field 'thumbnail' must be a string" },
      { status: 400 },
    )
  }

  if (payload.width !== undefined && typeof payload.width !== "number") {
    return NextResponse.json(
      { error: "Field 'width' must be a number" },
      { status: 400 },
    )
  }

  if (payload.height !== undefined && typeof payload.height !== "number") {
    return NextResponse.json(
      { error: "Field 'height' must be a number" },
      { status: 400 },
    )
  }

  const wireframe = await prisma.wireframe.create({
    data: {
      title: (payload.title as string | undefined) ?? "Untitled",
      canvas: payload.canvas as Prisma.InputJsonValue,
      markdown: (payload.markdown as string | null | undefined) ?? null,
      thumbnail: (payload.thumbnail as string | null | undefined) ?? null,
      width: (payload.width as number | undefined) ?? 80,
      height: (payload.height as number | undefined) ?? 40,
      userId: session.user.id,
    },
  })

  return NextResponse.json(wireframe, { status: 201 })
}
