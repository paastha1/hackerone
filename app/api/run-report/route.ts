import { exec } from "node:child_process"
import { promisify } from "node:util"
import { NextRequest, NextResponse } from "next/server"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const command = body.command

  if (typeof command !== "string") {
    return NextResponse.json({ error: "command is required" }, { status: 400 })
  }

  const { stdout, stderr } = await execAsync(command)
  return NextResponse.json({ output: stdout, errors: stderr })
}
