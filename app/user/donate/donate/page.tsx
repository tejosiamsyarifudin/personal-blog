"use client"

import { Suspense } from "react"
import DonationSuccessPage from "./DonationSuccessPage"

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <DonationSuccessPage />
        </Suspense>
    )
}
