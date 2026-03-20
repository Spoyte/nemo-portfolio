"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Sparkles, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "info" | "achievement";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastSystemProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    achievement: <Trophy className="h-5 w-5 text-yellow-500" />,
  };

  const gradients = {
    success: "from-green-500/20 to-emerald-500/20",
    error: "from-red-500/20 to-rose-500/20",
    info: "from-blue-500/20 to-cyan-500/20",
    achievement: "from-yellow-500/20 to-amber-500/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradients[toast.type]} backdrop-blur-md border border-white/20 shadow-lg`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="mt-0.5">{icons[toast.type]}</div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-sm">{toast.title}</p>
          )}
          <p className="text-sm text-muted-foreground">{toast.message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className="h-1 bg-white/30 origin-left"
      />
    </motion.div>
  );
}

export function ToastContainer({ toasts, removeToast }: ToastSystemProps) {
  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for using toast system
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", title?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
