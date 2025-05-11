
"use client";

import { LoginForm } from "@/components/LoginForm";
import { SparklesCore } from "@/components/ui/sparkles";
import Image from "next/image";
import { Globe } from "lucide-react";

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black bg-[radial-gradient(ellipse_at_top,rgba(16,18,66,0.4),transparent_50%)]">
      {/* Background sparkles effect */}
      <SparklesCore
        background="black"
        minSize={0.3}
        maxSize={1.2}
        particleDensity={70}
        className="w-full h-full absolute inset-0 pointer-events-none z-0"
        particleColor="#FFFFFF"
        speed={0.3}
      />
      
      <div className="container relative z-10 flex flex-col lg:flex-row h-screen items-center justify-center">
        <div className="w-full lg:w-1/2 p-6 lg:p-10 text-center lg:text-left mb-8 lg:mb-0">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <Globe className="h-10 w-10 text-blue-400 mr-2" />
            <h2 className="text-3xl font-bold text-white">MHMUN</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto lg:mx-0">
            Log in to access the Model Himalayan MUN Conference portal and manage your conference experience.
          </p>
        </div>
        
        <div className="w-full lg:w-1/2 lg:p-8">
          <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-xl max-w-md mx-auto">
            <div className="flex flex-col space-y-2 text-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Login to your account
              </h2>
              <p className="text-sm text-gray-400">
                Enter your email and password to continue
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}