import { NextResponse } from "next/server";
import sql from "mssql";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Hash untuk Account.Account (base64 biasa) - EXISTING METHOD
function hashPasswordBase64(password: string) {
    return Buffer.from(password, "utf-8").toString("base64");
}

// Hash untuk Config.User (SHA-256) - EXISTING METHOD
function hashPasswordSHA256(password: string) {
    const hash = crypto
        .createHash("sha256")
        .update(password, "utf8")
        .digest("base64");
    return hash;
}

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
        const { username, password } = await req.json();

        // Validation
        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        const pool = await sql.connect(dbConfig);

        // Get user from Config.User
        const result = await pool
            .request()
            .input("username", sql.VarChar, username)
            .query(`
                SELECT Id, Username, Password, AccessLevel
                FROM [Config].[User]
                WHERE Username = @username
            `);

        if (result.recordset.length === 0) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        const user = result.recordset[0];

        // Verify password using existing Base64 method
        const hashedPassword = hashPasswordSHA256(password);

        if (hashedPassword !== user.Password) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.Id,
                username: user.Username,
                accessLevel: user.AccessLevel
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Create response with user data
        const response = NextResponse.json({
            message: "Login successful",
            user: {
                Id: user.Id,
                Username: user.Username,
                AccessLevel: user.AccessLevel
            }
        }, { status: 200 });

        // Set httpOnly cookie for security
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

        return response;

    } catch (err: any) {
        console.error("LOGIN ERROR:", err);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}