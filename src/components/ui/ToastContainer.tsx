import { useToastState } from "../../context/ToastContext";

export function ToastContainer() {
    const { toasts, removeToast } = useToastState();

    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`toast toast-${t.type}`}
                    onClick={() => removeToast(t.id)}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}
