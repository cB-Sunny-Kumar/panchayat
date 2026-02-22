import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/hash";
import { Role } from "@prisma/client";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const officers = await prisma.user.findMany({
    where: { role: Role.OFFICER },
    select: {
      id: true,
      name: true,
      email: true,
      ward: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(officers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password, ward } = await request.json();

    if (!name || !email || !password || !ward) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newOfficer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.OFFICER,
        ward: parseInt(ward),
      },
      select: {
        id: true,
        name: true,
        email: true,
        ward: true,
      },
    });

    return NextResponse.json(newOfficer, { status: 201 });
  } catch (error) {
    console.error("Error creating officer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
