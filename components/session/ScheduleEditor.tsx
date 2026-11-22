import React from 'react';
import { Icon } from '../Icon';
import { selectClass } from '../form';
import { DAYS_OF_WEEK, ScheduleSlot } from '../../utils/sessionSchedule';

interface Props {
  schedules: ScheduleSlot[];
  hours: string[];
  onChange: (schedules: ScheduleSlot[]) => void;
}

export const ScheduleEditor: React.FC<Props> = ({ schedules, hours, onChange }) => {
  const update = (index: number, field: keyof ScheduleSlot, value: string) =>
    onChange(schedules.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  const add = () => onChange([...schedules, { day_of_week: 'Segunda-feira', time: '09:00' }]);

  const remove = (index: number) => {
    if (schedules.length > 1) onChange(schedules.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Horários Fixos da Semana</p>
      <div className="flex flex-col gap-4">
        {schedules.map((slot, i) => (
          <div key={i} className="flex items-end gap-4">
            <label className="flex flex-col min-w-40 flex-1">
              <select value={slot.day_of_week} onChange={e => update(i, 'day_of_week', e.target.value)} className={selectClass}>
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col min-w-32 flex-none">
              <select value={slot.time} onChange={e => update(i, 'time', e.target.value)} className={selectClass}>
                {hours.map(hour => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={schedules.length <= 1}
              className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-text-light dark:text-text-dark hover:bg-primary/10 disabled:opacity-30"
            >
              <Icon name="delete" className="text-red-500" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary/20 dark:bg-primary/30 text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/30"
        >
          <Icon name="add" />
          <span className="truncate">Adicionar Horário</span>
        </button>
      </div>
    </div>
  );
};
