import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/models/User";

export async function PUT(request: Request) {
    try {
        // Extract the `id` from the URL
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop(); // Get the last segment of the URL

        if (!id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Extract the `role` from the request body
        const { role } = await request.json();

        // Validate the role
        if (!role || !["superadmin", "admin", "user"].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        // Connect to the database
        await connectToDatabase();

        // Update the user's role
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Return the updated user
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { message: "Failed to update user role" },
            { status: 500 }
        );
    }
}