import React from "react";
import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  icon?: React.ReactElement<{ className?: string }>;
}

export function FormInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  icon,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </label>

      <div className="relative group">
        {icon &&
          React.cloneElement(icon, {
            className: `absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              error ? "text-destructive" : "text-muted-foreground"
            }`,
          })}

        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-background py-3 ${
            icon ? "pl-12" : "pl-4"
          } pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:ring-2 ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-border focus:border-primary focus:ring-primary/20"
          }`}
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
