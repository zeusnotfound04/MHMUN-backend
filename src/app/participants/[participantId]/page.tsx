"use client";

import { SparklesCore } from "@/components/ui/sparkles";
import { Globe, User, MapPin, Mail, FileText, Phone, Building, Flag, UserCircle, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useParticipant } from "@/lib/participants";
import Image from "next/image";
import Link from "next/link";

export default function ParticipantDetails() {
  const params = useParams();
  const participantId = params.participantId as string;
  
  // Using TanStack Query to fetch and cache participant data
  const { 
    data: participant,
    isLoading, 
    error: fetchError 
  } = useParticipant(participantId);
  const error = fetchError ? 'Could not load participant details. Please try again later.' : null;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black bg-[radial-gradient(ellipse_at_top,rgba(16,18,66,0.4),transparent_50%)]">
      {/* Background Elements with Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sparkles background for the entire page */}
        <SparklesCore
          background="black"
          minSize={0.3}
          maxSize={1.2}
          particleDensity={60} // Reduced density for better mobile performance
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={0.3}
        />
        
        {/* Responsive gradient overlays - adjusted for better visibility on all screens */}
        <div className="absolute inset-x-0 mx-auto top-1/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-4/5 blur-sm opacity-30"></div>
        <div className="absolute inset-x-0 mx-auto top-1/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-4/5 opacity-30"></div>
        <div className="absolute inset-x-0 mx-auto bottom-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[3px] w-2/3 blur-sm opacity-30"></div>
        <div className="absolute inset-x-0 mx-auto bottom-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-2/3 opacity-30"></div>
        
        {/* Decorative elements positioned with percentages for responsiveness */}
        <div className="absolute top-[10%] left-[10%] w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-500/5 animate-pulse hidden sm:block" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-500/5 animate-pulse hidden sm:block" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-500/5 animate-pulse hidden sm:block" style={{ animationDuration: '18s' }}></div>
        
        {/* Star-like dots - fewer on mobile */}
        <div className="absolute h-1 w-1 rounded-full bg-white top-[10%] left-[15%] opacity-70"></div>
        <div className="absolute h-2 w-2 rounded-full bg-blue-300 top-[20%] left-[35%] opacity-50 hidden sm:block"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white top-[15%] left-[85%] opacity-70"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white top-[65%] left-[22%] opacity-70 hidden sm:block"></div>
        <div className="absolute h-2 w-2 rounded-full bg-purple-300 top-[70%] left-[88%] opacity-50 hidden sm:block"></div>
        
        {/* Floating globe icons - only shown on larger screens */}
        <div className="absolute bottom-[20%] right-[20%] opacity-30 animate-spin-slow hidden md:block">
          <Globe className="w-12 h-12 text-blue-400" />
        </div>
        <div className="absolute top-[25%] left-[5%] opacity-30 animate-spin-slow hidden md:block" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
          <Globe className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-8 md:py-16">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden backdrop-blur-sm bg-black/30 border border-indigo-500/20 rounded-2xl shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                <p className="text-red-400 text-xl">{error}</p>
              </div>
            ) : participant ? (
              <div className="p-4 md:p-8">              <div className="flex flex-col items-center text-center mb-6 md:mb-8">
                  {participant.profilePicture ? (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-indigo-600/20 mb-4 overflow-hidden border-2 border-indigo-500/50">
                      <Image 
                        src={participant.profilePicture} 
                        alt={participant.name} 
                        width={96} 
                        height={96}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-indigo-600/20 mb-4">
                      <UserCircle className="w-12 h-12 md:w-14 md:h-14 text-indigo-400" />
                    </div>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    {participant.name}
                  </h1>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">
                    Participant ID: {participant.formId}
                  </p>
                </div>
                
                {/* Mobile-first grid that expands on larger screens */}
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {/* First section - Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-indigo-600/20 p-2 mt-1 flex-shrink-0">
                          <Building className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-400 text-xs md:text-sm">School</p>
                          <p className="text-white text-base md:text-lg truncate">{participant.school}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-indigo-600/20 p-2 mt-1 flex-shrink-0">
                          <Mail className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-400 text-xs md:text-sm">Email</p>
                          <p className="text-white text-base md:text-lg truncate">{participant.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-indigo-600/20 p-2 mt-1 flex-shrink-0">
                          <Phone className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-400 text-xs md:text-sm">Phone</p>
                          <p className="text-white text-base md:text-lg truncate">{participant.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {participant.committee && (
                        <div className="flex items-start space-x-3">
                          <div className="rounded-full bg-indigo-600/20 p-2 mt-1 flex-shrink-0">
                            <Flag className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs md:text-sm">Committee</p>
                            <p className="text-white text-base md:text-lg truncate">{participant.committee}</p>
                          </div>
                        </div>
                      )}
                      
                      {participant.delegationType && (
                        <div className="flex items-start space-x-3">
                          <div className="rounded-full bg-indigo-600/20 p-2 mt-1 flex-shrink-0">
                            <User className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs md:text-sm">Delegation Type</p>
                            <p className="text-white text-base md:text-lg truncate">{participant.delegationType}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-indigo-600/20 p-2 mt-1 flex-shrink-0">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-400 text-xs md:text-sm">Registered On</p>
                          <p className="text-white text-base md:text-lg truncate">{formatDate(participant.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second section - Additional Info */}
                  {participant.countryPreferences && (
                    <div className="p-3 md:p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                      <div className="flex items-center space-x-2 mb-2 md:mb-3">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                        <h3 className="text-base md:text-lg font-medium text-white">Country Preferences</h3>
                      </div>
                      <p className="text-gray-300 text-sm md:text-base">{participant.countryPreferences}</p>
                    </div>
                  )}

                  {participant.experience && (
                    <div className="p-3 md:p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                      <div className="flex items-center space-x-2 mb-2 md:mb-3">
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                        <h3 className="text-base md:text-lg font-medium text-white">Experience</h3>
                      </div>
                      <p className="text-gray-300 text-sm md:text-base">{participant.experience}</p>
                    </div>
                  )}

                  {/* QR Code - Responsive sizing */}                  {participant.qrImageUrl && (
                    <div className="mt-4 md:mt-6 flex flex-col items-center">
                      <h3 className="text-base md:text-lg font-medium text-white mb-3 md:mb-4">Registration QR Code</h3>
                      <div className="rounded-lg border-2 border-indigo-500/30 overflow-hidden">
                        <Image 
                          src={participant.qrImageUrl} 
                          alt="Registration QR Code"
                          width={240}
                          height={280}
                          className="object-contain" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                <p className="text-red-400 text-xl">Participant not found</p>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 md:mt-6 flex justify-center"
          >
            <Link
              href="/participants"
              className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg backdrop-blur-sm bg-black/30 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-900/30 transition-colors"
            >
              Back to All Participants
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}