import { ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function FormModal({
    open,
    title,
    onClose,
    onSubmit,
    children,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    children: ReactNode;
}) {
    return (
        <Modal open={open} onClose={onClose}>
            <h3>{title}</h3>
            <div className="modal-body">{children}</div>
            <div className="modal-actions">
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSubmit}>
                    Ok
                </Button>
            </div>
        </Modal>
    );
}
