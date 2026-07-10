'use client';
/* eslint-disable react/prop-types -- prototype; the real components get
   propTypes generated from the .d.ts via `pnpm proptypes`. */
import * as React from 'react';
import clsx from 'clsx';
import { Slider as BaseSlider } from '@base-ui/react/slider';

// Composition parts for the v10 Slider — Material-styled Base UI parts.
// See PLAN.md and the "v10 Component API — Composition" RFC.
//
// Anatomy (v9-compatible selector contract, unchanged slider.css):
//
//   <Slider.Root>            Base.Root (display: contents) > Base.Control = .MuiSlider-root
//     <Slider.Rail />        plain span — styled entirely by slider.css
//     <Slider.Track />       plain span — positioned by the --Slider-track-* vars
//     <Slider.Marks />       plain spans — data-driven from Root context
//     <Slider.Thumb>         Base.Thumb = .MuiSlider-thumb (owns the hidden input, a11y,
//       <Slider.ValueLabel/>   keyboard and pointer behavior, inline positioning)
//     </Slider.Thumb>
//   </Slider.Root>
//
// Base UI emits data-dragging / data-orientation / data-disabled on the parts —
// the same names slider.css already targets. Material adds the rest of the
// contract: data-color / data-size / data-track / data-marked on the root,
// data-active / data-focus-visible on the thumb, data-open on the value label.

function valueToPercent(value, min, max) {
  return ((value - min) * 100) / (max - min);
}

const SliderContext = React.createContext(null);
const ThumbContext = React.createContext(null);

function useSliderContext(part) {
  const context = React.useContext(SliderContext);
  if (context === null) {
    throw new Error(`MUI: <Slider.${part}> must be used within <Slider.Root>.`);
  }
  return context;
}

export const SliderRoot = React.forwardRef(function SliderRoot(props, ref) {
  const {
    children,
    className,
    style,
    color = 'primary',
    size = 'medium',
    track = 'normal',
    marks: marksProp = false,
    min = 0,
    max = 100,
    step = 1,
    largeStep,
    value,
    defaultValue,
    onValueChange,
    onValueCommitted,
    disabled = false,
    orientation = 'horizontal',
    name,
    ...other
  } = props;

  // Mirror the value so Material-only parts (Track, Marks, ValueLabel) can
  // derive positions without reaching into Base UI internals.
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? min);
  const rawValue = value ?? internalValue;
  const values = React.useMemo(
    () => (Array.isArray(rawValue) ? rawValue : [rawValue]),
    [rawValue],
  );
  const range = values.length > 1;

  const handleValueChange = (newValue, eventDetails) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue, eventDetails);
  };

  const marks = React.useMemo(() => {
    if (marksProp === true && step > 0) {
      return [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
        value: min + step * index,
      }));
    }
    return Array.isArray(marksProp) ? marksProp : [];
  }, [marksProp, step, min, max]);
  const marked = marks.length > 0 && marks.some((mark) => mark.label);

  const trackOffset = valueToPercent(range ? values[0] : min, min, max);
  const trackLeap = valueToPercent(values[values.length - 1], min, max) - trackOffset;

  const contextValue = React.useMemo(
    () => ({ values, min, max, marks, track, range, disabled, orientation }),
    [values, min, max, marks, track, range, disabled, orientation],
  );

  return (
    <SliderContext.Provider value={contextValue}>
      <BaseSlider.Root
        // Layout-neutral wrapper: the Control below is the .MuiSlider-root box.
        style={{ display: 'contents' }}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        onValueCommitted={onValueCommitted}
        min={min}
        max={max}
        step={step}
        largeStep={largeStep}
        disabled={disabled}
        orientation={orientation}
        name={name}
      >
        <BaseSlider.Control
          ref={ref}
          className={clsx('MuiSlider-root', className)}
          data-color={color}
          data-size={size}
          data-track={String(track)}
          data-marked={marked || undefined}
          style={{
            '--Slider-track-offset': `${trackOffset}%`,
            '--Slider-track-leap': `${trackLeap}%`,
            ...style,
          }}
          {...other}
        >
          {children}
        </BaseSlider.Control>
      </BaseSlider.Root>
    </SliderContext.Provider>
  );
});

export const SliderRail = React.forwardRef(function SliderRail(props, ref) {
  useSliderContext('Rail');
  return <span ref={ref} {...props} className={clsx('MuiSlider-rail', props.className)} />;
});

export const SliderTrack = React.forwardRef(function SliderTrack(props, ref) {
  useSliderContext('Track');
  return <span ref={ref} {...props} className={clsx('MuiSlider-track', props.className)} />;
});

// Data-driven by design: marks come from data on Root, not from user markup.
// See the composition RFC, open question 2.
export function SliderMarks() {
  const { values, min, max, marks, track, range } = useSliderContext('Marks');

  return marks
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
    });
}

export const SliderThumb = React.forwardRef(function SliderThumb(props, ref) {
  const {
    children,
    className,
    index = 0,
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    style,
    ...other
  } = props;
  const { values, min, max } = useSliderContext('Thumb');

  const [hovered, setHovered] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    if (!pressed) {
      return undefined;
    }
    const handlePointerUp = () => setPressed(false);
    document.addEventListener('pointerup', handlePointerUp);
    return () => document.removeEventListener('pointerup', handlePointerUp);
  }, [pressed]);

  const value = values[index] ?? values[0];
  const percent = valueToPercent(value, min, max);

  const thumbContextValue = React.useMemo(
    () => ({ index, value, open: hovered || focusVisible || pressed }),
    [index, value, hovered, focusVisible, pressed],
  );

  return (
    <ThumbContext.Provider value={thumbContextValue}>
      <BaseSlider.Thumb
        ref={ref}
        index={index}
        className={clsx('MuiSlider-thumb', className)}
        data-active={pressed || undefined}
        data-focus-visible={focusVisible || undefined}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          setHovered(true);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          setHovered(false);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          setPressed(true);
        }}
        // onFocus/onBlur are forwarded to the hidden input by Base UI.
        onFocus={(event) => {
          onFocus?.(event);
          let isFocusVisible = true;
          try {
            isFocusVisible = event.target.matches(':focus-visible');
          } catch (error) {
            // older environments without :focus-visible — treat focus as visible
          }
          setFocusVisible(isFocusVisible);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setFocusVisible(false);
        }}
        // Positioning is owned by Base UI (inline inset + translate); the var
        // stays part of the public contract for reading/debugging.
        style={{ '--Slider-thumb-offset': `${percent}%`, ...style }}
        {...other}
      >
        {children}
      </BaseSlider.Thumb>
    </ThumbContext.Provider>
  );
});

export const SliderValueLabel = React.forwardRef(function SliderValueLabel(props, ref) {
  const { children, className, open: openProp, ...other } = props;
  const thumbContext = React.useContext(ThumbContext);
  if (thumbContext === null) {
    throw new Error('MUI: <Slider.ValueLabel> must be used within <Slider.Thumb>.');
  }
  const { index, value, open: openState } = thumbContext;
  const open = openProp ?? openState;

  let content = children ?? value;
  if (typeof children === 'function') {
    content = children(value, index);
  }

  return (
    <span
      ref={ref}
      aria-hidden
      {...other}
      className={clsx('MuiSlider-valueLabel', className)}
      data-open={open || undefined}
    >
      {content}
    </span>
  );
});
