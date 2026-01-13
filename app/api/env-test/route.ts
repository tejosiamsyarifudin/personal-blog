import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        server: process.env.DB_SERVER,
        user: process.env.DB_USER,
    });
}
