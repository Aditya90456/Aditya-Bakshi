
import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    if (toast.duration !== Infinity && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(toast.id), 300); // Wait for exit animation
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'loading': return <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
     switch (toast.type) {
         case 'success': return 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100';
         case 'error': return 'bg-red-950/90 border-red-500/30 text-red-100';
         default: return 'bg-zinc-900/90 border-zinc-800 text-zinc-100';
     }
  };

  return (
    <div 
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md min-w-[300px] max-w-md transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${getStyles()}`}
    >
      <div className="shrink-0">
          {getIcon()}
      </div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      {toast.type !== 'loading' && (
        <button onClick={handleDismiss} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 opacity-70" />
        </button>
      )}
    </div>
  );
};
