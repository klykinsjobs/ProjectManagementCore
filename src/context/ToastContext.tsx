import { createContext, useContext, useState, ReactNode } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
};

type ToastContextValue = {
    toasts: Toast[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (type: ToastType, message: string) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");

    return {
        success: (msg: string) => ctx.addToast("success", msg),
        error: (msg: string) => ctx.addToast("error", msg),
        info: (msg: string) => ctx.addToast("info", msg),
    };
}

export function useToastState() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToastState must be used within ToastProvider");
    return ctx;
}
