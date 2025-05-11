import { SparklesCore } from "@/components/ui/sparkles";
import { Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black bg-[radial-gradient(ellipse_at_top,rgba(16,18,66,0.4),transparent_50%)]">
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-screen px-4">
        {/* Background sparkles effect */}
        <SparklesCore
          background="black"
          minSize={0.3}
          maxSize={1.2}
          particleDensity={120}
          className="w-full h-full absolute inset-0"
          particleColor="#FFFFFF"
          speed={0.3}
        />
        
        {/* Hero content */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6">
            MHMUN Conference Portal
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Welcome to the Model United Nations conference management portal
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register" 
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Register Now
            </Link>
            <Link 
              href="/participants" 
              className="px-8 py-3 rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/30 transition-colors"
            >
              View Participants
            </Link>
          </div>
        </div>
        
        {/* Decorative globe */}
        <div className="absolute bottom-[10%] right-[15%] opacity-20">
          <Globe className="w-20 h-20 text-indigo-400" />
        </div>
      </div>
    </div>
  );
}
