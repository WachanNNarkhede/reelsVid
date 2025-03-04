"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import Link from "next/link";
import Lightning from "../components/lightning";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/");
    }
  };

  return (
   <div className=" flex items-center justify-center ">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden"> 
         <Lightning
    hue={220}
    xOffset={0}
    speed={1}
    intensity={1}
    size={1}
  />
  </div>
  <div className="relative mt-16 max-w-md w-full p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
    {/* Subtle animated background glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-transparent opacity-50 animate-pulse"></div>
    
    <h1 className="relative text-4xl font-extrabold text-center text-white mb-8 tracking-wider drop-shadow-lg">
      Login
    
      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
    </h1>
    
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      <div className="group">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/10 transition-all duration-300 placeholder-white/50"
          placeholder="Enter your vibe"
        />
      </div>
      <div className="group">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-white/80 group-hover:text-white transition-colors"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/10 transition-all duration-300 placeholder-white/50"
          placeholder="Keep it secret"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300"
      >
        Get In
      </button>
      <p className="text-center mt-4 text-white/70">
        New here?{" "}
        <Link
          href="/register"
          className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200"
        >
          Join the Party
        </Link>
      </p>
    </form>
  </div>

</div>
  );
}