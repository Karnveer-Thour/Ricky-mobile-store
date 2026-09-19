/**
 * FieldError.tsx
 *
 * Tiny, reusable component that renders a react-hook-form field error
 * with the store-web design system styling (red, small, animated).
 */
import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  message?: string;
}

export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 mt-1 text-[10px] text-red-400 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle size={10} className="shrink-0" />
      {message}
    </p>
  );
}
