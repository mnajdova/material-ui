import PropTypes from 'prop-types';
import { chainPropTypes } from '@material-ui/utils';

const propTypes = {
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
  
  export default propTypes;
  