import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { chainPropTypes } from '@material-ui/utils';
import useIsFocusVisible from '../utils/useIsFocusVisible';
import ownerDocument from '../utils/ownerDocument';
import useEventCallback from '../utils/useEventCallback';
import useForkRef from '../utils/useForkRef';
import useControlled from '../utils/useControlled';
import ValueLabelComponent from './ValueLabel';
import { getClassWithValueAndKey, getClassWithKeyOnly } from '../styles/classNameBuilders';

function asc(a, b) {
  return a - b;
}

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

function findClosest(values, currentValue) {
  const { index: closestIndex } = values.reduce((acc, value, index) => {
    const distance = Math.abs(currentValue - value);

    if (acc === null || distance < acc.distance || distance === acc.distance) {
      return {
        distance,
        index,
      };
    }

    return acc;
  }, null);
  return closestIndex;
}

function trackFinger(event, touchId) {
  if (touchId.current !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId.current) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function valueToPercent(value, min, max) {
  return ((value - min) * 100) / (max - min);
}

function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}

function getDecimalPrecision(num) {
  // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
  // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const matissaDecimalPart = parts[0].split('.')[1];
    return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
  }

  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValueToStep(value, step, min) {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function setValueIndex({ values, source, newValue, index }) {
  // Performance shortcut
  if (source[index] === newValue) {
    return source;
  }

  const output = values.slice();
  output[index] = newValue;
  return output;
}

function focusThumb({ sliderRef, activeIndex, setActive }) {
  if (
    !sliderRef.current.contains(document.activeElement) ||
    Number(document.activeElement.getAttribute('data-index')) !== activeIndex
  ) {
    sliderRef.current.querySelector(`[role="slider"][data-index="${activeIndex}"]`).focus();
  }

  if (setActive) {
    setActive(activeIndex);
  }
}

const axisProps = {
  horizontal: {
    offset: (percent) => ({ left: `${percent}%` }),
    leap: (percent) => ({ width: `${percent}%` }),
  },
  'horizontal-reverse': {
    offset: (percent) => ({ right: `${percent}%` }),
    leap: (percent) => ({ width: `${percent}%` }),
  },
  vertical: {
    offset: (percent) => ({ bottom: `${percent}%` }),
    leap: (percent) => ({ height: `${percent}%` }),
  },
};

const Identity = (x) => x;

const useSliderClasses = (props) => {
  const slots = ['root', 'rail', 'thumb', 'track', 'valueLabel', 'mark', 'markLabel'];
  const utilityClasses = {};

  slots.forEach((slot) => {
    const slotClassName = `MuiSlider-${slot === 'root' ? '' : slot}`;
    utilityClasses[slot] = clsx(
      slotClassName,
      getClassWithValueAndKey(props.color, 'color', slotClassName),
      getClassWithValueAndKey(props.orientation, 'orientation', slotClassName),
      getClassWithKeyOnly(props.disabled, 'disabled', slotClassName),
      getClassWithKeyOnly(props.marked, 'marked', slotClassName),
      getClassWithValueAndKey(props.track, 'track', slotClassName),
      getClassWithKeyOnly(props.focusVisible, 'focusVisible', slotClassName),
    );
  });

  return utilityClasses;
};

const Slider = React.forwardRef(function Slider(props, ref) {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-valuetext': ariaValuetext,
    className,
    classes = {},
    color = 'primary',
    component: Component = 'span',
    defaultValue,
    disabled = false,
    getAriaLabel,
    getAriaValueText,
    marks: marksProp = false,
    max = 100,
    min = 0,
    name,
    onChange,
    onChangeCommitted,
    onMouseDown,
    orientation = 'horizontal',
    scale = Identity,
    step = 1,
    track = 'normal',
    value: valueProp,
    valueLabelDisplay = 'off',
    valueLabelFormat = Identity,
    isRtl = false,
    components = {},
    componentsProps = {},
    ...other
  } = props;

  const touchId = React.useRef();
  // We can't use the :active browser pseudo-classes.
  // - The active state isn't triggered when clicking on the rail.
  // - The active state isn't transfered when inversing a range slider.
  const [active, setActive] = React.useState(-1);
  const [open, setOpen] = React.useState(-1);

  const [valueDerived, setValueState] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'Slider',
  });

  const range = Array.isArray(valueDerived);
  let values = range ? valueDerived.slice().sort(asc) : [valueDerived];
  values = values.map((value) => clamp(value, min, max));
  const marks =
    marksProp === true && step !== null
      ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
          value: min + step * index,
        }))
      : marksProp || [];

  const { isFocusVisible, onBlurVisible, ref: focusVisibleRef } = useIsFocusVisible();
  const [focusVisible, setFocusVisible] = React.useState(-1);

  const sliderRef = React.useRef();
  const handleFocusRef = useForkRef(focusVisibleRef, sliderRef);
  const handleRef = useForkRef(ref, handleFocusRef);

  const handleFocus = useEventCallback((event) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (isFocusVisible(event)) {
      setFocusVisible(index);
    }
    setOpen(index);
  });
  const handleBlur = useEventCallback(() => {
    if (focusVisible !== -1) {
      setFocusVisible(-1);
      onBlurVisible();
    }
    setOpen(-1);
  });
  const handleMouseOver = useEventCallback((event) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    setOpen(index);
  });
  const handleMouseLeave = useEventCallback(() => {
    setOpen(-1);
  });

  const handleKeyDown = useEventCallback((event) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    const value = values[index];
    const tenPercents = (max - min) / 10;
    const marksValues = marks.map((mark) => mark.value);
    const marksIndex = marksValues.indexOf(value);
    let newValue;
    const increaseKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    switch (event.key) {
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      case 'PageUp':
        if (step) {
          newValue = value + tenPercents;
        }
        break;
      case 'PageDown':
        if (step) {
          newValue = value - tenPercents;
        }
        break;
      case increaseKey:
      case 'ArrowUp':
        if (step) {
          newValue = value + step;
        } else {
          newValue = marksValues[marksIndex + 1] || marksValues[marksValues.length - 1];
        }
        break;
      case decreaseKey:
      case 'ArrowDown':
        if (step) {
          newValue = value - step;
        } else {
          newValue = marksValues[marksIndex - 1] || marksValues[0];
        }
        break;
      default:
        return;
    }

    // Prevent scroll of the page
    event.preventDefault();

    if (step) {
      newValue = roundValueToStep(newValue, step, min);
    }

    newValue = clamp(newValue, min, max);

    if (range) {
      const previousValue = newValue;
      newValue = setValueIndex({
        values,
        source: valueDerived,
        newValue,
        index,
      }).sort(asc);
      focusThumb({ sliderRef, activeIndex: newValue.indexOf(previousValue) });
    }

    setValueState(newValue);
    setFocusVisible(index);

    if (onChange) {
      onChange(event, newValue);
    }
    if (onChangeCommitted) {
      onChangeCommitted(event, newValue);
    }
  });

  const previousIndex = React.useRef();
  let axis = orientation;
  if (isRtl && orientation === 'horizontal') {
    axis += '-reverse';
  }

  const getFingerNewValue = ({ finger, move = false, values: values2, source }) => {
    const { current: slider } = sliderRef;
    const { width, height, bottom, left } = slider.getBoundingClientRect();
    let percent;

    if (axis.indexOf('vertical') === 0) {
      percent = (bottom - finger.y) / height;
    } else {
      percent = (finger.x - left) / width;
    }

    if (axis.indexOf('-reverse') !== -1) {
      percent = 1 - percent;
    }

    let newValue;
    newValue = percentToValue(percent, min, max);
    if (step) {
      newValue = roundValueToStep(newValue, step, min);
    } else {
      const marksValues = marks.map((mark) => mark.value);
      const closestIndex = findClosest(marksValues, newValue);
      newValue = marksValues[closestIndex];
    }

    newValue = clamp(newValue, min, max);
    let activeIndex = 0;

    if (range) {
      if (!move) {
        activeIndex = findClosest(values2, newValue);
      } else {
        activeIndex = previousIndex.current;
      }

      const previousValue = newValue;
      newValue = setValueIndex({
        values: values2,
        source,
        newValue,
        index: activeIndex,
      }).sort(asc);
      activeIndex = newValue.indexOf(previousValue);
      previousIndex.current = activeIndex;
    }

    return { newValue, activeIndex };
  };

  const handleTouchMove = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId);

    if (!finger) {
      return;
    }

    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      move: true,
      values,
      source: valueDerived,
    });

    focusThumb({ sliderRef, activeIndex, setActive });
    setValueState(newValue);

    if (onChange) {
      onChange(nativeEvent, newValue);
    }
  });

  const handleTouchEnd = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId);

    if (!finger) {
      return;
    }

    const { newValue } = getFingerNewValue({ finger, values, source: valueDerived });

    setActive(-1);
    if (nativeEvent.type === 'touchend') {
      setOpen(-1);
    }

    if (onChangeCommitted) {
      onChangeCommitted(nativeEvent, newValue);
    }

    touchId.current = undefined;

    const doc = ownerDocument(sliderRef.current);
    doc.removeEventListener('mousemove', handleTouchMove);
    doc.removeEventListener('mouseup', handleTouchEnd);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
  });

  const handleTouchStart = useEventCallback((event) => {
    // Workaround as Safari has partial support for touchAction: 'none'.
    event.preventDefault();
    const touch = event.changedTouches[0];
    if (touch != null) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({ finger, values, source: valueDerived });
    focusThumb({ sliderRef, activeIndex, setActive });

    setValueState(newValue);

    if (onChange) {
      onChange(event, newValue);
    }

    const doc = ownerDocument(sliderRef.current);
    doc.addEventListener('touchmove', handleTouchMove);
    doc.addEventListener('touchend', handleTouchEnd);
  });

  React.useEffect(() => {
    const { current: slider } = sliderRef;
    slider.addEventListener('touchstart', handleTouchStart);
    const doc = ownerDocument(slider);

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      doc.removeEventListener('mousemove', handleTouchMove);
      doc.removeEventListener('mouseup', handleTouchEnd);
      doc.removeEventListener('touchmove', handleTouchMove);
      doc.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchEnd, handleTouchMove, handleTouchStart]);

  const handleMouseDown = useEventCallback((event) => {
    if (onMouseDown) {
      onMouseDown(event);
    }

    event.preventDefault();
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({ finger, values, source: valueDerived });
    focusThumb({ sliderRef, activeIndex, setActive });

    setValueState(newValue);

    if (onChange) {
      onChange(event, newValue);
    }

    const doc = ownerDocument(sliderRef.current);
    doc.addEventListener('mousemove', handleTouchMove);
    doc.addEventListener('mouseup', handleTouchEnd);
  });

  const trackOffset = valueToPercent(range ? values[0] : min, min, max);
  const trackLeap = valueToPercent(values[values.length - 1], min, max) - trackOffset;
  const trackStyle = {
    ...axisProps[axis].offset(trackOffset),
    ...axisProps[axis].leap(trackLeap),
  };

  const Root = components.root || 'span';
  const rootProps = componentsProps.root || {};

  const Rail = components.rail || 'span';
  const railProps = componentsProps.rail || {};

  const Track = components.track || 'span';
  const trackProps = componentsProps.track || {};

  const Thumb = components.thumb || 'span';
  const thumbProps = componentsProps.thumb || {};

  const ValueLabel = components.valueLabel || ValueLabelComponent;
  const valueLabelProps = componentsProps.valueLabel || {};

  const Mark = components.mark || 'span';
  const markProps = componentsProps.mark || {};

  const MarkLabel = components.markLabel || 'span';
  const markLabelProps = componentsProps.markLabel || {};

  // all props with defaults
  // consider extracting to hook an reusing the lint rule for the varints
  const stateAndProps = {
    ...props,
    color,
    disabled,
    max,
    min,
    orientation,
    scale,
    step,
    track,
    valueLabelDisplay,
    valueLabelFormat,
    isRtl,
  };

  const utilityClasses = useSliderClasses({
    ...stateAndProps,
    marked: marks.length > 0 && marks.some((mark) => mark.label),
  });

  return (
    <Root
      ref={handleRef}
      className={clsx(className, classes.root, utilityClasses.root)}
      onMouseDown={handleMouseDown}
      marked={marks.length > 0 && marks.some((mark) => mark.label)}
      {...stateAndProps}
      {...rootProps}
    >
      <Rail {...stateAndProps} {...railProps} className={clsx(classes.rail, utilityClasses.rail)} />
      <Track {...stateAndProps} {...trackProps} className={clsx(classes.track, utilityClasses.track)} style={trackStyle} />
      <input value={values.join(',')} name={name} type="hidden" />
      {marks.map((mark, index) => {
        const percent = valueToPercent(mark.value, min, max);
        const style = axisProps[axis].offset(percent);

        let markActive;
        if (track === false) {
          markActive = values.indexOf(mark.value) !== -1;
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
          <React.Fragment key={mark.value}>
            <Mark
              style={style}
              data-index={index}
              {...stateAndProps}
              {...markProps}
              className={clsx(
                classes.mark,
                utilityClasses.mark,
                getClassWithKeyOnly(markActive, 'markActive', 'MuiSlider__mark'),
              )}
              markActive={markActive}
            />
            {mark.label != null ? (
              <MarkLabel
                aria-hidden
                data-index={index}
                style={style}
                {...stateAndProps}
                {...markLabelProps}
                className={clsx(
                  classes.mark,
                  utilityClasses.markLabel,
                  getClassWithKeyOnly(markActive, 'markLabelActive', 'MuiSlider__markLabel'),
                )}
                markLabelActive={markActive}
              >
                {mark.label}
              </MarkLabel>
            ) : null}
          </React.Fragment>
        );
      })}
      {values.map((value, index) => {
        const percent = valueToPercent(value, min, max);
        const style = axisProps[axis].offset(percent);

        return (
          <ValueLabel
            key={index}
            valueLabelFormat={valueLabelFormat}
            valueLabelDisplay={valueLabelDisplay}
            className={clsx(classes.valueLabel, utilityClasses.valueLabel)}
            value={
              typeof valueLabelFormat === 'function'
                ? valueLabelFormat(scale(value), index)
                : valueLabelFormat
            }
            index={index}
            open={open === index || active === index || valueLabelDisplay === 'on'}
            disabled={disabled}
            {...stateAndProps}
            {...valueLabelProps}
          >
            <Thumb
              className={clsx(
                {
                  'MuiSlider--active': active === index,
                },
                classes.thumb,
                utilityClasses.thumb,
              )}
              {...stateAndProps}
              {...thumbProps}
              active={active === index}
              focusVisible={focusVisible === index}
              tabIndex={disabled ? null : 0}
              role="slider"
              style={style}
              data-index={index}
              aria-label={getAriaLabel ? getAriaLabel(index) : ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-orientation={orientation}
              aria-valuemax={scale(max)}
              aria-valuemin={scale(min)}
              aria-valuenow={scale(value)}
              aria-valuetext={
                getAriaValueText ? getAriaValueText(scale(value), index) : ariaValuetext
              }
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
            />
          </ValueLabel>
        );
      })}
    </Root>
  );
});

