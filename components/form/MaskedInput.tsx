import React from 'react';
import { inputClass } from './styles';

interface MaskedInputProps {
  mask: string; // '9' representa um dígito
  value: string;
  onChange: (rawDigits: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export const applyMask = (val: string, mask: string): string => {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  let result = '';
  let digitIndex = 0;
  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '9') {
      result += digits[digitIndex++];
    } else {
      result += mask[i];
    }
  }
  return result;
};

export const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  value,
  onChange,
  onBlur,
  placeholder,
  className = inputClass,
  type = 'text',
}) => (
  <input
    type={type}
    value={applyMask(value, mask)}
    onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
    onBlur={onBlur}
    placeholder={placeholder}
    className={className}
  />
);
