import { ButtonHTMLAttributes } from "react";

export function Button({
    variant = "default",
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "danger" }) {
    return (
        <button
            {...props}
            className={`ui-button ui-button-${variant} ${props.className ?? ""}`}
        />
    );
}
