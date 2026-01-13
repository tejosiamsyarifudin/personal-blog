"use client";

export default function AdminDashboard() {
    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("adminUser") || "null")
            : null;

    if (!user) {
        return <div className="p-6">Unauthorized</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">
                Welcome {user.Username}
            </h1>
        </div>
    );
}
