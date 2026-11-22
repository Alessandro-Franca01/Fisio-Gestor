import React from 'react';
import { Icon } from '../Icon';
import { FieldConfig, SectionConfig } from './sections';

const fieldInputClass =
  'px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-subtle-light/50 dark:placeholder:text-subtle-dark/50';
const labelClass = 'text-sm font-semibold text-text-light dark:text-text-dark';

export interface AssessmentValues {
  texts: Record<string, string>;
  painLevel: number | '';
}

interface Props {
  section: SectionConfig;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  values: AssessmentValues;
  onTextChange: (key: string, value: string) => void;
  onPainChange: (value: number) => void;
}

const Field: React.FC<{
  field: FieldConfig;
  values: AssessmentValues;
  onTextChange: Props['onTextChange'];
  onPainChange: Props['onPainChange'];
}> = ({ field, values, onTextChange, onPainChange }) => {
  if (field.kind === 'range') {
    return (
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>{field.label}</label>
        <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
          <input
            type="range"
            min={0}
            max={10}
            value={values.painLevel || 0}
            onChange={e => onPainChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold">
            {values.painLevel}
          </div>
        </div>
      </div>
    );
  }

  const value = values.texts[field.key] ?? '';
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{field.label}</label>
      {field.kind === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onTextChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          className={fieldInputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onTextChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={fieldInputClass}
        />
      )}
    </div>
  );
};

export const AssessmentFormSection: React.FC<Props> = ({ section, isExpanded, onToggle, values, onTextChange, onPainChange }) => (
  <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
    <div
      className="flex items-center justify-between p-4 bg-primary/5 border-l-4 border-primary cursor-pointer hover:bg-primary/10 transition-colors"
      onClick={() => onToggle(section.id)}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded-md text-primary">
          <Icon name="folder_open" className="text-lg" />
        </div>
        <h3 className="text-base font-bold text-text-light dark:text-text-dark">{section.title}</h3>
      </div>
      <Icon name={isExpanded ? 'expand_less' : 'expand_more'} className="text-subtle-light dark:text-subtle-dark" />
    </div>

    {isExpanded && (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {section.fields.map(field => (
          // Campos de texto curto ocupam meia coluna; os demais, a linha toda
          <div key={field.key} className={field.kind === 'text' ? '' : 'md:col-span-2'}>
            <Field field={field} values={values} onTextChange={onTextChange} onPainChange={onPainChange} />
          </div>
        ))}
      </div>
    )}
  </div>
);
