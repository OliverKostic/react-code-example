import { StepperMinus, StepperPlus, WarningTriangle } from '../BasicComponents/Icons';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface SelectionRowProps {
  id: string;
  text: string;
  subtext: string;
  subtext2: string;
  amount: number;
  warning: string;
  onDecrement: () => void;
  onIncrement: () => void;
}

export const PassengersSelectionRow = (props: SelectionRowProps) => {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: 'SEARCH.components.searchWidget.passengers' });

  return (
    <div id={props.id} className="category-container">
      <div className="content-container">
        <div className="text-container">
          <div
            className="title"
            tabIndex={0}
            role="menuitem"
            aria-label={
              t('ARIA_CATEGORY', {
                name: props.text,
                amount: props.amount,
              }) || undefined
            }
          >
            {props.text}
          </div>
          <div className="subtext">{props.subtext}</div>
          <div className="subtext">{props.subtext2}</div>
        </div>

        <div className="input-container">
          <div
            className="stepper-button"
            data-testid={props.id + '-decrement'}
            onClick={props.onDecrement}
            onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.code === 'Enter') {
                props.onDecrement();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={t('ARIA_DECREMENT', { name: props.text }) || undefined}
          >
            <StepperMinus />
          </div>

          <label
            data-testid={props.id + '-label'}
            className="amount-label"
            aria-live="polite"
            aria-atomic="true"
            aria-label={t('ARIA_CURRENT_NUMBER', { name: props.text, amount: props.amount }) || undefined}
          >
            {props.amount}
          </label>

          <div
            className="stepper-button"
            data-testid={props.id + '-increment'}
            onClick={props.onIncrement}
            onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.code === 'Enter') {
                props.onIncrement();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={t('ARIA_INCREMENT', { name: props.text }) || undefined}
          >
            <StepperPlus />
          </div>
        </div>
      </div>

      {props.warning && (
        <div className="warning-container">
          <div className="warning-icon">
            <WarningTriangle />
          </div>
          <div className="warning" role="alertdialog">
            {props.warning}
          </div>
        </div>
      )}
    </div>
  );
};
