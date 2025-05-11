"use client";

import { useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { Globe, Search, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParticipants } from "@/lib/participants";

const committees = [
  { value: "unsc", label: "UN Security Council" },
  { value: "unga", label: "UN General Assembly" },
  { value: "unhrc", label: "UN Human Rights Council" },
  { value: "who", label: "World Health Organization" },
  { value: "ipc", label: "International Press Corps" },
  { value: "disec", label: "Disarmament and International Security" },
];


export default function ParticipantsList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Using TanStack Query to fetch participants with automatic caching
  const { data: participants = [], isLoading, error: fetchError } = useParticipants();
  const error = fetchError ? 'Could not load participants. Please try again later.' : null;

  // Filter participants based on search query
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    participant.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (participant.committee && participant.committee.toLowerCase().includes(searchQuery.toLowerCase()))
  );


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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4">
              Participants
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              View all registered participants for the Model United Nations conference
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-10 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, school or committee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-xl bg-black/30 backdrop-blur-sm border border-indigo-500/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Participants List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
              <p className="text-red-400 text-xl">{error}</p>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-6 text-center backdrop-blur-sm bg-black/30 border border-indigo-500/20 rounded-2xl">
              <User className="w-16 h-16 text-indigo-400 mb-4 opacity-50" />
              <p className="text-gray-400 text-xl">No participants found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParticipants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/participants/${participant.id}`} className="block">
                    <div className="p-6 rounded-xl backdrop-blur-sm bg-black/30 border border-indigo-500/20 hover:bg-indigo-900/20 transition-colors h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{participant.name}</h3>
                          <p className="text-sm text-gray-400">{participant.school}</p>
                        </div>
                      </div>
                      
                      {participant.committee && (
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 rounded-full text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-500/30">
                            {participant.committee}
                          </span>
                        </div>
                      )}
                      
                     
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
