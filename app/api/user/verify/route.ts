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

export async function GET(req: Request) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("auth-token");

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated", authenticated: false },
                { status: 401 }
            );
        }

        // Verify JWT token
        const decoded = jwt.verify(token.value, JWT_SECRET) as any;

        // Get fresh user data from database
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("userId", sql.Int, decoded.userId)
            .query(`
                SELECT Id, Username, Password, AccessLevel
                FROM [Config].[User]
                WHERE Id = @userId
            `);

        if (result.recordset.length === 0) {
            return NextResponse.json(
                { message: "User not found", authenticated: false },
                { status: 404 }
            );
        }

        const user = result.recordset[0];

        return NextResponse.json({
            authenticated: true,
            user: {
                Id: user.Id,
                Username: user.Username,
                AccessLevel: user.AccessLevel
            }
        }, { status: 200 });

    } catch (err: any) {
        console.error("VERIFY ERROR:", err);

        // If token is invalid or expired
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return NextResponse.json(
                { message: "Invalid or expired token", authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                message: "Internal server error",
                authenticated: false,
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}