/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Globe, Check, User, Mail, FileText, Phone, Building, Flag, Upload, Image as ImageIcon } from "lucide-react"
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

// Define committee info outside component to prevent recreation
const COMMITTEE_INFO = {
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

// Static data
const committees = [
  { value: "unsc", label: "UN Security Council" },
  { value: "unga", label: "UN General Assembly" },
  { value: "unhrc", label: "UN Human Rights Council" },
  { value: "who", label: "World Health Organization" },
  { value: "ipc", label: "International Press Corps" },
  { value: "disec", label: "Disarmament and International Security" },
];

const classOptions = [
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
];

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  school: z.string().min(1, "School name is required"),
  class: z.string().min(1, "Class is required"),
  email: z.string().email("Please enter a valid email address"),
  portfolio: z.string().min(1, "Portfolio is required"),
  formId: z.string().min(1, "Form ID is required"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  committee: z.string().min(1, "Please select a committee"),

  profilePicture: z.string().optional()
});

// Animation variants defined once
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

export default function RegistrationForm() {
  // Group related state together
  const [formState, setFormState] = useState({
    isSubmitting: false,
    showSuccess: false,
    showInfoDialog: false,
    isVisible: false,
  });
  
  const [mediaState, setMediaState] = useState({
    profileImage: null as File | null,
    profileImagePreview: null as string | null,
    uploadingImage: false,
    backgroundPattern: 1,
  });
  
  const [currentInfo, setCurrentInfo] = useState({ title: "", content: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Use form hook only once with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      school: "",
      class: "",
      email: "",
      formId: "",
      portfolio : "",
      phone: "",
      committee: "",
      profilePicture: ""
    }
  });

  // Use useEffect sparingly, with proper dependencies
  useEffect(() => {
    setFormState(prev => ({ ...prev, isVisible: true }));
    
    // Use a ref to track interval ID
    const intervalId = setInterval(() => {
      setMediaState(prev => ({
        ...prev,
        backgroundPattern: prev.backgroundPattern >= 3 ? 1 : prev.backgroundPattern + 1
      }));
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Memoize handlers that don't need to be recreated on each render
  const handleProfileImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader API efficiently
    const reader = new FileReader();
    reader.onload = () => {
      setMediaState(prev => ({
        ...prev,
        profileImagePreview: reader.result as string,
        profileImage: file
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Memoize complex functions to prevent recreation on each render
  const uploadProfileImage = useCallback(async () => {
    const { profileImage } = mediaState;
    if (!profileImage) return "";
    
    try {
      setMediaState(prev => ({ ...prev, uploadingImage: true }));
      
      const formData = new FormData();
      formData.append("files", profileImage);
      
      const response = await axios.post('/api/pfpUpload', formData);
      
      if (response.data.success && response.data.fileUrls.length > 0) {
        return response.data.fileUrls[0];
      } else {
        toast.error("Failed to upload profile picture");
        return "";
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile picture");
      return "";
    } finally {
      setMediaState(prev => ({ ...prev, uploadingImage: false }));
    }
  }, [mediaState.profileImage]);

  const showCommitteeInfo = useCallback((committee: string) => {
    if (committee in COMMITTEE_INFO) {
      setCurrentInfo(COMMITTEE_INFO[committee as keyof typeof COMMITTEE_INFO]);
      setFormState(prev => ({ ...prev, showInfoDialog: true }));
    }
  }, []);

  // Handle form submission with optimized state updates
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Upload profile picture if one was selected
      let profilePictureUrl = "";
      if (mediaState.profileImage) {
        profilePictureUrl = await uploadProfileImage();
        values.profilePicture = profilePictureUrl;
      }
      
      await axios.post('/api/participants', values);
      
      toast.success("Registration successful! Redirecting to home page...");
      
      setFormState(prev => ({ ...prev, showSuccess: true }));
      
      // Use setTimeout only for UI transitions
      setTimeout(() => {
        router.push("/");
      }, 3000);
      
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [mediaState.profileImage, uploadProfileImage, router]);

  // Use useMemo for stable references to dialog handlers
  const handleDialogClose = useMemo(() => ({
    closeSuccessDialog: () => setFormState(prev => ({ ...prev, showSuccess: false })),
    closeInfoDialog: () => setFormState(prev => ({ ...prev, showInfoDialog: false })),
  }), []);

  // Optimize rendering by using memo for expensive UI elements
  const renderFormFields = useMemo(() => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={formState.isVisible ? "visible" : "hidden"}
      className="space-y-6"
    >
      {/* Name field */}
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

      {/* School field */}
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
      
      {/* Class field */}
      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4" /> Class
              </FormLabel>
              <FormControl>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 transition-all">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((classOption) => (
                        <SelectItem key={classOption.value} value={classOption.value}>
                          {classOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </FormControl>
              <FormDescription>
                Your current class or grade
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
      
      {/* Email field */}
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
      
      {/* Form ID field */}
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
      
      {/* Phone field */}
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

      {/* Committee field */}
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

          {/* Portfolio field */}
      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4" /> Portfolio
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
                This is a Portfolio which you will be using for the conference
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
      {/* Profile Picture field */}
      <motion.div variants={itemVariants}>
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-medium">
                <ImageIcon className="w-4 h-4" /> Profile Picture
              </FormLabel>
              
              <div className="space-y-4">
                {mediaState.profileImagePreview && (
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={mediaState.profileImagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <FormControl>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      onChange={handleProfileImageChange}
                      className="hidden" 
                      id="profile-picture-upload" 
                    />
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-dashed border-2 border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400 hover:text-indigo-300 flex items-center justify-center py-6"
                        disabled={mediaState.uploadingImage}
                      >
                        {mediaState.uploadingImage ? (
                          <>
                            <div className="h-5 w-5 border-2 border-t-transparent border-indigo-500 animate-spin rounded-full mr-2"></div>
                            Uploading...
                          </>
                        ) : mediaState.profileImagePreview ? (
                          <>
                            <Upload className="w-5 h-5 mr-2" />
                            Change Photo
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Photo
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </FormControl>
                
                <FormDescription>
                  Upload a profile picture (max 2MB, JPG, PNG or GIF)
                </FormDescription>
                <FormMessage />
              </div>
              
              {/* Hidden input to store the uploaded image URL */}
              <input type="hidden" {...fieldProps} value={value} />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  ), [form.control, mediaState.profileImagePreview, mediaState.uploadingImage, handleProfileImageChange, showCommitteeInfo, formState.isVisible]);

  // Create a function to handle dialog changes
  const handleDialogChange = useCallback((open: boolean, dialogType: 'success' | 'info') => {
    if (dialogType === 'success') {
      setFormState(prev => ({ ...prev, showSuccess: open }));
    } else {
      setFormState(prev => ({ ...prev, showInfoDialog: open }));
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Optimized Background with React.memo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`pattern-${mediaState.backgroundPattern}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <DeterministicBubbles pattern={mediaState.backgroundPattern as 1 | 2 | 3} />
        </motion.div>
      </AnimatePresence>

      <div className="container px-4 py-8 mx-auto relative z-10">
        {/* Header */}
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
        
        {/* Main Form Card */}
        <motion.div 
          className="max-w-3xl mx-auto bg-black/30 rounded-xl shadow-xl border border-indigo-500/20 overflow-hidden backdrop-blur-md relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
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
                {/* Pre-memo'ed form fields */}
                {renderFormFields}
                  
                {/* Submit Button */}
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
                      disabled={formState.isSubmitting}
                      className={cn(
                        "relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-medium py-3 px-10 rounded-md transition-all w-full sm:w-auto",
                        formState.isSubmitting && "opacity-80"
                      )}
                    >
                      {formState.isSubmitting ? (
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
                            className="absolute bottom-0 left-0 h-1 bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
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
        
        {/* Copyright and footnote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center text-slate-400 text-sm mt-12"
        >
          <p>© {new Date().getFullYear()} Model United Nations | All rights reserved</p>
          <p className="mt-1">Secure registration system for delegates</p>
        </motion.div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={formState.showSuccess} onOpenChange={(open) => handleDialogChange(open, 'success')}>
        <DialogContent className="bg-slate-900 border border-indigo-500/20 backdrop-blur-md relative sm:max-w-md">
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-indigo-500/20 to-green-500/20 rounded-xl blur-lg opacity-75 -z-10"
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
          <div className="h-1 bg-gradient-to-r from-green-500 via-indigo-500 to-green-500 absolute top-0 left-0 right-0" />
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="rounded-full bg-green-500/20 p-3"
              >
                <Check className="w-12 h-12 text-green-500" />
              </motion.div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-indigo-400">
              Registration Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-3 py-4">
            <p className="text-slate-300">
              Your registration for the Model United Nations has been successfully submitted!
            </p>
            <p className="text-slate-400">
              You will receive a confirmation email shortly with further details.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={handleDialogClose.closeSuccessDialog}
                className="bg-gradient-to-r from-green-600 via-teal-600 to-indigo-600 text-white px-8"
              >
                Great!
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Committee Info Dialog */}
      <Dialog open={formState.showInfoDialog} onOpenChange={(open) => handleDialogChange(open, 'info')}>
        <DialogContent className="bg-slate-900 border border-indigo-500/20 backdrop-blur-md relative sm:max-w-md">
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 rounded-xl blur-lg opacity-75 -z-10"
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
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 absolute top-0 left-0 right-0" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400">
              {currentInfo.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-2">
            <div className="space-y-3 py-2 pr-4">
              <p className="text-slate-300">
                {currentInfo.content}
              </p>
            </div>
          </ScrollArea>
          <div className="flex justify-center mt-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={handleDialogClose.closeInfoDialog}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-8"
              >
                Got it
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}