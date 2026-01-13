import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-12-15.clover",
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("auth-token");

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Verify JWT token
        const decoded = jwt.verify(token.value, JWT_SECRET) as any;

        const body = await req.json();
        const { premium, basePremium, bonus, amount } = body;

        if (!premium || !amount) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Build product description
        let description = `Purchase ${premium} Premium Points for your game account`;
        if (bonus && bonus > 0) {
            description = `Purchase ${basePremium} Premium Points + ${bonus}% Bonus (${premium} total) for your game account`;
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: bonus && bonus > 0 ? `${premium} Premium Points (${basePremium} + ${bonus}% Bonus)` : `${premium} Premium Points`,
                            description: description,
                            images: ["https://your-domain.com/premium-icon.png"], // Optional: Add your premium icon URL
                        },
                        unit_amount: amount * 100, // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/donate?canceled=true`,
            metadata: {
                userId: decoded.userId,
                premium: premium.toString(),
                basePremium: basePremium?.toString() || premium.toString(),
                bonus: bonus?.toString() || "0",
            },
        });

        return NextResponse.json({ url: session.url }, { status: 200 });

    } catch (err: any) {
        console.error("STRIPE ERROR:", err);
        return NextResponse.json(
            {
                message: "Failed to create checkout session",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            },
            { status: 500 }
        );
    }
}