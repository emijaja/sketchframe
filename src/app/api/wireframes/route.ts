import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { parseJsonBody } from "@/lib/api/parse-body"
import { wireframeCreateSchema } from "@/lib/validators/wireframe"

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

  const parsed = await parseJsonBody(req, wireframeCreateSchema)
  if (!parsed.ok) return parsed.response

  const { title, canvas, markdown, thumbnail, width, height } = parsed.data

  const wireframe = await prisma.wireframe.create({
    data: {
      title: title ?? "Untitled",
      canvas: canvas as Prisma.InputJsonValue,
      markdown: markdown ?? null,
      thumbnail: thumbnail ?? null,
      width: width ?? 80,
      height: height ?? 40,
      userId: session.user.id,
    },
  })

  return NextResponse.json(wireframe, { status: 201 })
}
