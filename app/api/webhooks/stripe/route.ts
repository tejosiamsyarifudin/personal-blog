import { NextResponse } from "next/server";
import Stripe from "stripe";
import sql from "mssql";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-12-15.clover",
});

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature") as string;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error("Webhook signature verification failed:", err.message);
            return NextResponse.json(
                { message: `Webhook Error: ${err.message}` },
                { status: 400 }
            );
        }

        // Handle the checkout.session.completed event
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId = session.metadata?.userId;
            const premium = parseInt(session.metadata?.premium || "0");

            if (!userId || !premium) {
                console.error("Missing metadata in session");
                return NextResponse.json(
                    { message: "Invalid session metadata" },
                    { status: 400 }
                );
            }

            // Update user's premium balance in database
            try {
                const pool = await sql.connect(dbConfig);

                // Update premium column
                await pool
                    .request()
                    .input("userId", sql.Int, userId)
                    .input("premium", sql.Int, premium)
                    .query(`
                        UPDATE [DSO].[Account].[Account]
                        SET Premium = ISNULL(Premium, 0) + @premium
                        WHERE Id = @userId
                    `);

                // Optional: Log the transaction
                await pool
                    .request()
                    .input("userId", sql.Int, userId)
                    .input("premium", sql.Int, premium)
                    .input("amount", sql.Decimal(10, 2), (session.amount_total || 0) / 100)
                    .input("sessionId", sql.VarChar(255), session.id)
                    .query(`
                        INSERT INTO [Config].[DonationLog] (UserId, Premium, Amount, StripeSessionId, CreatedAt)
                        VALUES (@userId, @premium, @amount, @sessionId, GETDATE())
                    `);

                console.log(`Successfully added ${premium} premium points to user ${userId}`);

            } catch (dbErr: any) {
                console.error("Database error:", dbErr);
                return NextResponse.json(
                    { message: "Database error" },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error("WEBHOOK ERROR:", err);
        return NextResponse.json(
            { message: "Webhook handler failed" },
            { status: 500 }
        );
    }
}

// Disable body parsing for webhooks
export const config = {
    api: {
        bodyParser: false,
    },
};