import React, { useContext, useEffect, useRef, useState } from 'react';
import { PassengersSelection } from './PassengersSelection';
import { SearchFlightContext } from '../../context/SearchFlightContext';
import { useTranslation } from 'react-i18next';
import { PassengerIcon } from '../BasicComponents/Icons';

import './Passengers.scss';
import { CuiIcon } from '@condor/ui-shared-components';

export function Passengers() {
  const { t } = useTranslation(undefined, { keyPrefix: 'SEARCH.components.searchWidget.passengers' });
  const { passengersData } = useContext(SearchFlightContext);
  const labelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleClick() {
    setIsOpen((prevState) => !prevState);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.code === 'Enter') {
      handleClick();
    } else if (event.code === 'Esc') {
      close();
    }
  }

  function getInputLabelText() {
    const count = passengersData.adults + passengersData.children + passengersData.infants;
    const label = count === 1 ? t('LABEL') : t('LABEL_PLURAL');
    return `${count} ${label}`;
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="passenger-component">
      <div
        className="passenger-container"
        ref={labelRef}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="menu"
        aria-label={`${!isOpen ? t('ARIA_CHOOSE') : ''} ${getInputLabelText()}.`}
        aria-expanded={isOpen}
        aria-haspopup={isOpen}
      >
        <div className="icon">
          <PassengerIcon />
        </div>
        <div id="passengers-label" data-testid={'passenger-label'} className="label">
          {getInputLabelText()}
        </div>
        <div className="dropdown-arrow">
          {isOpen ? <CuiIcon.Cui_icon_chevron_down_outline /> : <CuiIcon.Cui_icon_chevron_up_outline />}
        </div>
      </div>
      {isOpen && <PassengersSelection onClose={close} labelRef={labelRef} />}
    </div>
  );
}