Slider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The label of the slider.
   */
  'aria-label': chainPropTypes(PropTypes.string, (props) => {
    const range = Array.isArray(props.value || props.defaultValue);

    if (range && props['aria-label'] != null) {
      return new Error(
        'Material-UI: You need to use the `getAriaLabel` prop instead of `aria-label` when using a range slider.',
      );
    }

    return null;
  }),
  /**
   * The id of the element containing a label for the slider.
   */
  'aria-labelledby': PropTypes.string,
  /**
   * A string value that provides a user-friendly name for the current value of the slider.
   */
  'aria-valuetext': chainPropTypes(PropTypes.string, (props) => {
    const range = Array.isArray(props.value || props.defaultValue);

    if (range && props['aria-valuetext'] != null) {
      return new Error(
        'Material-UI: You need to use the `getAriaValueText` prop instead of `aria-valuetext` when using a range slider.',
      );
    }

    return null;
  }),
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: PropTypes.oneOf(['primary', 'secondary']),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The default element value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
  /**
   * If `true`, the slider will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * Accepts a function which returns a string value that provides a user-friendly name for the thumb labels of the slider.
   *
   * @param {number} index The thumb label's index to format.
   * @returns {string}
   */
  getAriaLabel: PropTypes.func,
  /**
   * Accepts a function which returns a string value that provides a user-friendly name for the current value of the slider.
   *
   * @param {number} value The thumb label's value to format.
   * @param {number} index The thumb label's index to format.
   * @returns {string}
   */
  getAriaValueText: PropTypes.func,
  /**
   * Indicates whether the theme context has rtl direction. It is set automatically.
   */
  isRtl: PropTypes.boolean,
  /**
   * Marks indicate predetermined values to which the user can move the slider.
   * If `true` the marks will be spaced according the value of the `step` prop.
   * If an array, it should contain objects with `value` and an optional `label` keys.
   */
  marks: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.number.isRequired,
      }),
    ),
    PropTypes.bool,
  ]),
  /**
   * The maximum allowed value of the slider.
   * Should not be equal to min.
   */
  max: PropTypes.number,
  /**
   * The minimum allowed value of the slider.
   * Should not be equal to max.
   */
  min: PropTypes.number,
  /**
   * Name attribute of the hidden `input` element.
   */
  name: PropTypes.string,
  /**
   * Callback function that is fired when the slider's value changed.
   *
   * @param {object} event The event source of the callback. **Warning**: This is a generic event not a change event.
   * @param {number | number[]} value The new value.
   */
  onChange: PropTypes.func,
  /**
   * Callback function that is fired when the `mouseup` is triggered.
   *
   * @param {object} event The event source of the callback. **Warning**: This is a generic event not a change event.
   * @param {number | number[]} value The new value.
   */
  onChangeCommitted: PropTypes.func,
  /**
   * @ignore
   */
  onMouseDown: PropTypes.func,
  /**
   * The slider orientation.
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * A transformation function, to change the scale of the slider.
   */
  scale: PropTypes.func,
  /**
   * The granularity with which the slider can step through values. (A "discrete" slider.)
   * The `min` prop serves as the origin for the valid values.
   * We recommend (max - min) to be evenly divisible by the step.
   *
   * When step is `null`, the thumb can only be slid onto marks provided with the `marks` prop.
   */
  step: PropTypes.number,
  /**
   * The component used to display the value label.
   */
  ThumbComponent: PropTypes.elementType,
  /**
   * The track presentation:
   *
   * - `normal` the track will render a bar representing the slider value.
   * - `inverted` the track will render a bar representing the remaining slider value.
   * - `false` the track will render without a bar.
   */
  track: PropTypes.oneOf(['inverted', 'normal', false]),
  /**
   * The value of the slider.
   * For ranged sliders, provide an array with two values.
   */
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
  /**
   * The value label component.
   */
  ValueLabelComponent: PropTypes.elementType,
  /**
   * Controls when the value label is displayed:
   *
   * - `auto` the value label will display when the thumb is hovered or focused.
   * - `on` will display persistently.
   * - `off` will never display.
   */
  valueLabelDisplay: PropTypes.oneOf(['auto', 'off', 'on']),
  /**
   * The format function the value label's value.
   *
   * When a function is provided, it should have the following signature:
   *
   * - {number} value The value label's value to format
   * - {number} index The value label's index to format
   */
  valueLabelFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

export default Slider;
