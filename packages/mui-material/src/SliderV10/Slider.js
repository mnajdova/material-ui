'use client';
/* eslint-disable react/prop-types -- prototype; the real component gets
   propTypes generated from the .d.ts via `pnpm proptypes`. */
import * as React from 'react';
import {
  SliderRoot,
  SliderRail,
  SliderTrack,
  SliderMarks,
  SliderThumb,
  SliderValueLabel,
} from './parts';

// v10 high-level Slider — a thin, published composition of the parts in
// ./parts.js (see the "v10 Component API — Composition" RFC). Need a
// different structure? Copy this component and edit it.
//
// Styling is fully delegated to the static `slider.css` stylesheet; behavior
// and accessibility come from Base UI through the parts. In the packaged
// version the stylesheet is side-effect imported here:
//   import './slider.css';

function Identity(x) {
  return x;
}

const Slider = React.forwardRef(function Slider(props, ref) {
  const {
    'aria-label': ariaLabel,
    'aria-valuetext': ariaValuetext,
    getAriaLabel,
    getAriaValueText,
    marks = false,
    onChange,
    onChangeCommitted,
    shiftStep,
    tabIndex,
    valueLabelDisplay = 'off',
    valueLabelFormat = Identity,
    ...rootProps
  } = props;

  // One thumb per value; the count is known from the props.
  const rawValue = props.value ?? props.defaultValue;
  const thumbCount = Array.isArray(rawValue) ? rawValue.length : 1;

  // Adapt Base UI's (value, eventDetails) callbacks to the v9 signatures.
  const handleValueChange = onChange
    ? (value, eventDetails) => onChange(eventDetails.event, value, eventDetails.activeThumbIndex)
    : undefined;
  const handleValueCommitted = onChangeCommitted
    ? (value, eventDetails) => onChangeCommitted(eventDetails.event, value)
    : undefined;

  return (
    <SliderRoot
      ref={ref}
      marks={marks}
      largeStep={shiftStep}
      onValueChange={handleValueChange}
      onValueCommitted={handleValueCommitted}
      {...rootProps}
    >
      <SliderRail />
      <SliderTrack />
      {marks ? <SliderMarks /> : null}
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderThumb
          key={index}
          index={index}
          aria-label={getAriaLabel ? undefined : ariaLabel}
          aria-valuetext={ariaValuetext}
          getAriaLabel={getAriaLabel}
          getAriaValueText={getAriaValueText}
          tabIndex={tabIndex}
        >
          {valueLabelDisplay !== 'off' ? (
            <SliderValueLabel open={valueLabelDisplay === 'on' || undefined}>
              {(value, thumbIndex) =>
                typeof valueLabelFormat === 'function'
                  ? valueLabelFormat(value, thumbIndex)
                  : valueLabelFormat
              }
            </SliderValueLabel>
          ) : null}
        </SliderThumb>
      ))}
    </SliderRoot>
  );
});

export default Slider;
