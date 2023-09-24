import React, { HTMLAttributes, RefObject, useContext, useRef, useState } from 'react';
import { Warning, InputType, InputAction } from './Passengers.types';
import { SearchFlightContext } from '../../context/SearchFlightContext';
import { PassengersData } from '../../helper/Types';
import { useTranslation } from 'react-i18next';
import { useAreaAwareClick } from '../../helper/AreaAwareClick.hook';

import { PassengersSelectionRow } from './PassengersSelectionRow';
import { JourneyType } from '../../api/MasterData';

const dateFormatOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
import { CuiButton } from '@condor/ui-shared-components';
import { CuiDividerHorizontal } from '../BasicComponents';
import { CloseIcon } from '../BasicComponents/Icons';

interface PassengersSelectionProps extends HTMLAttributes<HTMLElement> {
  onClose: () => void;
  labelRef: RefObject<HTMLDivElement>;
}

export function PassengersSelection({ onClose, labelRef }: PassengersSelectionProps) {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: 'SEARCH.components.searchWidget.passengers' });
  const [warning, setWarning] = useState<Warning>();
  const { passengersData, setPassengersData, departureDay, returnDay, journeyType } = useContext(SearchFlightContext);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useAreaAwareClick({
    ref: wrapperRef,
    labelRef: labelRef,
    outsideAction: onClose,
    insideAction: resetWarning,
  });

  const dateText = t('AGE_HINT_DATE', { date: getDateLabel() });

  return (
    <div className="passenger-selection-container" ref={wrapperRef}>
      <div className="passenger-selection-header">
        <div className="title">{t('TITLE')}</div>
        <div
          className="close-icon"
          onClick={onClose}
          onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.code === 'Enter') {
              onClose();
            }
          }}
          tabIndex={0}
          role={'button'}
        >
          <CloseIcon />
        </div>
      </div>
      <PassengersSelectionRow
        id={'adults'}
        text={t('ADULTS_LABEL')}
        subtext={t('ADULT_AGE_HINT')}
        subtext2={dateText}
        amount={passengersData.adults}
        warning={getWarningText(InputType.Adults)}
        onDecrement={() => actionHandler(InputAction.Decrement, InputType.Adults)}
        onIncrement={() => actionHandler(InputAction.Increment, InputType.Adults)}
      />
      <CuiDividerHorizontal />
      <PassengersSelectionRow
        id={'children'}
        text={t('CHILDREN_LABEL')}
        subtext={t('CHILD_AGE_HINT')}
        subtext2={dateText}
        amount={passengersData.children}
        warning={getWarningText(InputType.Children)}
        onDecrement={() => actionHandler(InputAction.Decrement, InputType.Children)}
        onIncrement={() => actionHandler(InputAction.Increment, InputType.Children)}
      />
      <CuiDividerHorizontal />
      <PassengersSelectionRow
        id={'infants'}
        text={t('INFANTS_LABEL')}
        subtext={t('INFANT_AGE_HINT')}
        subtext2={dateText}
        amount={passengersData.infants}
        warning={getWarningText(InputType.Infants)}
        onDecrement={() => actionHandler(InputAction.Decrement, InputType.Infants)}
        onIncrement={() => actionHandler(InputAction.Increment, InputType.Infants)}
      />
      <div className="button-container">
        <CuiButton
          label={t('BUTTON_TEXT')}
          aria-label={t('ARIA_BUTTON') || undefined}
          onClick={onClose}
          variant="primary"
          className="continue-button"
        />
      </div>
    </div>
  );

  function resetWarning() {
    setWarning(undefined);
  }

  function getWarningText(target: InputType): string {
    return (warning && warning.target === target && t(warning.messageKey)) || '';
  }

  function actionHandler(action: InputAction, target: InputType) {
    const newData = { ...passengersData };

    let newWarning = undefined;
    switch (target) {
      case InputType.Adults:
        if (action === InputAction.Increment) {
          newData.adults++;
        } else {
          //decrement
          if (newData.adults > 1) {
            if (newData.adults > newData.infants) {
              newData.adults--;
            } else {
              //decrement would put less adults than infants in the booking
              newWarning = { target, messageKey: 'INFANT_AMOUNT_WARNING' };
            }
          }
        }
        break;
      case InputType.Children:
        if (action === InputAction.Increment) {
          newData.children++;
        } else {
          //decrement
          if (newData.children > 0) {
            newData.children--;
          }
        }
        break;
      case InputType.Infants:
        if (action === InputAction.Increment) {
          if (newData.infants < newData.adults) {
            newData.infants++;
          } else {
            //increment would put more infants than adults in the booking
            newWarning = { target, messageKey: 'INFANT_AMOUNT_WARNING' };
          }
        } else {
          //decrement
          if (newData.infants > 0) {
            newData.infants--;
          }
        }
        break;
      default:
        break;
    }

    if (sumPassengers(newData) > 9) {
      newWarning = { target, messageKey: 'GROUP_AMOUNT_WARNING' };
    }

    if (newWarning) {
      setWarning(newWarning);
    } else {
      setPassengersData(newData);
    }
  }

  function sumPassengers(data: PassengersData): number {
    return data.adults + data.children;
  }

  function getDateLabel(): string {
    const browserLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    const dateLocale = (i18n.language === 'de' && 'de-DE') || (i18n.language === 'en' && 'en-US') || browserLocale;
    return (
      (journeyType === JourneyType.RoundTrip &&
        returnDay &&
        returnDay.toLocaleDateString(dateLocale, dateFormatOptions)) ||
      (journeyType === JourneyType.RoundTrip && t('RETURN_DAY')) ||
      (departureDay && departureDay.toLocaleDateString(dateLocale, dateFormatOptions)) ||
      t('TRAVEL_DAY')
    );
  }
}
