import React from 'react';
import { Icon } from '../Icon';
import { inputClass, selectClass, textareaClass } from './styles';
import { MaskedInput } from './MaskedInput';

type CommonProps = { label: string; required?: boolean; className?: string };

export const Field: React.FC<CommonProps & { children: React.ReactNode }> = ({
  label,
  required,
  className = '',
  children,
}) => (
  <label className={`flex flex-col ${className}`}>
    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </p>
    {children}
  </label>
);

export const TextField: React.FC<
  CommonProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange'> & {
      onChange: (value: string) => void;
    }
> = ({ label, required, className, onChange, ...rest }) => (
  <Field label={label} required={required} className={className}>
    <input {...rest} onChange={e => onChange(e.target.value)} className={inputClass} />
  </Field>
);

export const MaskedField: React.FC<
  CommonProps & {
    mask: string;
    value: string;
    onChange: (rawDigits: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }
> = ({ label, required, className, ...rest }) => (
  <Field label={label} required={required} className={className}>
    <MaskedInput {...rest} />
  </Field>
);

export const SelectField: React.FC<
  CommonProps & {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string | null;
    disabled?: boolean;
    hint?: string;
  }
> = ({ label, required, className, value, onChange, options, placeholder = 'Selecione', disabled, hint }) => (
  <Field label={label} required={required} className={className}>
    <div className="relative">
      <select
        value={value}
        required={required}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className={selectClass}
      >
        {placeholder !== null && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-light dark:text-text-dark">
        <Icon name="chevron_right" className="rotate-90 text-sm" />
      </div>
    </div>
    {hint && <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">{hint}</p>}
  </Field>
);

export const TextAreaField: React.FC<
  CommonProps &
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'onChange'> & {
      onChange: (value: string) => void;
    }
> = ({ label, required, className, onChange, ...rest }) => (
  <Field label={label} required={required} className={className}>
    <textarea {...rest} onChange={e => onChange(e.target.value)} className={textareaClass} />
  </Field>
);
