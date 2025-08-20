"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    // Add more navigation links as needed
  ];

  return (
    <header
      className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-950 to-black border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and site name */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo/logo.png"
              alt="VBPS MUN Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl text-white font-montserrat">VBPS MUN</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-400 font-inter ${
                pathname === link.href
                  ? "text-blue-400"
                  : "text-gray-200"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-blue-500/10 text-white"
                  >
                    <UserIcon className="h-5 w-5 mr-2" /> 
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-white">
                  <div className="p-2 text-sm">
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> 
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-blue-500/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 text-white border-slate-800 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-800">
                  <Link 
                    href="/" 
                    className="flex items-center space-x-2" 
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Image 
                      src="/logo.png" 
                      alt="MHMUN Logo" 
                      width={24} 
                      height={24}
                      className="h-6 w-auto"
                    />
                    <span className="font-bold text-xl font-montserrat">VBPS MUN</span>
                  </Link>
                </div>
                <nav className="flex flex-col p-6 space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-base font-medium transition-colors hover:text-blue-400 ${
                        pathname === link.href
                          ? "text-blue-400"
                          : "text-gray-200"
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-6 border-t border-slate-800">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="font-medium text-white">
                            {user.name ? user.name[0] : user.email?.[0] || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name || "User"}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      {user.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setIsMobileOpen(false)}>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start mb-2 border-slate-700 text-white"
                          >
                            Admin Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button 
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setIsMobileOpen(false);
                        }}
                        variant="destructive" 
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> 
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full border-slate-700 text-white"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsMobileOpen(false)}>
                        <Button
                          variant="default"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}