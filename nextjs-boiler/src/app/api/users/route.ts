import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo — replace with database
const users: { id: string; name: string; email: string }[] = [];

export async function GET() {
  return NextResponse.json({ data: users });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  const user = { id: crypto.randomUUID(), name, email };
  users.push(user);

  return NextResponse.json({ data: user }, { status: 201 });
}
