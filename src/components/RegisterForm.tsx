"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, Check, User, MapPin, Mail, FileText, Phone } from "lucide-react"

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
  DialogTitle 
} from "@/components/ui/dialog"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  school: z.string().min(1, "School name is required"),
  email: z.string().email("Please enter a valid email address"),
  formId: z.string().min(1, "Form ID is required"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15)
});

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      school: "",
      email: "",
      formId: "",
      phone: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      console.log(values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Registration submitted successfully!");
      setShowSuccess(true);
      
      // Here you would actually send the data to your API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // });
      // if (!response.ok) throw new Error('Failed to submit');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container px-4 py-8 mx-auto">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Globe className="w-16 h-16 text-blue-700 dark:text-blue-400" />
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 dark:border-blue-600"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            Model United Nations
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300">
            Delegate Registration Form
          </p>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800" />
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
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
                            <Input 
                              placeholder="Enter your full name"
                              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                              {...field} 
                            />
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
                            <MapPin className="w-4 h-4" /> School
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your school or institution"
                              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                              {...field} 
                            />
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
                            <Input 
                              placeholder="Your email address"
                              type="email"
                              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                              {...field} 
                            />
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
                            <Input 
                              placeholder="Your unique form ID"
                              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                              {...field} 
                            />
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
                            <PhoneInput
                              placeholder="Your contact number"
                              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                              {...field}
                              defaultCountry="IN"
                            />
                          </FormControl>
                          <FormDescription>
                            Will be used for urgent communications
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
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-8 rounded-md shadow-md transition-all w-full sm:w-auto",
                      isSubmitting && "opacity-80"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Submitting</span>
                        <motion.div 
                          className="absolute inset-0 bg-white/20"
                          animate={{ x: ["0%", "100%"] }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity,
                            ease: "linear" 
                          }}
                        />
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
          
          <div className="pb-4 px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            By submitting this form, you agree to the terms and conditions of the MUN event.
          </div>
        </motion.div>
      </div>
      
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Registration Successful!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-center text-slate-700 dark:text-slate-300">
              Thank you for registering for the Model United Nations event. 
              We have sent a confirmation to your email with further details.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowSuccess(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}