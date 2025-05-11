/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable react/no-unescaped-entities*/
"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Globe, Check, User,  Mail, FileText, Phone, Building, Flag, UserCircle } from "lucide-react"
import { DeterministicBubbles } from "@/components/ui/deterministic-background"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Enhanced schema with committee preferences and delegation info
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  school: z.string().min(1, "School name is required"),
  email: z.string().email("Please enter a valid email address"),
  formId: z.string().min(1, "Form ID is required"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  committee: z.string().min(1, "Please select a committee"),
  experience: z.string().optional(),
  countryPreferences: z.string().optional(),
  delegationType: z.string().min(1, "Please select a delegation type")
});

const committees = [
  { value: "unsc", label: "UN Security Council" },
  { value: "unga", label: "UN General Assembly" },
  { value: "unhrc", label: "UN Human Rights Council" },
  { value: "who", label: "World Health Organization" },
  { value: "ipc", label: "International Press Corps" },
  { value: "disec", label: "Disarmament and International Security" },
];

const delegationTypes = [
  { value: "individual", label: "Individual Delegate" },
  { value: "double", label: "Double Delegation" },
  { value: "school", label: "School Delegation" },
];

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({ title: "", content: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [backgroundPattern, setBackgroundPattern] = useState(1);


  const router = useRouter();
  // Control visibility for scroll animations
  useEffect(() => {
    setIsVisible(true);
    
    // Change background pattern every 10 seconds
    const intervalId = setInterval(() => {
      setBackgroundPattern(prev => prev >= 3 ? 1 : prev + 1);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      school: "",
      email: "",
      formId: "",
      phone: "",
      committee: "",
      experience: "",
      countryPreferences: "",
      delegationType: "individual"
    }
  })

  const showCommitteeInfo = (committee: string) => {
    const info = {
      unsc: {
        title: "UN Security Council",
        content: "The Security Council has primary responsibility for maintaining international peace and security. It takes the lead in determining the existence of a threat to the peace or an act of aggression."
      },
      unga: {
        title: "UN General Assembly",
        content: "The General Assembly is the main deliberative, policymaking and representative organ of the UN. All 193 Member States are represented, making it the only UN body with universal representation."
      },
      unhrc: {
        title: "UN Human Rights Council",
        content: "The Human Rights Council is responsible for strengthening the promotion and protection of human rights around the globe and for addressing situations of human rights violations."
      },
      who: {
        title: "World Health Organization",
        content: "WHO is the specialized agency responsible for international public health. Its objective is the attainment by all peoples of the highest possible level of health."
      },
      ipc: {
        title: "International Press Corps",
        content: "The International Press Corps consists of delegates who act as journalists, covering the proceedings of the MUN conference and producing articles, interviews and multimedia content."
      },
      disec: {
        title: "Disarmament and International Security",
        content: "The First Committee deals with disarmament and related international security questions. It seeks out solutions to challenges in the international security regime."
      }
    };
    
    setCurrentInfo(info[committee as keyof typeof info]);
    setShowInfoDialog(true);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log(values);
      const response = await axios.post('/api/participants', values);
      
      // Show success message
      toast.success("Registration successful! Redirecting to home page...");
      
      // Show success dialog
      setShowSuccess(true);
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
      
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  // Generate deterministic positions for server rendering to prevent hydration mismatches
  const generateDeterministicPosition = (index: number, total: number) => {
    // Creates a predictable distribution of elements
    const angleStep = (Math.PI * 2) / total;
    const angle = angleStep * index;
    const radius = 40 + (index % 3) * 20; // Varying distances from center
    
    // Convert to percentage positions
    const left = 50 + radius * Math.cos(angle);
    const top = 50 + radius * Math.sin(angle);
    
    // Generate size based on index
    const size = 50 + (index % 5) * 25;
    
    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${size}px`,
      height: `${size}px`,
      duration: 15 + (index % 10),
      delay: index * 0.5
    };
  };

  const backgroundPatterns = {
    1: (
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const position = generateDeterministicPosition(i, 20);
          return (
            <motion.div 
              key={`bubble-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"              style={{
                left: position.left,
                top: position.top,
                width: position.width,
                height: position.height,
                opacity: 0,
                transform: "scale(0)"
              }}
              initial={{}}animate={{ 
                scale: [0, 1, 0.8],
                opacity: [0, 0.2, 0],
                y: [0, -100]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: position.duration,
                delay: position.delay,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </motion.div>
    ),
    2: (
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div 
            key={`grid-${i}`}
            className="absolute bg-gradient-to-r from-blue-400 to-indigo-400"
            style={{
              left: `${(i % 6) * 20}%`,
              top: `${Math.floor(i / 6) * 20}%`,
              width: '1px',
              height: '1px',
            }}
            animate={{ 
              scale: [1, 80, 1],
              opacity: [0, 0.2, 0],
              borderRadius: ["0%", "50%", "0%"]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 12,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    ),    3: (
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div 
            key={`wave-${i}`}
            className="absolute left-0 right-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            style={{
              top: `${i * 10 + (i % 5)}%`, // Deterministic offset based on index
              height: '1px',
            }}
            animate={{ 
              scaleY: [1, 15, 1],
              opacity: [0, 0.15, 0],
              filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 10 + i * 2,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    )
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Pattern */}      <AnimatePresence mode="wait">
        <motion.div
          key={`pattern-${backgroundPattern}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <DeterministicBubbles pattern={backgroundPattern as 1 | 2 | 3} />
        </motion.div>
      </AnimatePresence>

      <div className="container px-4 py-8 mx-auto relative z-10">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/40"
              />
              <motion.div
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border border-blue-500/30"
                style={{ margin: '-6px' }}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Globe className="w-16 h-16 text-indigo-400" />
              </motion.div>
            </div>
          </div>
          <motion.h1 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-2"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% auto' }}
          >
            Model United Nations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-indigo-200"
          >
            Delegate Registration Form
          </motion.p>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "linear" 
            }}
            style={{ backgroundSize: '200% auto' }}
          />
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto bg-black/30 rounded-xl shadow-xl border border-indigo-500/20 overflow-hidden backdrop-blur-md relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileInView="pulse"
          viewport={{ once: false }}
        >
          {/* Glow effects */}
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-xl blur-lg opacity-75 -z-10"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "linear" 
            }}
            style={{ backgroundSize: '200% auto' }}
          />
          
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>                          
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <User className="w-4 h-4" /> Name
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Input 
                                placeholder="Enter your full name"
                                className="transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            Please provide your full legal name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <Building className="w-4 h-4" /> School
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Input 
                                placeholder="Enter your school or institution"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all"
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            Your school or institution you are representing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <Mail className="w-4 h-4" /> Email
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Input 
                                placeholder="Your email address"
                                type="email"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all"
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            We'll use this to send your confirmation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="formId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <FileText className="w-4 h-4" /> Form ID
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Input 
                                placeholder="Your unique form ID"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all"
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            This is the unique ID provided to you
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <Phone className="w-4 h-4" /> Phone number
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <PhoneInput
                                placeholder="Your contact number"
                                className="dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all"
                                {...field}
                                defaultCountry="IN"
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            Will be used for urgent communications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="committee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <Flag className="w-4 h-4" /> Committee Preference
                          </FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all">
                                    <SelectValue placeholder="Select a committee" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {committees.map((committee) => (
                                      <SelectItem key={committee.value} value={committee.value}>
                                        {committee.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            </FormControl>                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    type="button"
                                    onClick={() => field.value && showCommitteeInfo(field.value)}
                                    disabled={!field.value}
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all"
                                  >
                                    <span className="sr-only">Show committee info</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M12 16v-4" />
                                      <path d="M12 8h.01" />
                                    </svg>
                                  </Button>
                                </motion.div>
                              </PopoverTrigger>
                              <PopoverContent>
                                {field.value && 
                                  <div>
                                    <h3 className="font-medium mb-1">{committees.find(c => c.value === field.value)?.label}</h3>
                                    <p className="text-sm text-slate-200">Click the info button for more details about this committee.</p>
                                  </div>
                                }
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormDescription>
                            Select your preferred MUN committee
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="delegationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <UserCircle className="w-4 h-4" /> Delegation Type
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all">
                                  <SelectValue placeholder="Select a delegation type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {delegationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            Specify your delegation type
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="countryPreferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <Globe className="w-4 h-4" /> Country Preferences
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Input 
                                placeholder="List your top 3 country preferences (comma separated)"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all"
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            List your preferred countries to represent (e.g. USA, France, Japan)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium">
                            <FileText className="w-4 h-4" /> MUN Experience
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Input 
                                placeholder="Briefly describe your MUN experience"
                                className="transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                                {...field} 
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            Mention any previous MUN conferences you've attended
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
                  
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex justify-center mt-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0px 10px 25px rgba(79, 70, 229, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto"
                  >
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-medium py-3 px-10 rounded-md transition-all w-full sm:w-auto",
                        isSubmitting && "opacity-80"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Submitting</span>
                          <motion.div 
                            className="absolute inset-0 bg-white/20"
                            animate={{ 
                              x: ["0%", "100%"],
                              opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ 
                              duration: 1, 
                              repeat: Infinity,
                              ease: "linear" 
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 hover:opacity-20 transition-opacity"
                          />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </div>
        </motion.div>
        
        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md bg-slate-900 border border-indigo-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Check className="w-6 h-6 text-green-500" />
                <span>Registration Successful!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              <p className="mb-4">Thank you for registering for the Model United Nations conference!</p>
              <p className="text-sm text-slate-400">You will receive a confirmation email shortly with further details.</p>
              <p className="text-sm text-slate-400 mt-2">Redirecting to the home page...</p>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Committee Info Dialog */}
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent className="max-w-md bg-slate-900 border border-indigo-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-400">
                {currentInfo.title}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[300px]">
              <div className="py-4">
                <p className="text-slate-200">{currentInfo.content}</p>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="py-6 text-center text-slate-500 text-sm"
      >
        <p>© {new Date().getFullYear()} Model United Nations Conference. All rights reserved.</p>
      </motion.div>
    </div>
  );
}