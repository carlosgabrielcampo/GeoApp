import { toast } from "react-toastify";

export const copyToclipboard = async (value: string) => {
    if (!value) {
        toast.error("No value to copy.");
        return;
    }

    if (!navigator?.clipboard?.writeText) {
        toast.error("Clipboard is not available in this browser.");
        return;
    }

    try {
        await navigator.clipboard.writeText(value);
        toast.success("Value copied.");
    } catch (error) {
        console.error("Failed to copy", error);
        toast.error("Failed to copy.");
    }
}