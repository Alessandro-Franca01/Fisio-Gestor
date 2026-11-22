import React from 'react';
import { Icon } from '../Icon';
import { Field, SelectField, inputClass } from '../form';
import { maskBRLInput } from '../../utils/currency';

const PAYMENT_METHODS = [
  { value: 'Dinheiro', label: 'Dinheiro' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Cartao', label: 'Cartão' },
  { value: 'Debito', label: 'Débito' },
  { value: 'Gratuito', label: 'Gratuito' },
  { value: 'Convenio', label: 'Convênio' },
];

interface Props {
  isPaid: boolean;
  amount: string;
  method: string;
  onIsPaidChange: (v: boolean) => void;
  onAmountChange: (v: string) => void;
  onMethodChange: (v: string) => void;
}

export const PaymentSection: React.FC<Props> = ({ isPaid, amount, method, onIsPaidChange, onAmountChange, onMethodChange }) => (
  <div className="mt-8 border-t border-border-light dark:border-border-dark pt-6">
    <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4 flex items-center gap-2">
      <Icon name="payments" className="text-primary" />
      Dados do Pagamento
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col min-w-40 flex-1">
        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Status do Pagamento</p>
        <div className="flex items-center gap-4 h-12 px-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
          {[
            { label: 'Pago', value: true },
            { label: 'Pendente', value: false },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isPaid"
                checked={isPaid === opt.value}
                onChange={() => onIsPaidChange(opt.value)}
                className="form-radio text-primary focus:ring-primary"
              />
              <span className="text-text-light dark:text-text-dark">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="Valor (R$)">
        <input
          value={amount}
          onChange={e => onAmountChange(maskBRLInput(e.target.value))}
          className={inputClass}
          type="text"
          placeholder="R$ 0,00"
        />
      </Field>

      <SelectField label="Forma de Pagamento" value={method} onChange={onMethodChange} options={PAYMENT_METHODS} placeholder={null} />
    </div>
  </div>
);
