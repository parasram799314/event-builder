import { useState } from "react"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (typeof window === "undefined") return

    // Create container if it doesn't exist
    let container = document.getElementById("custom-toast-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "custom-toast-container"
      container.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
      document.body.appendChild(container)
    }

    // Create toast element
    const toastEl = document.createElement("div")
    const isDestructive = variant === "destructive"
    
    toastEl.className = `p-4 rounded-xl border shadow-lg max-w-sm pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0 flex flex-col gap-1 ${
      isDestructive 
        ? "bg-red-50 text-red-950 border-red-200" 
        : "bg-white text-slate-900 border-slate-200"
    }`

    // Title
    if (title) {
      const titleEl = document.createElement("div")
      titleEl.className = "text-sm font-bold leading-tight"
      titleEl.innerText = title
      toastEl.appendChild(titleEl)
    }

    // Description
    if (description) {
      const descEl = document.createElement("div")
      descEl.className = `text-xs leading-normal ${isDestructive ? "text-red-800" : "text-slate-500"}`
      descEl.innerText = description
      toastEl.appendChild(descEl)
    }

    container.appendChild(toastEl)

    // Trigger animate-in
    requestAnimationFrame(() => {
      toastEl.className = toastEl.className.replace("translate-y-2 opacity-0", "translate-y-0 opacity-100")
    })

    // Remove after 3 seconds
    setTimeout(() => {
      toastEl.className = toastEl.className.replace("translate-y-0 opacity-100", "translate-y-2 opacity-0")
      setTimeout(() => {
        toastEl.remove()
        if (container && container.childNodes.length === 0) {
          container.remove()
        }
      }, 300)
    }, 3000)
  }

  return { toast }
}
