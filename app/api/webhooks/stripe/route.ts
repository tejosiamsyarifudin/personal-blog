import { NextResponse } from "next/server"
import Stripe from "stripe"
import sql from "mssql"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-12-15.clover"
})

const config: sql.config = {
    server: process.env.DB_SERVER as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    options: { encrypt: false, trustServerCertificate: true }
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get("stripe-signature") as string

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error("Bad signature", err.message)
            return NextResponse.json({ message: err.message }, { status: 400 })
        }

        if (event.type === "checkout.session.completed") {
            const s = event.data.object as Stripe.Checkout.Session

            const userId = Number(s.metadata?.userId)
            const premium = Number(s.metadata?.premium)
            const amount = (s.amount_total || 0) / 100

            if (!userId || !premium) {
                return NextResponse.json({ message: "Bad metadata" }, { status: 400 })
            }

            try {
                const pool = await sql.connect(config)

                await pool.request()
                    .input("uid", sql.Int, userId)
                    .input("p", sql.Int, premium)
                    .query(`
            UPDATE [DSO].[Account].[Account]
            SET Premium = ISNULL(Premium, 0) + @p
            WHERE Id = @uid
          `)

                await pool.request()
                    .input("uid", sql.Int, userId)
                    .input("p", sql.Int, premium)
                    .input("amt", sql.Decimal(10, 2), amount)
                    .input("sid", sql.VarChar(255), s.id)
                    .query(`
            INSERT INTO [Config].[DonationLog] (UserId, Premium, Amount, StripeSessionId, CreatedAt)
            VALUES (@uid, @p, @amt, @sid, GETDATE())
          `)

                console.log(`Added ${premium} to user ${userId}`)
            } catch (e) {
                console.error("DB fail", e)
                return NextResponse.json({ message: "DB error" }, { status: 500 })
            }
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (err) {
        console.error("Webhook fail", err)
        return NextResponse.json({ message: "Fail" }, { status: 500 })
    }
}
