import { NextResponse } from "next/server";
import sql from "mssql";
import crypto from "crypto";

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

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        const pool = await sql.connect(dbConfig);

        // Check if username already exists in Account.Account
        const existingUserAccount = await pool
            .request()
            .input("username", sql.VarChar, username)
            .query(`
                SELECT TOP 1 Id 
                FROM Account.Account 
                WHERE Username = @username
            `);

        if (existingUserAccount.recordset.length > 0) {
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 409 }
            );
        }

        // Check if email already exists in Account.Account
        const existingEmail = await pool
            .request()
            .input("email", sql.VarChar, email)
            .query(`
                SELECT TOP 1 Id 
                FROM Account.Account 
                WHERE Email = @email
            `);

        if (existingEmail.recordset.length > 0) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        // Check if username already exists in Config.User
        const existingUserConfig = await pool
            .request()
            .input("username", sql.VarChar, username)
            .query(`
                SELECT TOP 1 Id 
                FROM [Config].[User] 
                WHERE Username = @username
            `);

        if (existingUserConfig.recordset.length > 0) {
            return NextResponse.json(
                { message: "Username already exists in Config" },
                { status: 409 }
            );
        }


        const hashedPasswordBase64 = hashPasswordBase64(password);  // ✅ Untuk Account.Account
        const hashedPasswordSHA256 = hashPasswordSHA256(password);  // ✅ Untuk Config.User

        // Insert ke Account.Account
        const resultAccount = await pool
            .request()
            .input("username", sql.VarChar, username)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hashedPasswordBase64)
            .input("accessLevel", sql.Int, 0)
            .input("discordId", sql.BigInt, 0)
            .query(`
                INSERT INTO Account.Account 
                    (Username, Email, Password, AccessLevel, CreateDate, Premium, Silk, ReceiveWelcome, DiscordId, IsOnline)
                OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email, INSERTED.AccessLevel
                VALUES 
                    (@username, @email, @password, @accessLevel, GETDATE(), 0, 0, 1, @discordId, 0)
            `);

        // Insert ke Config.User (same bcrypt hash for consistency)
        const resultConfig = await pool
            .request()
            .input("username", sql.VarChar, username)
            .input("password", sql.VarChar, hashedPasswordSHA256)
            .input("accessLevel", sql.Int, 0)
            .query(`
                INSERT INTO [Config].[User] 
                    (Username, Password, AccessLevel)
                OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.AccessLevel
                VALUES 
                    (@username, @password, @accessLevel)
            `);

        return NextResponse.json({
            message: "Registration successful",
            userAccount: resultAccount.recordset[0],
            userConfig: resultConfig.recordset[0]
        }, { status: 201 });

    } catch (err: any) {
        console.error("REGISTRATION ERROR:", err);
        console.error("Error details:", err.message);
        console.error("SQL State:", err.code);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}