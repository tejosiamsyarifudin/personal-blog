// File location: app/api/user/logout/route.ts
// Create the folder structure: app/api/user/logout/
// Then create this route.ts file inside

import { NextResponse } from "next/server";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const dbConfig: sql.config = {
    server: process.env.DB_SERVER as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("auth-token");

        if (token) {
            try {
                // Decode token to get user ID
                const decoded = jwt.verify(token.value, JWT_SECRET) as any;

                // Update IsOnline status to false
                const pool = await sql.connect(dbConfig);
                await pool
                    .request()
                    .input("userId", sql.Int, decoded.userId)
                    .query(`
                        UPDATE Account.Account 
                        SET IsOnline = 0 
                        WHERE Id = @userId
                    `);
            } catch (err) {
                console.error("Token verification error:", err);
                // Continue to clear cookie even if token is invalid
            }
        }

        // Clear the auth cookie
        const response = NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );

        response.cookies.set("auth-token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/"
        });

        return response;

    } catch (err: any) {
        console.error("LOGOUT ERROR:", err);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}