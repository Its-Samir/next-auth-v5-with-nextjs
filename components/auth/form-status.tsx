import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface FormStatusProps {
    success: boolean;
    message: string;
    className?: string;
}

export default function FormStatus({ message, success, className }: FormStatusProps) {
    if (!message) {
        return null;
    }

    if (success) {
        return (
            <div className={cn("text-sm my-2 p-4 flex gap-3 items-center bg-emerald-200 text-emerald-700", className)}>
                <CheckCircle size={18} />
                <p>{message}</p>
            </div>
        )
    }

    return (
        <div className={cn("text-sm p-3 flex gap-3 items-center text-destructive bg-red-200", className)}>
            <AlertTriangle size={18} />
            <p>{message}</p>
        </div>
    )
}
