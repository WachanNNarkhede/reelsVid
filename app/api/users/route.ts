import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/models/User";


export async function GET() {

    try {
        await connectToDatabase();
        const users = await UserModel.find({}, { email: 1, role: 1, _id: 1 }); // Fetch only email, role, and _id
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}