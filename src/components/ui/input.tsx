import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-indigo-300/50 selection:bg-indigo-700 selection:text-white border-indigo-500/30 flex h-10 w-full min-w-0 rounded-md border bg-black/30 px-4 py-2 text-base text-white shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-indigo-500/70 focus-visible:bg-black/40 focus-visible:shadow-indigo-500/20 focus-visible:shadow-md",
        "aria-invalid:border-red-500/50 aria-invalid:bg-red-900/10",
        "hover:bg-black/40 focus:bg-black/40",
        "!bg-black/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
