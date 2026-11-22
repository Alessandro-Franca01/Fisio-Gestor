import React from 'react';
import { Icon } from '../Icon';

export const FormSection: React.FC<{
  icon: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <div className="flex items-center gap-3 mb-6 border-b border-border-light dark:border-border-dark pb-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Icon name={icon} />
      </div>
      <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{title}</h2>
    </div>
    {children}
  </section>
);

export const ErrorAlert: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="flex items-start gap-3">
      <Icon name="error" className="text-red-600 dark:text-red-400 mt-0.5" />
      <div>
        <p className="text-red-800 dark:text-red-300 font-medium">{title}</p>
        <p className="text-red-700 dark:text-red-400 text-sm mt-1 whitespace-pre-line">{message}</p>
      </div>
    </div>
  </div>
);

export const SuccessAlert: React.FC<{ message: string; hint?: string }> = ({ message, hint }) => (
  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="flex items-start gap-3">
      <div className="p-1 bg-green-500 rounded-full">
        <Icon name="check" className="text-white text-xs" />
      </div>
      <div>
        <p className="text-green-800 dark:text-green-300 font-medium">{message}</p>
        {hint && <p className="text-green-700 dark:text-green-400 text-sm mt-0.5">{hint}</p>}
      </div>
    </div>
  </div>
);
