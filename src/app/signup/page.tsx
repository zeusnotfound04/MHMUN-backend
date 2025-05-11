import { SignUpForm } from "@/components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | MUN Portal",
  description: "Create a new account on the Model United Nations Portal.",
};

export default function SignUp() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 overflow-hidden bg-slate-950">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full opacity-10 blur-3xl -z-10"></div>
      
      {/* Star-like dots */}
      <div className="absolute h-1 w-1 rounded-full bg-white top-[10%] left-[15%] opacity-70"></div>
      <div className="absolute h-2 w-2 rounded-full bg-blue-300 top-[20%] left-[35%] opacity-50"></div>
      <div className="absolute h-1 w-1 rounded-full bg-white top-[15%] left-[85%] opacity-70"></div>
      <div className="absolute h-2 w-2 rounded-full bg-indigo-300 top-[45%] left-[75%] opacity-50"></div>
      <div className="absolute h-1 w-1 rounded-full bg-white top-[65%] left-[22%] opacity-70"></div>
      
      {/* Main content */}
      <div className="w-full max-w-lg bg-black/30 backdrop-blur-md rounded-xl border border-indigo-500/20 p-8 shadow-xl shadow-indigo-500/10 z-10">
        <SignUpForm />
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,197,253,0.1),transparent_50%)] pointer-events-none -z-10"></div>
    </div>
  );
}