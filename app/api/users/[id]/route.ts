import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/models/User";


export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {

   

    const { id } = params;
    const { role } = await request.json();

    if (!role || !["superadmin", "admin", "user"].includes(role)) {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json(
            { message: "Failed to update user role" },
            { status: 500 }
        );
    }
}