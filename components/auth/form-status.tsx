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

    return (
        <div className={cn(`text-sm p-3 rounded flex gap-3 items-center ${success ? "bg-emerald-200 text-emerald-700" : "text-destructive bg-red-200"}`, className)}>
            {success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <p>{message}</p>
        </div>
    )
}
