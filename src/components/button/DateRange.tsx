'use client'

import { formatDate } from '@/lib/date-formats';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Button, Preset } from '../button/button';

export type DateRangeValues = {
  option?: string;
  initialDate?: string | any;
  finalDate?: string | any;
  [key: string]: any; // Index signature for additional fields
};

export type SelectOption = {
    value: string | number;
    label: string;
  };

export type AdditionalField = {
    name: string;
    label: string;
    type: 'text' | 'number' | 'search' | 'select';
    placeholder?: string;
    options?: SelectOption[];
  };

type DateRangeProps = {
  onSubmit: (values: DateRangeValues) => void;
  loading?: boolean;
  additionalFields?: AdditionalField[];
};

export const DateRange: React.FC<DateRangeProps> = ({ onSubmit, loading = false, additionalFields }) => {
  const [option, setOption] = useState('1');
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [dateValues, setDateValues] = useState<DateRangeValues>({});
  const [additionalData, setAdditionalData] = useState<{[key: string]: any}>({});

  useEffect(() => {
    if (additionalFields) {
          const defaults: {[key: string]: any} = {};
          additionalFields?.forEach(field => {
            if (field.type === 'select' && field.options && field.options.length > 0 && additionalData[field.name] === undefined) {
              defaults[field.name] = field.options[0].value;
            }
          });
          if (Object.keys(defaults).length > 0) {
            setAdditionalData(prev => ({ ...defaults, ...prev }));
          }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalFields]);

  const handleAdditionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actualDate = DateTime.now();
    const formatedDate = actualDate.toFormat('yyyy-MM-dd');
    const startOfMonth = actualDate.startOf('month');
    const endOfMonth = actualDate.endOf('month');

    const values: DateRangeValues = {
      option: option,
      initialDate: option == '1' ? initialDate ? `${initialDate} 00:00:00` : `${formatedDate} 00:00:00` : initialDate ? `${initialDate} 00:00:00` : `${startOfMonth.toISODate()} 00:00:00`,
      finalDate: option == '2' ? finalDate ? `${finalDate} 23:59:59` : `${endOfMonth.toISODate()} 23:59:59` : "",
      ...additionalData
    };

    setDateValues(values)
    onSubmit(values)
  };

  return (<div>
    <form onSubmit={handleSubmit}>
    <div className="flex justify-center">
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]" >
          <input
            className="input-radio"
            type="radio"
            value="1"
            checked={option == '1'}
            onChange={(e) => setOption(e.target.value)}
          />
          <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="inlineRadio1">Fechas </label>
        </div>
        <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]" >
          <input
            className="input-radio"
            type="radio"
            value="2"
            checked={option == '2'}
            onChange={(e) => setOption(e.target.value)}
          />
          <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="inlineRadio1" >Rango de Fechas </label>
      </div>
    </div>



      <div className="w-full px-3 mb-2">
      <label htmlFor="initialDate" className="input-label">{option == '1' ? "Seleccionar Fecha" : "Fecha Inicial"}</label>
          <input
            className="input"
            type="date"
            id="initialDate"
            name="initialDate"
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
          />
      </div>

    {option == '2' && (
      <div className="w-full px-3 mb-2">
      <label htmlFor="finalDate" className="input-label">Fecha Final</label>

          <input
            className="input"
            type="date"
            id="finalDate"
            name="finalDate"
            value={finalDate}
            onChange={(e) => setFinalDate(e.target.value)}
            disabled={option != '2'}
          />
      </div>)}

      {additionalFields && additionalFields.map(field => (
        <div className="w-full px-3 mb-2" key={field.name}>
            <label htmlFor={field.name} className="input-label">{field.label}</label>
            {field.type === 'select' ? (
                <select
                    className="input-select"
                    id={field.name}
                    name={field.name}
                    onChange={handleAdditionalChange}
                    value={additionalData[field.name] || ''}
                >
                    {field.placeholder && !additionalData[field.name] && <option value="">{field.placeholder}</option>}
                    {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    className="input"
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder || ''}
                    onChange={handleAdditionalChange}
                    value={additionalData[field.name] || ''}
                />
            )}
        </div>
        ))}

      <div className="flex justify-center">
       <Button text='Aplicar' type="submit" preset={loading ? Preset.saving : Preset.save} disabled={loading} />
      </div>

      <div className="mt-3 text-danger flex items-center justify-center h-full font-semibold">
          {
            Object.keys(dateValues).length != 0 ? dateValues.option == '1' ? `Fecha establecida ${formatDate(dateValues.initialDate)}` : `Fechas de ${formatDate(dateValues.initialDate)} a ${formatDate(dateValues.finalDate)}` : ""
          }
      </div>
    </form>
    </div>);
};