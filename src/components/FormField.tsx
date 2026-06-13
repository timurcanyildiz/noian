import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** Etiket + input + hata mesajı içeren tek parça form alanı. */
export const FormField = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div>
        <label htmlFor={fieldId} className="field-label">
          {label}
          {props.required && <span className="text-clay-400"> *</span>}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn("input-field", error && "is-invalid", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-cocoa-400">{hint}</p>
        )}
        {error && (
          <p id={`${fieldId}-error`} className="field-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);
FormField.displayName = "FormField";

/** Basit doğrulama yardımcıları (Türkçe mesajlar) */
export const validators = {
  required: (v: string) => (v.trim() ? undefined : "Bu alan zorunludur."),
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? undefined
      : "Geçerli bir e-posta adresi girin.",
  minLen: (n: number) => (v: string) =>
    v.length >= n ? undefined : `En az ${n} karakter olmalı.`,
  phone: (v: string) =>
    !v || /^[0-9+()\s-]{10,}$/.test(v)
      ? undefined
      : "Geçerli bir telefon numarası girin.",
};
