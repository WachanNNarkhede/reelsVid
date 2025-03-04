"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  role: string;
}

export default function SuperadminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (session?.user.role === "superadmin") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [session]);

  if (!session || session.user.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-indigo-950">
        <div className="bg-black/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-red-900/50 text-red-500 text-2xl font-bold animate-pulse">
          Access Forbidden
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-indigo-950 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 mb-10 animate-glow">
          Superadmin Nexus
        </h1>
        <div className="bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-indigo-900/30 ">
          <div className="">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-950/80 to-purple-950/80">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-300 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/50">
                {users.map((user) => (
                  <UserRow key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
function UserRow({ user }: { user: User }) {
  const { data: session } = useSession(); // Get the current session
  const [role, setRole] = useState(user.role);
  const [isOpen, setIsOpen] = useState(false);

  // Check if the current user is the same as the row user
  const isCurrentUser = session?.user?.email === user.email;

  const handleRoleChange = async (newRole: string) => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setRole(newRole);
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const roles = [
    { value: "superadmin", label: "Superadmin" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  // Gradient backgrounds for rows based on role
  const rowBgClass =
    role === "superadmin"
      ? "bg-gradient-to-r from-green-500/10 via-green-800/60 to-green-900/50 hover:bg-gradient-to-r hover:from-green-800/60 hover:via-green-700/70 hover:to-green-800/60"
      : role === "admin"
      ? "bg-gradient-to-r from-amber-400/10 via-amber-600/10  hover:bg-gradient-to-r hover:from-yellow-800/60 hover:via-yellow-700/70 hover:to-yellow-800/60"
      : "bg-gradient-to-r from-indigo-950/50 via-indigo-900/60 to-indigo-950/50 hover:bg-gradient-to-r hover:from-indigo-900/60 hover:via-indigo-800/70 hover:to-indigo-900/60";

  return (
    <tr className={`${rowBgClass} transition-all duration-300`}>
      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-200 font-medium">
        {user.email}
      </td>
      <td className="px-6 py-5 whitespace-nowrap relative">
        <div className="w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isCurrentUser} // Disable if it's the current user
            className={`w-full text-left px-4 py-2 bg-gradient-to-r from-gray-900 to-indigo-900 text-gray-100 rounded-lg border border-indigo-700/50 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all duration-200 ${
              isCurrentUser ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
            {!isCurrentUser && <span className="float-right">▼</span>}
          </button>
          {isOpen && !isCurrentUser && (
            <div className="absolute z-10 mt-2 w-full rounded-lg bg-gray-900 border border-indigo-700/50 shadow-xl animate-dropdown">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setRole(r.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex text-left px-4 py-2 text-gray-100 hover:bg-indigo-800/70 hover:text-indigo-200 transition-colors duration-200 text-sm font-medium"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <button
          onClick={() => handleRoleChange(role)}
          disabled={isCurrentUser} // Disable if it's the current user
          className={`px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isCurrentUser ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Save
        </button>
      </td>
    </tr>
  );
}