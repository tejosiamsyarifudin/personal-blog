import { NextResponse } from "next/server";
import sql from "mssql";

function hashPassword(password: string) {
    return Buffer.from(password, "utf-8").toString("base64");
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

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password required" },
                { status: 400 }
            );
        }

        const hashedPassword = hashPassword(password);

        const pool = await sql.connect(dbConfig);

        // Using parameterized query to prevent SQL injection
        const result = await pool
            .request()
            .input("username", sql.VarChar, username)
            .input("password", sql.VarChar, hashedPassword)
            .query(`
                SELECT TOP 1
                    Id,
                    Username,
                    AccessLevel
                FROM Account.Account
                WHERE Username = @username
                    AND Password = @password
            `);

        if (result.recordset.length === 0) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(result.recordset[0]);
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}