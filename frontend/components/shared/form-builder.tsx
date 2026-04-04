'use client';

import React from 'react';
import { ZodSchema } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export type FormFieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  rows?: number;
}

interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
  validationSchema?: ZodSchema;
  className?: string;
}

export function FormBuilder({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  validationSchema,
  className,
}: FormBuilderProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.name] = field.value || '';
    });
    return initial;
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (validationSchema) {
        validationSchema.parse(formData);
      }
      setErrors({});
      await onSubmit(formData);
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {fields.map((field) => {
        const error = errors[field.name];

        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium">{field.label}</label>

            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                disabled={field.disabled || loading}
                rows={field.rows || 4}
                className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-foreground placeholder-muted-foreground disabled:opacity-50"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                disabled={field.disabled || loading}
                className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-foreground disabled:opacity-50"
              >
                <option value="">Select an option</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled || loading}
                  className="w-4 h-4 border border-input rounded cursor-pointer"
                />
                <span className="text-sm">{field.label}</span>
              </label>
            ) : (
              <Input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                disabled={field.disabled || loading}
              />
            )}

            {error && (
              <div className="flex gap-2 items-start text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );
      })}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : submitLabel}
      </Button>
    </form>
  );
}
