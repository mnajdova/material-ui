'use client';
/* eslint-disable react/prop-types -- prototype; the real component gets
   propTypes generated from the .d.ts via `pnpm proptypes`. */
import * as React from 'react';
import clsx from 'clsx';
import { useRtl } from '@mui/system/RtlProvider';
import { useSlider, valueToPercent } from '../Slider/useSlider';

// v10 architecture prototype — see PLAN.md.
//
// Styling is fully delegated to the static `slider.css` stylesheet:
//   slots             → stable class names (`MuiSlider-*`)
//   enum props/states → data attributes (`data-color`, `data-dragging`, ...)
//   continuous values → inline CSS variables (`--Slider-thumb-offset`, ...)
//
// The packaged version side-effect-imports its stylesheet here:
//   import './slider.css';
// (left out of the prototype so the jsdom test run needs no CSS handling).
//
// Deliberately omitted vs. v9, per the v10 RFC: `sx`, `styled` wrapping,
// `classes`, `useDefaultProps`. `slots`/`slotProps` are kept in the final
// design but omitted from this pilot to focus on styling.

function Identity(x) {
  return x;
}

const Slider = React.forwardRef(function Slider(props, ref) {
  const {
    'aria-label': ariaLabel,
    'aria-valuetext': ariaValuetext,
    'aria-labelledby': ariaLabelledby,
    className,
    color = 'primary',
    defaultValue,
    disabled = false,
    disableSwap = false,
    getAriaLabel,
    getAriaValueText,
    marks: marksProp = false,
    max = 100,
    min = 0,
    name,
    onChange,
    onChangeCommitted,
    orientation = 'horizontal',
    scale = Identity,
    shiftStep = 10,
    size = 'medium',
    step = 1,
    style,
    tabIndex,
    track = 'normal',
    value: valueProp,
    valueLabelDisplay = 'off',
    valueLabelFormat = Identity,
    ...other
  } = props;

  // RTL still matters for pointer math inside useSlider; unlike v9 it is no
  // longer needed for styling — the stylesheet uses logical properties.
  const isRtl = useRtl();

  const {
    getRootProps,
    getHiddenInputProps,
    getThumbProps,
    open,
    active,
    focusedThumbIndex,
    range,
    dragging,
    marks,
    values,
    trackOffset,
    trackLeap,
    getThumbStyle,
  } = useSlider({
    'aria-labelledby': ariaLabelledby,
    defaultValue,
    disabled,
    disableSwap,
    isRtl,
    marks: marksProp,
    max,
    min,
    name,
    onChange,
    onChangeCommitted,
    orientation,
    rootRef: ref,
    scale,
    step,
    shiftStep,
    tabIndex,
    value: valueProp,
  });

  const marked = marks.length > 0 && marks.some((mark) => mark.label);
  const thumbProps = getThumbProps();
  const hiddenInputProps = getHiddenInputProps();

  return (
    <span
      {...getRootProps(other)}
      className={clsx('MuiSlider-root', className)}
      data-orientation={orientation}
      data-color={color}
      data-size={size}
      data-track={String(track)}
      data-disabled={disabled || undefined}
      data-dragging={dragging || undefined}
      data-marked={marked || undefined}
      style={{
        '--Slider-track-offset': `${trackOffset}%`,
        '--Slider-track-leap': `${trackLeap}%`,
        ...style,
      }}
    >
      <span className="MuiSlider-rail" />
      <span className="MuiSlider-track" />
      {marks
        .filter((mark) => mark.value >= min && mark.value <= max)
        .map((mark, index) => {
          const percent = valueToPercent(mark.value, min, max);

          let markActive;
          if (track === false) {
            markActive = values.includes(mark.value);
          } else {
            markActive =
              (track === 'normal' &&
                (range
                  ? mark.value >= values[0] && mark.value <= values[values.length - 1]
                  : mark.value <= values[0])) ||
              (track === 'inverted' &&
                (range
                  ? mark.value <= values[0] || mark.value >= values[values.length - 1]
                  : mark.value >= values[0]));
          }

          return (
            <React.Fragment key={index}>
              <span
                className="MuiSlider-mark"
                data-index={index}
                data-active={markActive || undefined}
                style={{ '--Slider-mark-offset': `${percent}%` }}
              />
              {mark.label != null ? (
                <span
                  aria-hidden
                  className="MuiSlider-markLabel"
                  data-index={index}
                  data-active={markActive || undefined}
                  style={{ '--Slider-mark-offset': `${percent}%` }}
                >
                  {mark.label}
                </span>
              ) : null}
            </React.Fragment>
          );
        })}
      {values.map((value, index) => {
        const percent = valueToPercent(value, min, max);

        return (
          <span
            key={index}
            {...thumbProps}
            className="MuiSlider-thumb"
            data-index={index}
            data-active={active === index || undefined}
            data-focus-visible={focusedThumbIndex === index || undefined}
            style={{
              '--Slider-thumb-offset': `${percent}%`,
              // z-index of the last-used thumb has no CSS hook by design;
              // plain inline styles are still fine in the v10 architecture.
              ...getThumbStyle(index),
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props --
                same attributes as v9; the rule only fires here because the
                input is a host element instead of a slot component. */}
            <input
              data-index={index}
              aria-label={getAriaLabel ? getAriaLabel(index) : ariaLabel}
              aria-valuenow={scale(value)}
              aria-valuetext={
                getAriaValueText ? getAriaValueText(scale(value), index) : ariaValuetext
              }
              {...hiddenInputProps}
              value={values[index]}
            />
            {valueLabelDisplay !== 'off' ? (
              <span
                aria-hidden
                className="MuiSlider-valueLabel"
                data-open={
                  open === index || active === index || valueLabelDisplay === 'on' || undefined
                }
              >
                {typeof valueLabelFormat === 'function'
                  ? valueLabelFormat(scale(value), index)
                  : valueLabelFormat}
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
});

export default Slider;
