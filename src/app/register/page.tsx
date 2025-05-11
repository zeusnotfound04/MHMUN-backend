import RegistrationForm from "@/components/RegisterForm";
import { SparklesCore } from "@/components/ui/sparkles";
import { Globe } from "lucide-react";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black bg-[radial-gradient(ellipse_at_top,rgba(16,18,66,0.4),transparent_50%)]">
      {/* Background Elements with Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sparkles background for the entire page */}
        <SparklesCore
          background="black"
          minSize={0.3}
          maxSize={1.2}
          particleDensity={120}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={0.3}
        />
        
        {/* Gradient overlays for visual interest */}
        <div className="absolute inset-x-20 top-1/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm opacity-30"></div>
        <div className="absolute inset-x-20 top-1/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4 opacity-30"></div>
        <div className="absolute inset-x-60 bottom-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[3px] w-1/3 blur-sm opacity-30"></div>
        <div className="absolute inset-x-60 bottom-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/3 opacity-30"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-10 left-20 w-20 h-20 rounded-full bg-purple-500/5 animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-40 right-40 w-24 h-24 rounded-full bg-blue-500/5 animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full bg-indigo-500/5 animate-pulse" style={{ animationDuration: '18s' }}></div>
        
        {/* Star-like dots */}
        <div className="absolute h-1 w-1 rounded-full bg-white top-[10%] left-[15%] opacity-70"></div>
        <div className="absolute h-2 w-2 rounded-full bg-blue-300 top-[20%] left-[35%] opacity-50"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white top-[15%] left-[85%] opacity-70"></div>
        <div className="absolute h-2 w-2 rounded-full bg-indigo-300 top-[45%] left-[75%] opacity-50"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white top-[65%] left-[22%] opacity-70"></div>
        <div className="absolute h-2 w-2 rounded-full bg-purple-300 top-[70%] left-[88%] opacity-50"></div>
        
        {/* Floating globe icons */}
        <div className="absolute bottom-[20%] right-[20%] opacity-30 animate-spin-slow">
          <Globe className="w-12 h-12 text-blue-400" />
        </div>
        <div className="absolute top-[25%] left-[5%] opacity-30 animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
          <Globe className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="absolute top-[65%] right-[15%] opacity-20 animate-spin-slow" style={{ animationDuration: '30s' }}>
          <Globe className="w-6 h-6 text-purple-400" />
        </div>
      </div>
      {/* Main content area */}
      <div className="container mx-auto min-h-screen flex items-center justify-center py-20 px-4 relative z-10">
        <div className="w-full max-w-3xl bg-black/30 backdrop-blur-md rounded-xl border border-indigo-500/20 p-8 shadow-xl shadow-indigo-500/10">
          
          <RegistrationForm/>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,197,253,0.1),transparent_50%)] pointer-events-none"></div>
    </div>
  );
}
